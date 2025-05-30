'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { Search } from 'lucide-react';
import '../../styles/reviews/reviewGroups/_forms.scss'
import NamesInitials from '../NamesInitials';
const AddMembersForm = ({ groupId, onClose }) => {
    const router = useRouter();
    const [members, setMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleAddMember = async () => {
        if (selectedMembers.length === 0) {
            alert("Please select at least one member.");
            return;
        }

        setSubmitting(true);

        try {
            let allSuccessful = true;

            for (const member of selectedMembers) {
                const response = await api.patch(
                    `/permissions/review-groups/${groupId}/members/`,
                    {
                        member_id: member.id,
                        action: "add",
                    }
                );

                if (![200, 204].includes(response.status)) {
                    allSuccessful = false;
                    break;
                }
            }

            if (allSuccessful) {
                setSuccess(true);
                setTimeout(() => {
                    onClose(); // Close the modal
                    router.refresh(); // Refresh to show new members
                }, 1500);
            } else {
                alert("One or more members could not be added.");
            }
        } catch (error) {
            console.error("Error adding members:", error);
            alert("Failed to add members. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSelectMember = (member) => {
        setSelectedMembers((prevSelected) => {
            const alreadySelected = prevSelected.find((m) => m.id === member.id);
            if (alreadySelected) {
                return prevSelected.filter((m) => m.id !== member.id);
            } else {
                return [...prevSelected, member];
            }
        });
    };

    const fetchMembers = async (query = "") => {
        setLoading(true);
        try {
            const response = await api.get("/users/", {
                params: {
                    page: 1,
                    page_size: 8,
                    q: query,
                    permissions: "review_permissions",
                },
            });

            if (response.status === 200) {
                setMembers(response.data.results);
                setFilteredMembers(response.data.results);
            }
        } catch (error) {
            console.error("Error fetching members:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchTerm.length >= 2) {
                fetchMembers(searchTerm);
            } else {
                fetchMembers("");
            }
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className='review-groups-form'>
            <div className="step-two">
                <h2>Add Members</h2>
                <div className="search-wrapper">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={handleSearch}
                    // style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
                    />
                </div>
                <div className="selected-members">
                    Selected &nbsp; &nbsp;&nbsp;{selectedMembers.length}
                </div>

                {loading ? (
                    <p>Loading members...</p>
                ) : (
                    <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                        {filteredMembers.map((member) => {
                            const isSelected = selectedMembers.find(
                                (m) => m.id === member.id
                            );
                            return (
                                <li
                                    key={member.id}
                                    className={`choice ${isSelected ? "checked" : ""}`}
                                    style={{ marginBottom: "8px", cursor: "pointer" }}
                                    onClick={() => handleSelectMember(member)}
                                >
                                    <label
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "18px",
                                        }}
                                    >
                                        {/* {isSelected ? <CheckmarkSquare01Icon /> : <SquareIcon />} */}
                                        <div
                                            className={`custom-checkbox ${isSelected ? "checked" : ""
                                                }`}
                                        >
                                            <svg viewBox="0 0 24 24" className="checkmark">
                                                <path d="M5 12l5 5L19 7" />
                                            </svg>
                                        </div>

                                        <div className="member">
                                            <div className="row">
                                                <div className="profile-place-holder">
                                                    <NamesInitials
                                                        fullName={`${member?.user?.first_name} ${member?.user?.last_name}`}
                                                    />
                                                </div>
                                                <div className="column">
                                                    <div className="name">
                                                        {member?.user?.first_name}{" "}
                                                        {member?.user?.last_name}
                                                    </div>
                                                    <span className="position">
                                                        {member?.user?.position || "Unavailable"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="column">
                                                <h5>Department</h5>
                                                <span className="department">
                                                    {member?.department?.name || "Unavailable"}
                                                </span>
                                            </div>
                                        </div>
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
            <div className="action-buttons">
                <button className="secondary-button" onClick={onClose}>
                    Cancel
                </button>
                <button
                    className="primary-button"
                    onClick={handleAddMember}
                    disabled={submitting}
                >
                    {submitting ? "Adding..." : "Add Members"}
                </button>
            </div>
        </div>
    );
};

export default AddMembersForm;