import "@/styles/accounts/_titles.scss";
import { SearchInput } from "@/components/forms/Search";
import OutlineButton from "@/components/OutlineButton";
import PrimaryButton from "@/components/PrimaryButton";
import api, { createUrlParams } from "@/utils/api";
import { Plus, X, ChevronDown, CirclePlus } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import TitlesForm from "../forms/TitlesForm";
import TitleDetails from "./TitleDetails";
import DateFormatter from "@/components/DateFormatter";
import SortableHeader from "@/components/SortableHeader";
import useSorting from "@/hooks/useSorting";
import { openDropdown } from "@/utils/dropdownUtils";
import PermissionsGuard from "@/components/PermissionsGuard";
import { useGetPermissions } from "@/hooks/fetchPermissions";

import toast from "react-hot-toast";

const DEFAULT_PAGE_SIZE = 10;
const Titles = () => {
  const { permissions } = useGetPermissions();
  const [titlesData, setTitlesData] = useState({
    results: [],
    count: 0,
    page: 1,
    page_size: DEFAULT_PAGE_SIZE,
    total_pages: 1,
    has_next: false,
    has_previous: false,
  });
  const [isFetchingTitles, setIsFetchingTitles] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [showTitleDetails, setShowTitleDetails] = useState(false);
  const [showNewTitleForm, setShowNewTitleForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const isFocused = document.activeElement;

  const { sortField, sortOrder, handleSort, getSortParams } = useSorting();
  const {
    results: titles = [],
    page,
    page_size,
    count,
    total_pages,
  } = titlesData;

  const fetchTitles = async (params = "") => {
    const sortParams = getSortParams();
    const fullParams = params
      ? `${params}&${createUrlParams(sortParams)}`
      : createUrlParams(sortParams);
    setIsFetchingTitles(true);

    try {
      const response = await api.get(`/titles/?${fullParams}`);
      if (response.status === 200) {
        setTitlesData({
          results: response.data.results || [],
          count: response.data.count || 0,
          page: response.data.page || 1,
          page_size: response.data.page_size || DEFAULT_PAGE_SIZE,
          total_pages: response.data.total_pages || 1,
          has_next: response.data.has_next || false,
          has_previous: response.data.has_previous || false,
        });
      }
    } catch (error) {
      console.error("Error fetching titles:", error);
      toast.error("Error fetching titles");
    } finally {
      setIsFetchingTitles(false);
      setIsSearching(false);
    }
  };

  const handleSearch = useCallback(() => {
    if (searchQuery.length >= 3 || searchQuery.length === 0) {
      setIsSearching(true);
      const params = createUrlParams({
        q: searchQuery.trim(),
        page: 1,
        page_size: pageSize,
        sort_by: sortField,
        sort_order: sortOrder,
      });
      fetchTitles(params);
    } else if (searchQuery.length === 0 && isFocused) {
      setIsSearching(false);
      fetchTitles();
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
    fetchTitles(params);
    setShowFilters(false);
  };

  const handleShowFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleShowNewTitleForm = () => {
    setShowNewTitleForm(!showNewTitleForm);
  };

  const handleShowTitleDetails = (title) => {
    if (permissions && permissions?.accounts?.includes("view_title")) {
      setSelectedTitle(title);
      setShowTitleDetails(!showTitleDetails);
    } else {
      return;
    }
  };

  const handlePageSizeChange = (newSize) => {
    setTitlesData((prev) => ({
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
    fetchTitles(params);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > total_pages) return;

    const params = createUrlParams({
      q: searchQuery.trim(),
      page: newPage,
      page_size: page_size,
      sort_by: sortField,
      sort_order: sortOrder,
    });
    fetchTitles(params);
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, handleSearch]);

  useEffect(() => {
    fetchTitles(createUrlParams(getSortParams()));
  }, []);
  return (
    <div className="titles-tab">
      <div className="filters">
        <SearchInput
          value={searchQuery}
          setValue={setSearchQuery}
          isSearching={isSearching}
          label={"Search by names"}
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
                  size={24}
                  onClick={() => openDropdown("pageSize")}
                  className="filter-icon"
                />
              </div>
            </div>
          </form>

          <PermissionsGuard
            model="accounts"
            codename="add_title"
            isPage={false}
          >
            <PrimaryButton
              onClick={handleShowNewTitleForm}
              span="Add title"
              prefixIcon={<CirclePlus size={20} />}
              customClass={"sticky-button"}
            />
          </PermissionsGuard>
        </div>
      </div>
      {isFetchingTitles ? (
        <p>Loading titles...</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <SortableHeader
                  field="name"
                  currentField={sortField}
                  currentOrder={sortOrder}
                  onSort={handleSort}
                >
                  Name
                </SortableHeader>
                <th>Description</th>
                <SortableHeader
                  field="created_at"
                  currentField={sortField}
                  currentOrder={sortOrder}
                  onSort={handleSort}
                >
                  Date created
                </SortableHeader>
              </tr>
            </thead>
            <tbody>
              {titles.map((title, index) => (
                <tr onClick={() => handleShowTitleDetails(title)} key={index}>
                  <td data-label="ID">{title.id}</td>
                  <td data-label="Name">{title.name || "-"}</td>
                  <td data-label="Description">{title.description || "-"}</td>
                  <td data-label="Date created">
                    {<DateFormatter dateString={title.created_at || "-"} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination-controls">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={!titlesData.has_previous}
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
                className={`pagination-button ${total_pages === page ? "active" : ""
                  }`}
              >
                {total_pages}
              </button>
            )}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={!titlesData.has_next}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        </>
      )}

      {showNewTitleForm && <TitlesForm handleClose={handleShowNewTitleForm} />}
      {showTitleDetails && (
        <TitleDetails
          title={selectedTitle}
          handleClose={() => handleShowTitleDetails({})}
        />
      )}
    </div>
  );
};

export default Titles;
