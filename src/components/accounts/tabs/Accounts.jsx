"use client";

import toast from "react-hot-toast";
import api, { createUrlParams } from "@/utils/api";
import {
  LoaderCircle,
  CirclePlus,
  ChevronDown,
  Ellipsis,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
} from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import PrimaryButton from "@/components/PrimaryButton";
import UserCard from "@/components/UserCard";
import { SearchInput } from "@/components/forms/Search";
import NewUserForm from "../forms/newUser/newUserForm";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { openDropdown } from "@/utils/dropdownUtils";
import SortableHeader from "@/components/SortableHeader";
import useSorting from "@/hooks/useSorting";
import PermissionsGuard from "@/components/PermissionsGuard";

const DEFAULT_PAGE_SIZE = 10;

const Accounts = ({ permissions }) => {
  const router = useRouter();
  const [usersData, setUsersData] = useState({
    results: [],
    count: 0,
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
    total_pages: 1,
    has_next: false,
    has_previous: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const { sortField, sortOrder, handleSort, getSortParams } = useSorting();
  const { results: users, page, page_size, count, total_pages } = usersData;

  const fetchUsers = useCallback(async (params = "") => {
    const sortParams = getSortParams();
    const fullParams = `${params}&${createUrlParams(sortParams)}`;
    setIsLoading(true);
    try {
      const response = await api.get(`/users/?${params}`);
      if (response.status === 200) {
        setUsersData(response.data);
      } else {
        toast.error("Error fetching users.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users");
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, []);

  const handleSearch = useCallback(() => {
    // Allow empty search or minimum 3 characters
    if (searchQuery.length >= 3 || searchQuery.length === 0) {
      setIsSearching(true);
      const params = createUrlParams({
        q: searchQuery.trim(),
        page: 1,
        page_size: page_size,
        sort_by: sortField,
        sort_order: sortOrder,
      });
      fetchUsers(params);
    }
  }, [searchQuery, page_size, fetchUsers]);

  const handleApplyFilters = () => {
    setShowFilters(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > total_pages) return;

    const params = createUrlParams({
      q: searchQuery.trim(),
      page: newPage,
      page_size: page_size,
    });
    fetchUsers(params);
  };

  const handlePageSizeChange = (newSize) => {
    setUsersData((prev) => ({
      ...prev,
      page_size: newSize,
    }));

    const params = createUrlParams({
      q: searchQuery.trim(),
      page: 1,
      page_size: newSize,
      sort_by: sortField,
      sort_order: sortOrder,
    });
    fetchUsers(params);
  };

  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleNavigate = (user) => {
    if (permissions && permissions.accounts?.includes("view_profile")) {
      router.push(`/accounts/${user?.id}`);
    } else {
      return;
    }
  };

  // Fixed debouncing effect - now properly watches searchQuery changes
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, handleSearch]); // Added proper dependencies

  // Initial load - only runs once on mount
  useEffect(() => {
    const params = createUrlParams({
      sort_by: sortField,
      sort_order: sortOrder,
    });
    fetchUsers(params);
  }, [fetchUsers, sortField, sortOrder]);

  // formatting date
  function formatDate(isoString) {
    return format(new Date(isoString), "dd/MM/yyyy");
  }

  return (
    <PermissionsGuard model={"accounts"} codename={"view_list"}>
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
            label={"Search users by email or name"}
          />

          <div className="actions">
            <form>
              <div className="half">
                <span>Show</span>
                <div className="form-group">
                  <select
                    value={page_size}
                    onChange={(e) =>
                      handlePageSizeChange(Number(e.target.value))
                    }
                    name="pageSize"
                    id="pageSize"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                  <ChevronDown
                    size={24}
                    onClick={() => openDropdown("pageSize")}
                    className="filter-icon"
                  />
                </div>
              </div>
            </form>
            {permissions && permissions.accounts?.includes("add_profile") && (
              <PrimaryButton
                onClick={() => setShowNewUserForm(true)}
                span="New User"
                prefixIcon={<CirclePlus />}
                customClass={"sticky-button"}
              />
            )}
          </div>
        </div>
        {isLoading && users.length < 1 ? (
          <LoaderCircle className="loading-icon" />
        ) : (
          <div className="users-table">
            {users.length > 0 ? (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>
                        <div
                          className="sort-cell"
                          onClick={() => handleSort("id")}
                        >
                          ID
                          {sortField === "id" && sortOrder === "asc" ? (
                            <ArrowDownNarrowWide size={18} />
                          ) : sortField === "id" && sortOrder === "desc" ? (
                            <ArrowUpNarrowWide size={18} />
                          ) : (
                            <ArrowDownNarrowWide size={18} />
                          )}
                        </div>
                      </th>
                      <th>
                        <div
                          className="sort-cell"
                          onClick={() => handleSort("first_name")}
                        >
                          Name
                          {sortField === "first_name" && sortOrder === "asc" ? (
                            <ArrowDownNarrowWide size={18} />
                          ) : sortField === "first_name" &&
                            sortOrder === "desc" ? (
                            <ArrowUpNarrowWide size={18} />
                          ) : (
                            <ArrowDownNarrowWide size={18} />
                          )}
                        </div>
                      </th>

                      <th>
                        <div className="sort-cell">
                          Email
                          {sortField === "email" && sortOrder === "asc" ? (
                            <ArrowDownNarrowWide size={18} />
                          ) : sortField === "email" && sortOrder === "desc" ? (
                            <ArrowUpNarrowWide size={18} />
                          ) : (
                            <ArrowDownNarrowWide size={18} />
                          )}
                        </div>
                      </th>
                      <th>Phone number</th>
                      <th>
                        <div className="sort-cell">
                          Department
                          {sortField === "department" && sortOrder === "asc" ? (
                            <ArrowDownNarrowWide size={18} />
                          ) : sortField === "department" &&
                            sortOrder === "desc" ? (
                            <ArrowUpNarrowWide size={18} />
                          ) : (
                            <ArrowDownNarrowWide size={18} />
                          )}
                        </div>
                      </th>
                      <th>
                        <div className="sort-cell">
                          Date Added
                          {sortField === "created_at" && sortOrder === "asc" ? (
                            <ArrowDownNarrowWide size={18} />
                          ) : sortField === "created_at" &&
                            sortOrder === "desc" ? (
                            <ArrowUpNarrowWide size={18} />
                          ) : (
                            <ArrowDownNarrowWide size={18} />
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`${isSearching && "is-searching"}`}>
                    {users.map((user) => (
                      <tr key={user.id} onClick={() => handleNavigate(user)}>
                        <td data-label="ID">{user.id || "N/A"}</td>
                        <td data-label="Name">
                          <UserCard
                            firstName={user.user?.first_name || "N/A"}
                            lastName={user.user?.last_name || "N/A"}
                            label={user.user?.position || "N/A"}
                          />
                        </td>

                        <td data-label="Email">{user.user?.email || "N/A"}</td>
                        <td data-label="Phone Number">
                          {user?.phone_number || "N/A"}
                        </td>
                        <td data-label="Department">
                          {user?.department?.name || "N/A"}
                        </td>
                        <td data-label="Date Added">
                          {formatDate(user.created_at)}
                        </td>
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

                  {/* Always show first page */}
                  <button
                    onClick={() => handlePageChange(1)}
                    className={`pagination-button ${
                      1 === page ? "active" : ""
                    }`}
                  >
                    1
                  </button>

                  {/* Show ellipsis if current page is far from start */}
                  {page > 3 && (
                    <span className="pagination-ellipsis">
                      <Ellipsis />
                    </span>
                  )}

                  {/* Show one page before current if needed */}
                  {page > 2 && (
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      className="pagination-button"
                    >
                      {page - 1}
                    </button>
                  )}

                  {/* Show current page if it's not first or last */}
                  {page !== 1 && page !== total_pages && (
                    <button
                      onClick={() => handlePageChange(page)}
                      className="pagination-button active"
                    >
                      {page}
                    </button>
                  )}

                  {/* Show one page after current if needed */}
                  {page < total_pages - 1 && (
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      className="pagination-button"
                    >
                      {page + 1}
                    </button>
                  )}

                  {/* Show ellipsis if current page is far from end */}
                  {page < total_pages - 2 && (
                    <span className="pagination-ellipsis">...</span>
                  )}

                  {/* Always show last page if it's not the first page */}
                  {total_pages > 1 && (
                    <button
                      onClick={() => handlePageChange(total_pages)}
                      className={`pagination-button ${
                        total_pages === page ? "active" : ""
                      }`}
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
    </PermissionsGuard>
  );
};

export default Accounts;
