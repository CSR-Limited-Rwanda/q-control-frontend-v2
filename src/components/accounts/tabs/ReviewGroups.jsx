'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";
import DateFormatter from "@/components/DateFormatter";
import NewReviewGroupForm from "@/components/forms/NewReviewGroupFrom";
import { Plus, SquareX, EllipsisVertical } from "lucide-react";
import '../../../styles/reviews/reviewGroups/_reviewGroups.scss'

const ReviewGroups = () => {
    const router = useRouter()
    const [reviewGroups, setReviewGroups] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [showNewUserForm, setShowNewUserForm] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchingTheDatabase, setIsSearchingTheDatabase] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const [isEmpty, setIsEmpty] = useState(localStorage.getItem("isEmpty"));

    const groupsWithFullname = reviewGroups.map((user, index) => ({
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
                (item?.title &&
                    item?.title.toLowerCase().includes(string.toLowerCase()))
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
    const handleRowClick = (reviewId) => {
        router.push(`/permissions/review-groups/${reviewId}/members/`);
    };
    useEffect(() => {
        // get users from api
        setIsEmpty(localStorage.getItem("isEmpty"));

        const fetchReviewGroups = async () => {
            try {
                const response = await api.get(`/permissions/review-groups/`);
                if (response.status === 200) {
                    setReviewGroups(response.data);

                    console.log('groups.', groupsWithFullname);
                    console.log('data', response.data);
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
        fetchReviewGroups();
    }, []);

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
                                <SquareX
                                    onClick={handleShowNewUserForm}
                                    className="close-icon"
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
                                : searchResults.length > 0
                                    ? searchResults.length
                                    : reviewGroups.length}
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
                        placeholder="Search reviews by name or id"
                    />
                </div>
                <div className="review-group-btn">
                    <button
                        type="button"
                        onClick={handleShowNewUserForm}
                        className="button tertiary-button new-review-group-button"
                    >
                        <Plus size={20} />
                        <span>Add New Group</span>
                    </button>
                </div>

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
                    <tbody>
                        {renderTableBody()}
                    </tbody>
                </table>
            </div>

            <div className="mobile-users">
                {reviewGroups &&
                    reviewGroups.map((reviewGroup, index) => (
                        <div key={index} className="user-card">
                            <p>
                                {reviewGroup?.user?.last_name} {reviewGroup?.user?.first_name}
                            </p>
                            <small>{reviewGroup?.user?.email}</small>
                        </div>
                    ))}
            </div>
        </div>
    );

    function renderTableBody() {
        if (isSearching) {
            if (isSearchingTheDatabase) {
                return (
                    <tr>
                        <td colSpan="5" className="searching_database">
                            <p>Searching database...</p>
                        </td>
                    </tr>
                )
            }
            if (searchResults && searchResults.length > 0) {
                return searchResults.map((reviewGroup, index) => (
                    <tr
                        key={index}
                        onClick={() => handleRowClick(reviewGroup.id)}
                    >
                        <td>{reviewGroup.id}</td>
                        <td>{reviewGroup.title}</td>
                        <td>{reviewGroup.description}</td>
                        <td><DateFormatter dateString={reviewGroup.created_at} /></td>
                        <td><EllipsisVertical /></td>
                    </tr>
                ))
            }
            return (
                <tr>
                    <td colSpan="5" className="no-data-found">
                        <p>No data matching your search query</p>
                    </td>
                </tr>
            )
        }
        if (reviewGroups.length > 0) {
            return reviewGroups.map((reviewGroup, index) => (
                <tr
                    key={index}
                    onClick={() => handleRowClick(reviewGroup.id)}
                >
                    <td>{reviewGroup.id}</td>
                    <td>{reviewGroup.title}</td>
                    <td>{reviewGroup.description}</td>
                    <td><DateFormatter dateString={reviewGroup.created_at} /></td>
                    <td><EllipsisVertical /></td>
                </tr>
            ))
        }
        return (
            <tr>
                <td colSpan="5">No review group available</td>
            </tr>
        )
    }
};

export default ReviewGroups
