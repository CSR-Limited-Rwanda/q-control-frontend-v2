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

const DEFAULT_PAGE_SIZE = 10

const ReviewGroups = () => {
  const [reviewGroupsData, setReviewGroupsData] = useState({
    results: [],
    count: 0,
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
    total_pages: 1,
    has_next: false,
    has_previous: false
  })
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isServerSearching, setIsServerSearching] = useState(false)
  const [showNewUserForm, setShowNewUserForm] = useState(false)
  const [serverSearchResults, setServerSearchResults] = useState([])

  const createUrlParams = (params) =>
    Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== "")
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&")


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

  const fetchReviewGroups = useCallback(async (params = "", isSearch = false) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/permissions/review-groups/?${params}`);
      if (response.status === 200) {
        if(isSearch) {
          setServerSearchResults(response.data.results)
        } else {
          setReviewGroupsData(response.data)
        }
      } else {
        setErrorMessage("Failed to fetch review groups");
      }
    } catch (error) {
      console.error("Error fetching review groups:", error);
      setErrorMessage("Error fetching review groups");
    } finally {
      setIsLoading(false);
      setIsServerSearching(false);
    }
  }, []);


  useEffect(() => {
    const loadInitialData = async () => {
      await fetchReviewGroups()
      setIsLoading(false);
    };
    loadInitialData();
  }, []);

  const handleSearch = useCallback(() => {
    if (searchQuery.length === 0 || searchQuery.length >= 3) {
      setIsServerSearching(true)
      const params = createUrlParams({
        q: searchQuery,
        page: 1,
        page_size: reviewGroupsData.page_size
      })
      fetchReviewGroups(params, true)
    }
  }, [searchQuery, fetchReviewGroups, reviewGroupsData.page_size])

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > reviewGroupsData.total_pages) return
    const params = createUrlParams({
      q: searchQuery.trim(),
      page: newPage,
      page_size: reviewGroupsData.page_size
    })
    fetchReviewGroups(params)
  }

  const handlePageSizeChange = (newSize) => {
    const params = createUrlParams({
      q: searchQuery.trim(),
      page: 1,
      page_size: newSize
    })
    fetchReviewGroups(params)
  }

  const handleApplyFilters = async () => {
    const params = createUrlParams({
      page: pageNumber,
      page_size: pageSize,
    });
    try {
      setIsServerSearching(true);
      const data = await fetchReviewGroups(params);
      setReviewGroupsData(data);
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

  useEffect(() => {
    fetchReviewGroups()
  }, [fetchReviewGroups])

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
            {searchQuery.length >= 3 && serverSearchResults.length > 0
              ? serverSearchResults.length
              : reviewGroupsData.results.length}
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
              {/* <th>Action</th> */}
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      </div>
    </div>
  );

  function renderTableBody() {
    // Determine which data to show based on search state
    const displayData =
      searchQuery.length >= 3 ? serverSearchResults : reviewGroupsData.results;
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
      <tr key={reviewGroup.id}>
        <td>{reviewGroup.id}</td>
        <td>{reviewGroup.title || "N/A"}</td>
        <td>{reviewGroup.description || "N/A"}</td>
        <td><DateFormatter dateString={reviewGroup.created_at || "N/A"} /></td>
      </tr>
    ));
  }
};

export default ReviewGroups;
