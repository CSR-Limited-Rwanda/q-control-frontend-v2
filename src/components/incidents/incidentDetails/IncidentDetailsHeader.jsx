'use client'
import React, { useState, useEffect } from "react"
import CustomModifiedSelectInput from "@/components/CustomModifiedSelectInput"
import "../../../styles/_generalIncidentDetailsPage.scss"
import {
  MoveRight,
  ArrowDown,
  FileCheck2,
  CircleCheckBig,
  House,
  Warehouse,
  Pencil,
  MessageCirclePlus,
  Send,
  SendHorizonal,
  SendHorizontal,
  ArrowRight
} from 'lucide-react';

// import SendToDepartmentForm from "../../../../components/incidents/forms/sendToDepartmentForm";
import MarkResolvedForm from "../incidentForms/MarkIncidentResolvedForm";
import api, { API_URL } from "@/utils/api";
import { usePermission } from "@/context/PermissionsContext";
import ReviewForm from "../incidentForms/ReviewForm";
import Link from "next/link";
import SendForReview from "./sendForReview/sendForReview";
// import GenerateReport from "../../../../components/general/popups/generateReport";

const IncidentDetailsHeader = ({
  data,
  incidentDetailsId,
  setCurrentIncidentData,
  useOriginalVersion,
  sendTo,
  apiLink,
  showClosedManager,
}) => {
  // Default to "Most Recent" if available, otherwise "Original Version"
  const permissions = usePermission();
  const defaultVersion = data?.modifications?.versions?.find(
    (mod) => mod.latest
  )
    ? "Most Recent"
    : "Original Version";
  const [selectedVersion, setSelectedVersion] = useState(defaultVersion);
  const [showActions, setShowActions] = useState(false);
  const [showSendToDepartmentForm, setShowSendToDepartmentForm] =
    useState(false);
  const [showMarkResolvedPopup, setShowMarkResolvedPopup] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showPreviewForm, setShowPreviewForm] = useState(false);
  const canModifyDraft = localStorage.getItem("canModifyDraft");
  const canViewDraft = localStorage.getItem("canViewDraft");

  // Helper to format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours < 12 ? "AM" : "PM";
    hours = hours % 12 || 12;
    return `${month}-${day}-${year} ${hours}:${minutes} ${ampm}`;
  };

  // Map and format version options
  const sortedVersions = data?.modifications?.versions?.map((mod, index) =>
    mod.original === true // Define the original version
      ? {
        label: `<span style="font-weight: bold; margin-right: 10px;">Original</span> <span style="color: gray;">${formatDate(
          mod.date
        )}</span>`,
        value: "Original Version",
        id: incidentDetailsId,
        isOriginal: true,
        isMostRecent: mod.latest,
        date: mod.date,
      }
      : {
        label: `<span style="font-weight: bold; margin-right: 10px;">Modified</span> <span style="color: gray;">${formatDate(
          mod.date
        )}</span>`,
        value: `Modified Version ${index}`,
        id: mod.id,
        date: mod.date,
        isOriginal: false,
        isMostRecent: mod.latest,
      }
  );

  // Identify the most recent version
  const mostRecentVersion = sortedVersions?.find(
    (version) => version.isMostRecent
  );
  if (mostRecentVersion) {
    mostRecentVersion.label = `<span style="font-weight: bold; margin-right: 10px;">Most Recent</span> <span style="color: gray;">${formatDate(
      mostRecentVersion.date
    )}</span>`;
    mostRecentVersion.value = "Most Recent";
  }

  // Define the options array with dynamic positioning of "Most Recent"

  const getUpdatedOptions = () => {
    if (selectedVersion === "Most Recent") {
      return [
        mostRecentVersion,

        ...sortedVersions?.filter((v) => v !== mostRecentVersion),
      ];
    } else if (selectedVersion === "Original Version") {
      return [
        mostRecentVersion,
        ...sortedVersions?.filter((v) => v !== mostRecentVersion),
      ];
    } else {
      const selectedOption = sortedVersions.find(
        (v) => v.value === selectedVersion
      );
      return [
        selectedOption,
        mostRecentVersion,

        ...sortedVersions.filter(
          (v) => v !== mostRecentVersion && v !== selectedOption
        ),
      ];
    }
  };

  // Memoize options to prevent unnecessary re-renders

  const [updatedOptions, setUpdatedOptions] = useState(getUpdatedOptions);

  // Update options and fetch data when selected version changes
  useEffect(() => {
    const newOptions = getUpdatedOptions();
    setUpdatedOptions(newOptions);

    const fetchIncidentData = async () => {
      const selectedOption = newOptions.find(
        (option) => option.value === selectedVersion
      );

      // Validate that selectedOption exists
      if (!selectedOption) return;

      const url = selectedOption.isOriginal
        ? `/incidents/${apiLink}/${incidentDetailsId}/versions/original/`
        : `/incidents/${apiLink}/${incidentDetailsId}/versions/${selectedOption.id}/`;

      try {
        const response = await api.get(`${API_URL}${url}`);
        setCurrentIncidentData(
          selectedOption.isOriginal ? response.data : response.data
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchIncidentData();
  }, [selectedVersion, incidentDetailsId, setCurrentIncidentData, apiLink]);

  const toggleShowMarkResolvedPopup = () =>
    setShowMarkResolvedPopup(!showMarkResolvedPopup);
  const toggleShowReviewForm = () => setShowReviewForm(!showReviewForm);
  const toggleShowPreviewForm = () => setShowPreviewForm(!showPreviewForm);
  const toggleActions = () => setShowActions(!showActions);
  const toggleShowSendToDepartmentForm = () =>
    setShowSendToDepartmentForm(!showSendToDepartmentForm);

  return (
    <div className="incident-details-header">
      <div className="incident-steps-and-type">
        <div className="details">
          <h3>#{incidentDetailsId}</h3>
          <div className="incident-type">
            <span>Incident details</span>{" "}
            <div className="type">
              {data.incident.incident_type || "Not provided"}
            </div>
          </div>
        </div>

        <div className="facility-header">
          <div className="facility">
            <div className="facility-name">
              <House color="gray" />
              <span>Facility:</span>
            </div>
            <span>{data?.incident?.report_facility?.name || "No facility"}</span>
          </div>
          <div className="department">
            <div className="department-name">
              <Warehouse color="gray" />
              <span>Department:</span>
            </div>
            <span>{data.incident.department?.name || "No department"}</span>
          </div>

          <CustomModifiedSelectInput
            placeholder="Version"
            options={updatedOptions}
            selected={selectedVersion}
            setSelected={setSelectedVersion}
          />

          {data.incident.is_resolved ? (
            <div className="is-resolved button one-bg">
              <CircleCheckBig />
              <span>Incident is closed</span>
            </div>
          ) : (
            <div
              onClick={toggleActions}
              className={`actions ${showActions ? "show-actions" : ""}`}
            >
              <button type="button" className="primary">
                <span>Actions</span>
                {/* TODO: Instead of adding two icons, use one and rotate it if actions are open */}
                {showActions ? (
                  <ArrowDown variant={"stroke"} />
                ) : (
                  <ArrowRight variant={"stroke"} />
                )}
              </button>
              <div className="actions-popup">
                <>

                  <div className="action" onClick={toggleShowSendToDepartmentForm}>
                    <div className="icon">
                      <SendHorizontal />
                    </div>
                    <span>Send for review</span>
                  </div>
                  <div
                    onClick={toggleShowMarkResolvedPopup}
                    className="action"
                  >
                    <div className="icon">
                      <FileCheck2 size={20} variant={"stroke"} />
                    </div>
                    <span>Mark as closed</span>
                  </div>
                </>

                <Link
                  href={"modify/"}
                  onClick={() => {
                    localStorage.setItem("canModifyDraft", true);
                  }}
                  className="action"
                >
                  <div className="icon">
                    <Pencil size={20} variant={"stroke"} />
                  </div>
                  <span>Modify</span>
                </Link>

                <div onClick={toggleShowReviewForm} className="action">
                  <div className="icon">
                    <MessageCirclePlus size={20} variant={"stroke"} />
                  </div>
                  <span>Add a comment</span>
                </div>
                {/* {permissions &&
                (permissions.includes("Admin") ||
                  permissions.includes("Quality - Risk Manager") ||
                  permissions.includes("Super Admin")) ? (
                  <div onClick={toggleShowPreviewForm} className="action">
                    <div className="icon">
                      <FileExportIcon size={20} variant={"stroke"} />
                    </div>
                    <span>Export Report</span>
                  </div>
                ) : (
                  " "
                )} */}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="incident-details-and-tabs"></div>
      {showMarkResolvedPopup ? (
        <MarkResolvedForm
          incidentId={incidentDetailsId}
          apiLink={apiLink}
          closeForm={toggleShowMarkResolvedPopup}
        />
      ) : (
        ""
      )}
      {showReviewForm ? (
        <div className="incident-popup">
          <div className="popup-content review-popup-content">
            <h3>Add a comment</h3>
            <p>
              Your comments will be visible for anyone who can access this
              incident.
            </p>
            <ReviewForm
              incidentId={incidentDetailsId}
              toggleReviewForm={toggleShowReviewForm}
              incidentName={apiLink}
            />
          </div>
        </div>
      ) : (
        ""
      )}

      {showPreviewForm ? (
        <h2>Generate report</h2>
        // <div className="incident-popup">
        //   {" "}
        //   <GenerateReport />{" "}
        // </div>
      ) : (
        ""
      )}
      {showSendToDepartmentForm ? (
        <SendForReview path={apiLink} incidentID={incidentDetailsId} handleClose={toggleShowSendToDepartmentForm} />
      ) : (
        ""
      )}
    </div>
  );
};

export default IncidentDetailsHeader;
