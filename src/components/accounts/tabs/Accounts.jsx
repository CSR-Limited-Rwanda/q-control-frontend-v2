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

const Accounts = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isSearching, setIsSearching] = useState(false);
  const isFocused = document.activeElement;

  const handleSearch = useCallback(() => {
    if (searchQuery.length >= 3) {
      setIsSearching(true);
      const params = createUrlParams({
        q: searchQuery,
        page: pageNumber,
        page_size: pageSize,
      });
      handleFetchUsers(params);
    } else if (searchQuery.length === 0 && isFocused) {
      setIsSearching(true);
      handleFetchUsers();
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleApplyFilters = () => {
    const params = createUrlParams({
      page: pageNumber,
      page_size: pageSize,
    });
    setIsSearching(true);
    handleFetchUsers(params);
    setShowFilters(false);
  };

  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleNavigate = (user) => {
    console.log("User: ", user);
    router.push(`/accounts/profiles/${user?.id}`);
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, handleSearch]);

  const handleFetchUsers = async (params) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/users/?${params}`);
      if (response.status === 200) {
        console.log(response.data);
        setUsers(response.data);
        return;
      } else {
        setErrorMessage("Error fetching users. Contact support.");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Error fetching users. Contact support.");
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };
  useEffect(() => {
    handleFetchUsers();
  }, []);
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
            <span>Page: {pageNumber}</span>
            <span>Per page: {pageSize}</span>
            <div className="filters-popup">
              <OutlineButton
                onClick={handleShowFilters}
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
                          <label htmlFor="page">Page</label>
                          <input
                            value={pageNumber}
                            onChange={(e) => setPageNumber(e.target.value)}
                            type="number"
                            name="pageNumber"
                            id="pageNumber"
                            placeholder="Page number"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="page">Page size</label>
                          <input
                            value={pageSize}
                            onChange={(e) => setPageSize(e.target.value)}
                            type="number"
                            name="pageSize"
                            id="pageSize"
                            placeholder="Page size"
                          />
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
