"use client";

import toast from "react-hot-toast";
import CloseIcon from "@/components/CloseIcon";
import PrimaryButton from "@/components/PrimaryButton";
import api from "@/utils/api";
import { X } from "lucide-react";
import React, { useState } from "react";

const TitlesForm = ({ isEditMode, existingTitleData, handleClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: existingTitleData?.name || "",
    description: existingTitleData?.description || "",
  });

  const handleSubmit = async () => {
    const data = {
      name: formData.name,
      description: formData.description,
    };
    try {
      setIsLoading(true);
      if (isEditMode) {
        const response = await api.put(
          `/titles/${existingTitleData.id}/`,
          data
        );
        if (response.status === 200) {
          toast.success("Title updated successfully");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } else {
        const response = await api.post("/titles/", data);
        if (response.status === 201) {
          toast.success("Title created successfully");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Error creating/updating title:", error);
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
    <div className="popup">
      <div className="popup-content">
        <CloseIcon onClick={handleClose} />

        <h3>New Title</h3>
        <p>
          This for is for adding a new title. To add a title, fill the <br />
          necessary information and click Create new title
        </p>
        <form>
          <div className="form-group">
            <label htmlFor="titleName">Title name</label>
            <input
              type="text"
              id="titleName"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Title name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Description"
              required
            />
          </div>

          {successMessage && (
            <div className="success message">
              <span>{successMessage}</span>
            </div>
          )}

          <PrimaryButton
            onClick={handleSubmit}
            text={"Create a new title"}
            isLoading={isLoading}
          />
        </form>
      </div>
    </div>
  );
};

export default TitlesForm;
