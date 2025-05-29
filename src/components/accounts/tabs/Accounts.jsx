"use client";
import api, { createUrlParams } from "@/utils/api";
import { LoaderCircle, Plus, X } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import PrimaryButton from "@/components/PrimaryButton";
import OutlineButton from "@/components/OutlineButton";
import UserCard from "@/components/UserCard";
import { SearchInput } from "@/components/forms/Search";
import NewUserForm from "../forms/newUser/newUserForm";
import { useRouter } from "next/navigation";

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

  return (
    <>
      <div>
        <div className="filters">
          <SearchInput
            value={searchQuery}
            setValue={setSearchQuery}
            isSearching={isSearching}
            label={"Search users by email, names or phone number"}
          />

          <div className="actions">
            {/* <span>Page: {page} of {total_pages}</span> */}
            <span>Total users: {count}</span>
            {/* <span>Page: {page_size}</span> */}
            <div className="filters-popup">
              <OutlineButton
                onClick={() => setShowFilters(!showFilters)}
                span={"Filters"}
                prefixIcon={showFilters ? <X /> : <Plus />}
              />

              {showFilters ? (
                <div className="side-popup">
                  <div className="popup-content">
                    <h3>Filters</h3>
                    <form>
                      <div className="half">
                        <div className="form-group">
                          <label htmlFor="pageSize">Items per page</label>
                          <select
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
                        </div>
                      </div>
                    </form>

                    <PrimaryButton
                      text={"Apply filters"}
                      onClick={handleApplyFilters}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>

            <PrimaryButton
              onClick={() => setShowNewUserForm(true)}
              span="Add user"
              prefixIcon={<Plus />}
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
                      <th>Phone</th>
                      <th>Facility</th>
                    </tr>
                  </thead>
                  <tbody className={`${isSearching && "is-searching"}`}>
                    {users.map((user) => (
                      <tr key={user.id} onClick={() => handleNavigate(user)}>
                        <td>
                          <UserCard
                            firstName={user.user.first_name}
                            lastName={user.user.last_name}
                            label={user.user.email}
                          />
                        </td>
                        <td>{user.phone_number || "-"}</td>
                        <td>{user?.facility?.name || "-"}</td>
                      </tr>
                    ))}
                    <tr></tr>
                  </tbody>
                </table>
                <div className="pagination-controls">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={!usersData.has_previous}
                  >
                    Previous
                  </button>
                  <span>Page {page} of {total_pages}</span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={!usersData.has_next}
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