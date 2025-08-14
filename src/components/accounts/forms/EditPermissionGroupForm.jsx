import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import api from "@/utils/api";
import "../../../styles/_permissions.scss";
import CloseIcon from "@/components/CloseIcon";

const FEATURES = {
  general: "General Patient Visitor Reports",
  drug_reaction: "Adverse Drug Reaction Reports",
  staff_incident_reports: "Staff Incident Reports",
  patient_visitor_grievance: "Grievance Reports",
  medication_error: "Medication Error Reports",
  lost_and_found: "Lost And Found Reports",
  workplace_violence_reports: "Workplace Violence Reports",
  department: "Departments Feature",
  facility: "Facility Feature",
  complaint: "Complaint Feature",
  profiles: "Profiles Feature",
};

const EditPermissionGroupForm = ({ handleClose, groupId }) => {
  const [groupTitle, setGroupTitle] = useState("");
  const [expandedFeature, setExpandedFeature] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [loadingFeature, setLoadingFeature] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load current group data
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await api.get(`/permissions/${groupId}/`);
        if (response.status === 200) {
          setGroupTitle(response.data.name || "");

          const mappedPermissions = {};
          response.data.permissions.forEach((featureSet) => {
            const featureKey = featureSet.feature;
            if (featureKey) {
              mappedPermissions[featureKey] = featureSet.perms || [];
            }
          });

          setSelectedPermissions(mappedPermissions);
        }
      } catch (error) {
        console.error("Failed to load permission group:", error);
      }
    };

    fetchGroupData();
  }, [groupId]);

  const toggleFeature = async (featureKey) => {
    if (expandedFeature === featureKey) {
      setExpandedFeature(null);
      return;
    }

    setExpandedFeature(featureKey);

    if (!permissions[featureKey]) {
      try {
        setLoadingFeature(featureKey);
        const response = await api.get(`/permissions/features/${featureKey}/`);
        if (response.status === 200) {
          setPermissions((prev) => ({ ...prev, [featureKey]: response.data }));
        }
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      } finally {
        setLoadingFeature(null);
      }
    }
  };

  const handleCheckboxChange = (featureKey, permission) => {
    setSelectedPermissions((prev) => {
      const updated = { ...prev };
      const existing = updated[featureKey] || [];
      const exists = existing.some((p) => p.code_name === permission.code_name);

      if (exists) {
        updated[featureKey] = existing.filter(
          (p) => p.code_name !== permission.code_name
        );
        if (updated[featureKey].length === 0) {
          delete updated[featureKey];
        }
      } else {
        updated[featureKey] = [...existing, permission];
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      id: groupId,
      group_name: groupTitle,
      permissions: Object.entries(selectedPermissions).map(
        ([feature, perms]) => ({
          feature,
          permissions: perms,
        })
      ),
    };

    try {
      const response = await api.patch(`/permissions/`, payload);
      if (response.status === 200) {
        setToastMessage({
          type: "success",
          text: "Permission group updated successfully!",
        });

        setTimeout(() => {
          setToastMessage(null);
          setIsSubmitting(false);
          window.location.reload();
          handleClose();
        }, 2000);
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error) {
      console.error("Failed to update permission group:", error);
      setToastMessage({
        type: "error",
        text: "Failed to update group. Please try again.",
      });
      setTimeout(() => {
        setToastMessage(null);
        setIsSubmitting(false);
      }, 3000);
    }
  };

  return (
    <div className="popup">
      <div className="popup-content">
        {toastMessage && (
          <div className={`toast ${toastMessage.type}`}>
            {toastMessage.text}
          </div>
        )}

        <CloseIcon onClick={handleClose} />

        <form className="add-permission-group-form" onSubmit={handleSubmit}>
          <h2>Edit Permission Group</h2>

          <div className="form-group">
            <label htmlFor="group-title">Group Title</label>
            <input
              id="group-title"
              type="text"
              placeholder="Enter group title..."
              value={groupTitle}
              onChange={(e) => setGroupTitle(e.target.value)}
              required
            />
          </div>

          <div className="permissions-section">
            <h3>Permissions</h3>
            {Object.entries(FEATURES).map(([key, label]) => (
              <div key={key} className="feature-block">
                <div
                  className="feature-header"
                  onClick={() => toggleFeature(key)}
                >
                  <span>{label}</span>
                  <span className="chevron">
                    {expandedFeature === key ? <ChevronUp /> : <ChevronDown />}
                  </span>
                </div>

                {expandedFeature === key && (
                  <div className="feature-permissions">
                    {loadingFeature === key ? (
                      <p>Loading...</p>
                    ) : permissions[key]?.length > 0 ? (
                      permissions[key].map(({ code_name, name }) => {
                        const isSelected = selectedPermissions[key]?.some(
                          (p) => p.code_name === code_name
                        );
                        return (
                          <div
                            key={`${key}:${code_name}`}
                            className="permission-checkbox"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              marginBottom: "0.4rem",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleCheckboxChange(key, { code_name, name })
                            }
                          >
                            <div
                              className={`custom-checkbox ${
                                isSelected ? "checked" : ""
                              }`}
                            >
                              <svg viewBox="0 0 24 24" className="checkmark">
                                <path d="M5 12l5 5L19 7" />
                              </svg>
                            </div>
                            <span>{name}</span>
                          </div>
                        );
                      })
                    ) : (
                      <p>No permissions found.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating group..." : "Update Group"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPermissionGroupForm;
