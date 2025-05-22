"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import DateFormatter from "@/components/DateFormatter";
import NewReviewGroupForm from "@/components/forms/NewReviewGroupFrom";
import {
  Plus,
  SquareX,
  EllipsisVertical,
  SquarePen,
  Eye,
  Trash2,
  X,
} from "lucide-react";
import "../../../styles/reviews/reviewGroups/_reviewGroups.scss";
import PrimaryButton from "@/components/PrimaryButton";
import OutlineButton from "@/components/OutlineButton";
import { SearchInput } from "@/components/forms/Search";

const ReviewGroups = () => {
  const router = useRouter();
  const [reviewGroups, setReviewGroups] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [serverSearchResults, setServerSearchResults] = useState([]);
  const [isServerSearching, setIsServerSearching] = useState(false);
  const [openPopupId, setOpenPopupId] = useState(null);
  const [isEmpty, setIsEmpty] = useState(localStorage.getItem("isEmpty"));
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const createUrlParams = (params) => {
    return Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
  };

  const handleEllipsisClick = (event, id) => {
    event.stopPropagation(); // Prevent triggering document click
    setOpenPopupId((prev) => (prev === id ? null : id));
  };

  const handleShowNewUserForm = () => {
    setShowNewUserForm(!showNewUserForm);
  };

  const handleRowClick = (reviewId) => {
    router.push(`/permissions/review-groups/${reviewId}/members/`);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenPopupId(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const fetchReviewGroups = async (params) => {
    try {
      const url = `/permissions/review-groups/${params ? `?${params}` : ""}`;
      const response = await api.get(url);
      if (response.status === 200) {
        return response.data;
      }
      return [];
    } catch (error) {
      if (error.response) {
        setErrorMessage(
          error.response.data.message ||
            error.response.data.error ||
            "Error setting a list of users"
        );
        console.log("error:", error);
        return [];
      } else {
        setErrorMessage("Unknown error fetching users");
      }
      console.log("error", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const data = await fetchReviewGroups();
      setReviewGroups(data);
      setIsLoading(false);
    };
    loadInitialData();
  }, []);

  const handleSearch = useCallback(async () => {
    try {
      if (searchQuery.length >= 3) {
        setIsServerSearching(true);
        setSearchError(null);
        const params = createUrlParams({
          search: searchQuery,
          page: pageNumber,
          page_size: pageSize,
        });
        const results = await fetchReviewGroups(params);
        setServerSearchResults(results);
        setReviewGroups([]);
      } else {
        setServerSearchResults([]);
        if (reviewGroups.length === 0) {
          const data = await fetchReviewGroups();
          setReviewGroups(data);
        }
      }
    } catch (error) {
      setSearchError("Failed to perform search");
      console.error("Search error:", error);
    } finally {
      setIsServerSearching(false);
    }
  }, [searchQuery, pageNumber, pageSize]);

  const handleApplyFilters = async () => {
    const params = createUrlParams({
      page: pageNumber,
      page_size: pageSize,
    });
    try {
      setIsServerSearching(true);
      const data = await fetchReviewGroups(params);
      setReviewGroups(data);
      setServerSearchResults([]);
    } catch (error) {
      console.error("Error in filtering data:", error);
    } finally {
      setIsServerSearching(false);
      setShowFilters(false);
    }
  };

  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, handleSearch]);

  return isLoading ? (
    <div className="dashboard-page-content">
      <p>Loading...</p>
    </div>
  ) : (
    <div className="dashboard-page-content">
      {showNewUserForm && (
        <div className="new-user-form-popup">
          <div className="popup">
            <div className="popup-content">
              <div className="close">
                <X
                  onClick={handleShowNewUserForm}
                  className="close-icon"
                  size={34}
                />
              </div>
              <div className="form">
                <NewReviewGroupForm />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="actions">
        <div className="title">
          <div>
            <h3>Review Groups</h3>
            <span>
              {isEmpty
                ? reviewGroups.length
                : searchResults?.length > 0
                ? searchResults?.length
                : reviewGroups.length}
            </span>{" "}
            <span>Available</span>
          </div>
        </div>

        <div className="search-filter">
          <SearchInput
            value={searchQuery}
            setValue={setSearchQuery}
            isSearching={isServerSearching}
            label={"Search reviews by name"}
          />
        </div>

        <div className="filters">
          <div>
            <span>Page: {pageNumber}</span>
            <span>Per page: {pageSize}</span>
          </div>
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
        </div>

        <button
          type="button"
          onClick={handleShowNewUserForm}
          className="button tertiary-button new-user-button"
        >
          <Plus size={20} />
          <span>Add New Group</span>
        </button>
      </div>
      {/* users table */}
      <div className="table-container">
        <table className="review-groups-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Group Name</th>
              <th>Description</th>
              <th>Date Added</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      </div>

      <div className="mobile-users">
        {isServerSearching ? (
          <p>Searching database...</p>
        ) : searchQuery.length >= 3 ? (
          serverSearchResults.length > 0 ? (
            serverSearchResults.map((reviewGroup) => (
              <div key={reviewGroup.id} className="user-card">
                <p>{reviewGroup.title}</p>
                <small>{reviewGroup.description}</small>
              </div>
            ))
          ) : (
            <p>No review groups match your search</p>
          )
        ) : reviewGroups.length > 0 ? (
          reviewGroups.map((reviewGroup) => (
            <div key={reviewGroup.id} className="user-card">
              <p>{reviewGroup.title}</p>
              <small>{reviewGroup.description}</small>
            </div>
          ))
        ) : (
          <p>No review groups available</p>
        )}
      </div>
    </div>
  );

  function renderTableBody() {
    // Determine which data to show based on search state
    const displayData =
      searchQuery.length >= 3 ? serverSearchResults : reviewGroups;
    const isSearchActive = searchQuery.length >= 3;
    const noResults = displayData.length === 0;

    // Loading state for server search
    if (isServerSearching) {
      return (
        <tr>
          <td colSpan="5" className="searching_database">
            <p>Searching database...</p>
          </td>
        </tr>
      );
    }

    // No results state
    if (noResults) {
      return (
        <tr>
          <td colSpan="5">
            {isSearchActive
              ? "No review groups match your search"
              : "No review groups available"}
          </td>
        </tr>
      );
    }

    // Render the table rows
    return displayData.map((reviewGroup) => (
      <tr key={reviewGroup.id} onClick={() => handleRowClick(reviewGroup.id)}>
        <td>{reviewGroup.id}</td>
        <td>{reviewGroup.title}</td>
        <td>{reviewGroup.description}</td>
        <td>
          <DateFormatter dateString={reviewGroup.created_at} />
        </td>
        <td className="table-actions" style={{ position: "relative" }}>
          <div onClick={(e) => handleEllipsisClick(e, reviewGroup.id)}>
            <EllipsisVertical />
          </div>
          {openPopupId === reviewGroup.id && (
            <div className="actions-popup">
              <div className="edit-btn">
                <SquarePen size={20} />
                <span>Edit</span>
              </div>
              <div className="details-btn">
                <Eye size={20} />
                <span>Details</span>
              </div>
              <div className="delete-btn">
                <Trash2 size={20} />
                <span>Delete</span>
              </div>
            </div>
          )}
        </td>
      </tr>
    ));
  }
};

export default ReviewGroups;
