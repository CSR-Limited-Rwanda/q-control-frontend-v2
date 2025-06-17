import React, { useEffect, useState } from "react";
import { Check, LoaderCircle, PlusIcon, Search } from "lucide-react";
import { useParams } from "react-router-dom";
import api from "@/utils/api";

const AddUserPermissionsFrom = ({
  existingUsers,
  setExistingUsers,
  groupId,
}) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingState, setLoadingState] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleFilter = (string) => {
    const filtered = users.filter(
      (user) =>
        user.user.first_name.toLowerCase().includes(string.toLowerCase()) ||
        user.user.last_name.toLowerCase().includes(string.toLowerCase()) ||
        user.user.email.toLowerCase().includes(string.toLowerCase())
    );
    setFilteredUsers(filtered);
    if (string === "") {
      setFilteredUsers(users);
    }
  };

  const handleAddUser = async (user) => {
    setLoadingState((prev) => ({ ...prev, [user.id]: true }));
    setErrorMessage("");
    setSuccessMessage("");
    const payload = {
      id: parseInt(groupId),
    };

    try {
      console.log("user:", user);
      console.log("permissionGroupID:", groupId);
      console.log("payload:", payload);
      const response = await api.post(
        `/users/${user.id}/permissions/`,
        payload
      );
      console.log(response);
      if (response.status === 200) {
        setSuccessMessage("User added successfully");
        setExistingUsers((prev) => [...prev, user]);
      } else {
        setErrorMessage("Group ID is not defined");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Error adding user");
    } finally {
      setLoadingState((prev) => ({ ...prev, [user.id]: false })); // Reset the loading state for the clicked user
    }
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await api.get(`/users/?page_size=5`);
        if (response.status === 200) {
          setUsers(response.data.results);
          setFilteredUsers(response.data.results);
          console.log(response.data);
        }
      } catch (error) {
        setErrorMessage("Error getting users");
      } finally {
        setIsLoading(false);
      }
    };
    getUsers();
  }, []);

  return (
    <div className="form">
      {successMessage && (
        <div className="message success">{successMessage}</div>
      )}
      {errorMessage && <div className="message error">{errorMessage}</div>}

      <div className="search-input">
        {isLoading ? (
          <LoaderCircle className="icon loading-icon" />
        ) : (
          <Search className="icon" />
        )}
        <input
          onChange={(e) => handleFilter(e.target.value)}
          type="text"
          name="search"
          id="search"
          placeholder="Search user by name or email"
        />
      </div>

      <div className="search-results">
        {errorMessage && <p className="error">{errorMessage}</p>}
        {filteredUsers.length > 0 &&
          filteredUsers?.map((user) => (
            <div key={user.id} className="search-result">
              <div className="content">
                <p>
                  {user.user.first_name} {user.user.last_name}
                </p>
                <small>{user.user.email}</small>
              </div>
              <div className="action">
                {existingUsers &&
                existingUsers.some(
                  (existingUser) => existingUser.id === user.id
                ) ? (
                  <>
                    <Check />
                    Added
                  </>
                ) : (
                  <div onClick={() => handleAddUser(user)} className="action">
                    {loadingState[user.id] ? (
                      <LoaderCircle className="loading-icon" />
                    ) : (
                      <PlusIcon />
                    )}
                    Add
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AddUserPermissionsFrom;
