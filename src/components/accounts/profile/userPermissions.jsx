"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CheckSquare,
  ChevronUp,
  LoaderCircle,
  Square,
  Trash,
  Trash2,
  X,
} from "lucide-react";
import api from "@/utils/api";
import CloseIcon from "@/components/CloseIcon";

const UserPermissions = ({ togglePermissions, userId }) => {
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState("");
  const [featureToShow, setFeatureToShow] = useState("");
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [success, setSuccess] = useState("");

  const handleSelectGroup = (group) => {
    setSelectedGroups((prevGroups) => {
      const exists = prevGroups.some((g) => g.id === group.id);
      if (exists) {
        return prevGroups.filter((g) => g.id !== group.id);
      } else {
        return [...prevGroups, group];
      }
    });
  };

  const handleRemoveUserFromGroups = async () => {
    setIsRemoving(true);
    try {
      const confirmed = window.confirm(
        `Are you sure you want to remove user from ${selectedGroups.length} group(s)?`
      );
      if (!confirmed) return;

      await Promise.all(
        selectedGroups.map(async (group) => {
          const response = await api.delete(`/users/${userId}/permissions/`, {
            data: {
              id: group.id,
            },
          });

          if (response.status === 200) {
            setSuccess("User removed successfully");
          }
        })
      );

      const selectedIds = selectedGroups.map((group) => group.id);
      setPermissions(
        permissions.filter((perm) => !selectedIds.includes(perm.id))
      );
      setSelectedGroups([]);
    } catch (error) {
      setError(`Error removing user from ${selectedGroups.length} group(s)`);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleToggleFeature = (feature) => {
    setFeatureToShow(featureToShow === feature ? "" : feature);
  };

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await api.get(`/users/${userId}/permissions/`);
        if (response.status === 200) {
          setPermissions(response.data.groups);
        }
      } catch (error) {
        setError("Error fetching permissions");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPermissions();
  }, []);
  return (
    <div className="popup">
      <div
        className="popup-content"
        style={{
          maxWidth: "800px",
          width: "100%",
          minHeight: "400px",
          maxHeight: "500px",
        }}
      >
        <h3>User permissions</h3>
        <p>
          These are the permission groups and permissions that user have on
          certain features
        </p>
        {success && <div className="message success-message">{success}</div>}
        {error && <div className="message error-message">{error}</div>}

        {selectedGroups && selectedGroups.length > 0 && (
          <button
            onClick={handleRemoveUserFromGroups}
            style={{
              backgroundColor: "tomato",
              color: "white",
              width: "fit-content",
            }}
          >
            {isRemoving ? (
              <LoaderCircle className="loading-icon" size={18} />
            ) : (
              <Trash2 size={18} />
            )}
            Remove permissions
          </button>
        )}
        <CloseIcon onClick={togglePermissions} />

        {isLoading ? (
          "Loading..."
        ) : error ? (
          <div className="error-message message">{error}</div>
        ) : permissions && permissions.length > 0 ? (
          <div className="user-permissions-list form">
            {permissions.map((permission, index) => (
              <div
                key={index}
                onClick={() => handleToggleFeature(permission.name)}
                className={`dropdown ${
                  featureToShow === permission.name && "show"
                }`}
              >
                <div className="header">
                  <div
                    className="action"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectGroup({
                        id: permission.id,
                        name: permission.name,
                      });
                    }}
                  >
                    {selectedGroups.some((g) => g.id === permission.id) ? (
                      <CheckSquare size={18} color="green" />
                    ) : (
                      <Square size={18} color="grey" />
                    )}
                  </div>
                  <p>{permission.name}</p>
                  <ChevronUp className="icon" />
                </div>
                <div
                  className="content perms"
                  style={{ flexDirection: "unset" }}
                >
                  {permission?.permissions.map((perm, index) => (
                    <div className="perm" key={index}>
                      {/* {perm.access ? <CheckmarkSquare02Icon size={18} color="green" /> : <SquareIcon size={18} color="grey" />} */}
                      <span>{perm.feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="message warning-message">No permissions</div>
        )}
      </div>
    </div>
  );
};

export default UserPermissions;
