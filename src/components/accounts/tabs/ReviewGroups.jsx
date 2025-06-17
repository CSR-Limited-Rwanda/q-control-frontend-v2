"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api, { createUrlParams } from "@/utils/api";
import DateFormatter from "@/components/DateFormatter";
import NewReviewGroupForm from "@/components/forms/NewReviewGroupFrom";
import {
  ChevronDown,
  CirclePlus,
  LoaderCircle,
  ChevronsUpDown,
  ChevronUp,
  X,
} from "lucide-react";
import "../../../styles/reviews/reviewGroups/_reviewGroups.scss";
import PrimaryButton from "@/components/PrimaryButton";
import { SearchInput } from "@/components/forms/Search";
import { openDropdown } from "@/utils/dropdownUtils";
import SortableHeader from "@/components/SortableHeader";
import useSorting from "@/hooks/useSorting";

const DEFAULT_PAGE_SIZE = 10;

const ReviewGroups = () => {
  const router = useRouter();
  const [reviewGroupsData, setReviewGroupsData] = useState({
    results: [],
    count: 0,
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
    total_pages: 1,
    has_next: false,
    has_previous: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { sortField, sortOrder, handleSort, getSortParams } = useSorting();

  const {
    results: reviewGroups,
    page,
    page_size,
    count,
    total_pages,
  } = reviewGroupsData;

  // handle review group form
  const handleShowNewUserForm = () => {
    setShowNewUserForm(!showNewUserForm);
  };

  const fetchReviewGroups = useCallback(async (params = "") => {
    const sortParams = getSortParams();
    const fullParams = `${params}&${createUrlParams(sortParams)}`;
    setIsLoading(true);
    try {
      const response = await api.get(`/permissions/review-groups/?${params}`);
      if (response.status === 200) {
        setReviewGroupsData(response.data);
      } else {
        setErrorMessage("Error fetching review groups.");
      }
    } catch (error) {
      console.error("Error fetching review groups:", error);
      setErrorMessage("Error fetching review groups");
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, []);

  const handleSearch = useCallback(() => {
    if (searchQuery.length >= 3 || searchQuery.length === 0) {
      setIsSearching(true);
      const params = createUrlParams({
        q: searchQuery.trim(),
        page: 1,
        page_size: page_size,
        sort_by: sortField,
        sort_order: sortOrder,
      });
      fetchReviewGroups(params);
    }
  }, [searchQuery, page_size, fetchReviewGroups, sortField, sortOrder]);

  // const handleSort = (field) => {
  //   const newSortOrder = sortField === field ?
  //     (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';
  //   setSortField(field);
  //   setSortOrder(newSortOrder);

  //   const params = createUrlParams({
  //     q: searchQuery.trim(),
  //     page: page,
  //     page_size: page_size,
  //     sort_by: field,
  //     sort_order: newSortOrder
  //   });
  //   fetchReviewGroups(params);
  // };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > total_pages) return;

    const params = createUrlParams({
      q: searchQuery.trim(),
      page: newPage,
      page_size: page_size,
      sort_by: sortField,
      sort_order: sortOrder,
    });
    fetchReviewGroups(params);
  };

  const handlePageSizeChange = (newSize) => {
    setReviewGroupsData((prev) => ({
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
    fetchReviewGroups(params);
  };

  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleRowClick = (reviewId) => {
    router.push(`/permissions/review-groups/${reviewId}/members/`);
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      handleSearch();
    }, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, handleSearch]);

  useEffect(() => {
    const params = createUrlParams({
      sort_by: sortField,
      sort_order: sortOrder,
    });
    fetchReviewGroups(params);
  }, [fetchReviewGroups, sortField, sortOrder]);

  const renderSortIcon = (field) => {
    if (sortField !== field) return <ChevronsUpDown size={16} />;
    return sortOrder === "asc" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  return (
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
      <div className="filters">
        <div className="title">
          <div>
            <h3>Review Groups</h3>
            <p>{count} available group(s)</p>
          </div>
        </div>

        <SearchInput
          value={searchQuery}
          setValue={setSearchQuery}
          isSearching={isSearching}
          label={"Search groups by name or description"}
        />

        <div className="actions">
          <form>
            <div className="half">
              <span>Show</span>
              <div className="form-group">
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
                <ChevronDown
                  onClick={() => openDropdown("pageSize")}
                  size={24}
                  className="filter-icon"
                />
              </div>
            </div>
          </form>
          <PrimaryButton
            onClick={() => setShowNewUserForm(true)}
            span="New Group"
            prefixIcon={<CirclePlus />}
            customClass={"sticky-button"}
          />
        </div>
      </div>

      {isLoading && reviewGroups.length < 1 ? (
        <LoaderCircle className="loading-icon" />
      ) : errorMessage ? (
        <div className="message error">
          <span>{errorMessage}</span>
        </div>
      ) : (
        <div className="users-table">
          {reviewGroups.length > 0 ? (
            <>
              <table>
                <thead>
                  <tr>
                    <SortableHeader
                      field="id"
                      currentField={sortField}
                      currentOrder={sortOrder}
                      onSort={handleSort}
                    >
                      ID
                    </SortableHeader>
                    <SortableHeader
                      field="title"
                      currentField={sortField}
                      currentOrder={sortOrder}
                      onSort={handleSort}
                    >
                      Group Name
                    </SortableHeader>
                    <th>Description</th>
                    <SortableHeader
                      field="created_at"
                      currentField={sortField}
                      currentOrder={sortOrder}
                      onSort={handleSort}
                    >
                      Date Created
                    </SortableHeader>
                  </tr>
                </thead>
                <tbody className={`${isSearching && "is-searching"}`}>
                  {reviewGroups.map((group) => (
                    <tr key={group.id} onClick={() => handleRowClick(group.id)}>
                      <td>{group.id || "N/A"}</td>
                      <td>{group.title || "N/A"}</td>
                      <td>{group.description || "N/A"}</td>
                      <td>
                        <DateFormatter dateString={group.created_at} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="pagination-controls">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={!reviewGroupsData.has_previous}
                  className="pagination-button"
                >
                  Previous
                </button>

                {/* Always show first page */}
                <button
                  onClick={() => handlePageChange(1)}
                  className={`pagination-button ${1 === page ? "active" : ""}`}
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
                  disabled={!reviewGroupsData.has_next}
                  className="pagination-button"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="no-content">
              <h3>No review groups found</h3>
              <p>There are no review groups in the system.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewGroups;
