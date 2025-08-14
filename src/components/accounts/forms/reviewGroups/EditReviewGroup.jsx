"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "@/utils/api";
import ErrorMessage from "@/components/messages/ErrorMessage";
import "../../../../styles/facilities/_facilities.scss";
import CloseIcon from "@/components/CloseIcon";

const EditReviewGroup = ({ reviewGroup, onClose, onReviewGroupUpdated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (reviewGroup) {
      setFormData({
        title: reviewGroup.name || "",
        description: reviewGroup.description || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!reviewGroup?.id) {
        throw new Error("the review group id is missing");
      }

      const payload = {
        title: formData.title,
        description: formData.description,
      };

      if (Object.keys(payload).length === 0) {
        onClose();
        return;
      }

      const res = await api.put(
        `/permissions/review-groups/${reviewGroup.id}/`,
        payload
      );
      if (res.status === 200) {
        const updatedReviewGroup = {
          ...reviewGroup,
          ...res.data,
        };
        onReviewGroupUpdated(updatedReviewGroup);
        onClose();
      }
    } catch (error) {
      console.error("an error occurred", error);
      setError(
        error.response?.data?.message || "Failed to update the review group"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!reviewGroup) return null;

  return (
    <div className="popup">
      <div className="popup-content">
        <CloseIcon onClick={onClose} />

        <h2>Edit review group</h2>
        {error && <ErrorMessage message={error} />}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="actions">
            <button type="button" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Update Review Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReviewGroup;
