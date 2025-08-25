"use client";

import toast from "react-hot-toast";
import { X } from "lucide-react";
import React, { useState } from "react";
import TitlesForm from "../forms/TitlesForm";
import PrimaryButton from "@/components/PrimaryButton";
import OutlineButton from "@/components/OutlineButton";
import api from "@/utils/api";
import CloseIcon from "@/components/CloseIcon";
import PermissionsGuard from "@/components/PermissionsGuard";

const TitleDetails = ({ title, handleClose }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditClick = () => {
    setShowEditForm(!showEditForm);
  };

  const handleDeleteClick = async (id) => {
    try {
      setIsLoading(true);
      const response = await api.delete(`/titles/${id}/`);
      if (response.status === 204) {
        toast.success("Title deleted successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Error deleting title:", error);
      let message;
      if (error?.response?.data) {
        message =
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "An error occurred";
      } else {
        message = error?.message || "Unknown error occurred";
      }
      toast.error(message);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="popup">
        <div className="popup-content">
          <CloseIcon onClick={handleClose} />

          <h3>{title.name}</h3>
          <p>{title.description}</p>

          <div className="actions">
            <PermissionsGuard model="accounts" codename="delete_title">
              <OutlineButton
                text={"Delete title"}
                isLoading={isLoading}
                onClick={() => handleDeleteClick(title.id)}
              />
            </PermissionsGuard>

            <PermissionsGuard
              model="accounts"
              codename="change_title"
              isPage={false}
            >
              <PrimaryButton text={"Edit title"} onClick={handleEditClick} />
            </PermissionsGuard>
          </div>
        </div>
      </div>

      {showEditForm && (
        <TitlesForm
          existingTitleData={title}
          isEditMode={true}
          handleClose={handleEditClick}
        />
      )}
    </>
  );
};

export default TitleDetails;
