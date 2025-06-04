"use client";
import api, { createUrlParams } from "@/utils/api";
import { LoaderCircle, Plus, X, CirclePlus, ChevronDown } from "lucide-react";
import React, { useEffect, useState, useCallback, useRef } from "react";
import PrimaryButton from "@/components/PrimaryButton";
import OutlineButton from "@/components/OutlineButton";
import UserCard from "@/components/UserCard";
import { SearchInput } from "@/components/forms/Search";
import NewUserForm from "../forms/newUser/newUserForm";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

const DEFAULT_PAGE_SIZE = 10

const Accounts = () => {
  const router = useRouter();
  const [usersData, setUsersData] = useState({
    results: [],
    count: 0,
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
    total_pages: 1,
    has_next: false,
    has_previous: false
  })
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const selectRef = useRef(null)

  const { results: users, page, page_size, count, total_pages } = usersData

  const fetchUsers = useCallback(async (params = '') => {
    setIsLoading(true)
    try {
      const response = await api.get(`/users/?${params}`)
      if (response.status === 200) {
        console.log('users', response.data)
        setUsersData(response.data)
      } else {
        setErrorMessage("Error fetching users.")
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      setErrorMessage("Error fetching users")
    } finally {
      setIsLoading(false)
      setIsSearching(false)
    }
  }, [])

  const handleSearch = useCallback(() => {
    console.log("Searching for:", searchQuery)
    // Allow empty search or minimum 3 characters
    if (searchQuery.length >= 3 || searchQuery.length === 0) {
      setIsSearching(true)
      const params = createUrlParams({
        q: searchQuery.trim(), // Trim whitespace
        page: 1, // Reset to first page on new search
        page_size: page_size
      })
      fetchUsers(params)
    }
  }, [searchQuery, page_size, fetchUsers])

  const handleApplyFilters = () => {
    setShowFilters(false)
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > total_pages) return

    const params = createUrlParams({
      q: searchQuery.trim(),
      page: newPage,
      page_size: page_size
    })
    fetchUsers(params)
  }

  const handlePageSizeChange = (newSize) => {
    setUsersData(prev => ({
      ...prev,
      page_size: newSize
    }))

    const params = createUrlParams({
      q: searchQuery.trim(),
      page: 1,
      page_size: newSize
    })
    fetchUsers(params)
  }

  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleNavigate = (user) => {
    console.log("User: ", user);
    router.push(`/accounts/profiles/${user?.id}`);
  };

  // Fixed debouncing effect - now properly watches searchQuery changes
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      handleSearch()
    }, 300)

    return () => clearTimeout(debounceTimeout)
  }, [searchQuery, handleSearch]) // Added proper dependencies

  // Initial load - only runs once on mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // formatting date
  function formatDate(isoString) {
    return format(new Date(isoString), 'dd/MM/yyyy')
  }

  // 
  const openDropdown = () => {
    if(selectRef.current) {
      if(selectRef.current.showPicker) {
        selectRef.current.showPicker()
      } else {
        selectRef.current.focus()
        selectRef.current.click()
      }
    }
  }

  return (
    <>
      <div className="users-container">
        <div className="filters">
          <div className="list-of-users">
            <h3>List of users</h3>
            <p>{count} available user(s)</p>
          </div>
          <SearchInput
            value={searchQuery}
            setValue={setSearchQuery}
            isSearching={isSearching}
            label={"Search users by email, names or phone number"}
          />

          <div className="actions">
            <form>
              <div className="half">
                <span>Show</span>
                <div className="form-group">
                  <select
                    ref={selectRef}
                    value={page_size}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    name="pageSize"
                    id="pageSize"
                  >
                    <option value="5">5</option> 
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                  <ChevronDown size={24} onClick={openDropdown} className="filter-icon" />
                </div>
              </div>
            </form>
            <PrimaryButton
              onClick={() => setShowNewUserForm(true)}
              span="New User"
              prefixIcon={<CirclePlus />}
              customClass={"sticky-button"}
            />
          </div>
        </div>
        {isLoading && users.length < 1 ? (
          <LoaderCircle className="loading-icon" />
        ) : errorMessage ? (
          <div className="message error">
            <span>{errorMessage}</span>
          </div>
        ) : (
          <div className="users-table">
            {users.length > 0 ? (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>Names</th>
                      <th>ID</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Department</th>
                      <th>Date added</th>
                      {/* <th>Facility</th> */}
                    </tr>
                  </thead>
                  <tbody className={`${isSearching && "is-searching"}`}>
                    {users.map((user) => (
                      <tr key={user.id} onClick={() => handleNavigate(user)}>
                        <td>
                          <UserCard
                            firstName={user.user?.first_name || "N/A"}
                            lastName={user.user?.last_name || "N/A"}
                            label={user.user?.position || "N/A"}
                          />
                        </td>
                        <td>{user.id || "N/A"}</td>
                        <td>{user.user?.email || "N/A"}</td>
                        <td>{user?.phone_number || "N/A"}</td>
                        <td>{user?.department?.name || "N/A"}</td>
                        {/* <td>{user?.facility?.name || "N/A"}</td> */}
                        <td>{formatDate(user.created_at)}</td>
                      </tr>
                    ))}
                    <tr></tr>
                  </tbody>
                </table>
                <div className="pagination-controls">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={!usersData.has_previous}
                    className="pagination-button"
                  >
                    Previous
                  </button>

                  {page > 2 && (
                    <button
                      onClick={() => handlePageChange(1)}
                      className="pagination-button"
                    >
                      1
                    </button>
                  )}
                  {page > 3 && <span className="pagination-ellipsis">...</span>}

                  {/* pages around current page */}
                  {Array.from({ length: Math.min(5, total_pages) }, (_, i) => {
                    let pageNum;
                    if (page <= 2) {
                      pageNum = i + 1;
                    } else if (page >= total_pages - 1) {
                      pageNum = total_pages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    if (pageNum > 0 && pageNum <= total_pages) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`pagination-button ${pageNum === page ? 'active' : ''}`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    return null;
                  })}

                  {/* Show ellipsis if needed */}
                  {page < total_pages - 2 && <span className="pagination-ellipsis">...</span>}

                  {/* Show last page if not in final range */}
                  {page < total_pages - 1 && (
                    <button
                      onClick={() => handlePageChange(total_pages)}
                      className="pagination-button"
                    >
                      {total_pages}
                    </button>
                  )}

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={!usersData.has_next}
                    className="pagination-button"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <div className="no-content">
                <h3>No users found</h3>
                <p>There are no users in the system.</p>
              </div>
            )}
          </div>
        )}
      </div>
      {showNewUserForm && (
        <NewUserForm handleClose={() => setShowNewUserForm(false)} />
      )}
    </>
  );
};

export default Accounts;