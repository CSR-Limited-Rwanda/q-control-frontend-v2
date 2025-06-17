"use client";
import React, { useEffect, useMemo, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import api from "@/utils/api";

import "../../../styles/reviews/reviewGroups/_reviewGroups.scss";
import "../../../styles/reviews/reviewTemplates/_reviewTemplates.scss";

import DateFormatter from "@/components/DateFormatter";
import NewReviewTemplatesForm from "@/components/forms/NewReviewTemplatesForm";
import {
  Eye,
  PlusCircleIcon,
  PlusIcon,
  SquarePen,
  SquareX,
  Trash2,
  X,
  CirclePlus
} from "lucide-react";
import DeletePopup from "@/components/forms/DeletePopup";
import EditReviewTemplateForm from "@/components/forms/EditReviewTemplateForm";
import SortControl from "@/utils/SortControl";

export const ReviewTemplates = () => {
  const router = useRouter();
  const [reviewTemplates, setReviewTemplates] = useState([]);
  const [reviewTemplate, setReviewTemplate] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchingTheDatabase, setIsSearchingTheDatabase] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isEmpty, setIsEmpty] = useState(localStorage.getItem("isEmpty"));
  const [clickedTemplateId, setClickedTemplateId] = useState(null);
  const [showEditTemplateForm, setShowEditTemplateForm] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    field: 'created_at',
    direction: 'desc',
  });

  const groupsWithFullname = reviewTemplates.map((user, index) => ({
    ...user, // spread the existing properties of the user
    full_name: `${user.last_name} ${user.first_name}`, // Add a unique key based on the index of the user
  }));

  const search = (string) => {
    setIsSearching(true);
    localStorage.setItem("isEmpty", true);
    const results = groupsWithFullname.filter((item) => {
      return (
        (item.id &&
          item.id.toString().toLowerCase().includes(string.toLowerCase())) ||
        (item?.name &&
          item?.name.toLowerCase().includes(string.toLowerCase())) ||
        (Array.isArray(item.department) &&
          item?.department.some((dep) =>
            dep.name.toLowerCase().includes(string.toLowerCase())
          )) ||
        (item?.email &&
          item?.email.toLowerCase().includes(string.toLowerCase()))
      );
    });
    if (results.length < 1) {
      setIsSearchingTheDatabase(true);
      setTimeout(() => {
        setIsSearchingTheDatabase(false);
      }, 3000);
    }
    setIsEmpty(false);
    localStorage.setItem("isEmpty", false);
    setSearchResults(results);
  };

  const handleShowNewUserForm = () => {
    setShowNewUserForm(!showNewUserForm);
  };
  const handleShowEditTemplateForm = () => {
    setShowEditTemplateForm(!showEditTemplateForm);
  };
  const handleRowClick = (id) => {
    router.push(`/permissions/review-templates/${id}/`);
  };
  const handleShowDeleteForm = (id) => {
    setClickedTemplateId(id);
    setShowDeleteForm(!showDeleteForm);
  };
  useEffect(() => {
    // get users from api
    setIsEmpty(localStorage.getItem("isEmpty"));

    const fetchReviewTemplates = async () => {
      try {
        const response = await api.get(`/permissions/review-templates/`);
        if (response.status === 200) {
          setReviewTemplates(response.data.results);

          console.log(groupsWithFullname);
          console.log(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        if (error.response) {
          setErrorMessage(
            error.response.data.message ||
            error.response.data.error ||
            "Error setting a list of users"
          );
        } else {
          setErrorMessage("Unknown error fetching users");
        }
        console.log(error);
        setIsLoading(false);
      }
    };
    fetchReviewTemplates();
  }, []);

  const fetchTemplateDetails = async (id) => {
    try {
      const response = await api.get(`/permissions/review-templates/${id}/`);

      if (response.status === 200) {
        setShowEditTemplateForm(!showEditTemplateForm);
        setReviewTemplate(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        setErrorMessage(
          error.response.data?.message ||
          error.response.data?.error ||
          "Failed to get tasks"
        );
      } else if (error.request) {
        setErrorMessage("No response from server");
      } else {
        setErrorMessage("Failed to make request");
      }
    }
  };

  // sorting
  const sortedReviewTemplates = useMemo(() => {
    if (!reviewTemplates) return []

    const sortableReviewTemplates = [...reviewTemplates]
    return sortableReviewTemplates.sort((a, b) => {
      if (sortConfig.field === 'created_at') {
        const dateA = new Date(a.created_at)
        const dateB = new Date(b.created_at)
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA
      }
      const nameA = a.name.toLowerCase()
      const nameB = b.name.toLowerCase()
      if (nameA < nameB) return sortConfig.direction === 'asc' ? -1 : 1
      if (nameA > nameB) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [reviewTemplates, sortConfig])

  const handleSortChange = (config) => {
    setSortConfig(config)
  }


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
                <NewReviewTemplatesForm discardFn={handleShowNewUserForm} />
              </div>
            </div>
          </div>
        </div>
      )}
      {showEditTemplateForm && (
        <div className="new-user-form-popup">
          <div className="popup">
            <div className="popup-content">
              <div className="close">
                <SquareX
                  onClick={handleShowEditTemplateForm}
                  className="close-icon"
                />
              </div>

              <div className="form">
                <EditReviewTemplateForm
                  data={reviewTemplate}
                  discardFn={handleShowEditTemplateForm}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {showDeleteForm && (
        <div className="new-user-form-popup delete-form-popup">
          <div className="popup">
            <div className="popup-content">
              <div className="form">
                <DeletePopup
                  text={"Do you really want to delete this template"}
                  cancelFn={handleShowDeleteForm}
                  apiUrl={`/permissions/review-templates/${clickedTemplateId}/`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="actions template-actions">
        <div className="title">
          <div>
            <h3>Review Templates</h3>
            <span>
              {isEmpty
                ? reviewTemplates.length
                : searchResults.length > 0
                  ? searchResults.length
                  : reviewTemplates.length}
            </span>{" "}
            <span>Available</span>
          </div>
        </div>

        <div className="filters">
          <input
            onChange={(e) => {
              search(e.target.value);
            }}
            type="search"
            name=""
            id=""
            placeholder="Search templates by name or id"
          />
        </div>
        <div className="review-templates-btns">
          <button
            type="button"
            onClick={handleShowNewUserForm}
            className="button tertiary-button new-user-button"
          >
            <CirclePlus size={20} />
            <span>Add New Template</span>
          </button>
          <SortControl
            options={[
              { value: 'name', label: "Name" },
              { value: 'created_at', label: 'Date added' }
            ]}
            defaultField="created_at"
            defaultDirection="desc"
            onChange={handleSortChange}
          />
        </div>
      </div>
      {/* users table */}

      <div className="templates-list">
        {isSearching ? (
          isSearchingTheDatabase ? (
            <div className="searching_database">
              <p>Searching database...</p>
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            searchResults.map((reviewTemplate, index) => (
              <div className="template-card card" key={index}>
                <h3>{reviewTemplate.name}</h3>
                <DateFormatter dateString={reviewTemplate.created_at} />

                <p>{reviewTemplate.description}</p>

                <div className="template-action-btns">
                  <div
                    className="delete-btn"
                    onClick={() => handleShowDeleteForm(reviewTemplate.id)}
                  >
                    <Trash2 size={20} />
                  </div>
                  <div
                    className="edit-btn"
                    onClick={() => {
                      fetchTemplateDetails(reviewTemplate.id);
                    }}
                  >
                    <SquarePen size={20} />
                  </div>
                  <div
                    className="details-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(reviewTemplate.id);
                    }}
                  >
                    <Eye size={18} />
                    <span>View details</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data-found">
              <p>No data found with your search</p>
            </div>
          )
        ) : sortedReviewTemplates.length > 0 ? (
          sortedReviewTemplates.map((reviewTemplate, index) => (
            <div className="template-card card" key={index}>
              <h3>{reviewTemplate.name}</h3>
              <DateFormatter dateString={reviewTemplate.created_at} />

              <p>{reviewTemplate.description}</p>

              <div className="template-action-btns">
                <div className="delete-btn">
                  <Trash2
                    size={18}
                    onClick={() => handleShowDeleteForm(reviewTemplate.id)}
                  />
                </div>
                <div
                  className="edit-btn"
                  onClick={() => {
                    fetchTemplateDetails(reviewTemplate.id);
                  }}
                >
                  <SquarePen size={18} />
                </div>
                <div
                  className="details-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRowClick(reviewTemplate.id);
                  }}
                >
                  <div className="eye-icon">
                    <Eye size={18} />
                  </div>

                  <span>View details</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          "No review group available"
        )}

        {/* <tr></tr> */}
      </div>

      <div className="mobile-users">
        {reviewTemplates &&
          reviewTemplates.map((reviewTemplate, index) => (
            <div key={index} className="user-card">
              <p>
                {reviewTemplate?.user?.last_name}{" "}
                {reviewTemplate?.user?.first_name}
              </p>
              <small>{reviewTemplate?.user?.email}</small>
            </div>
          ))}
      </div>
    </div>
  );
};
