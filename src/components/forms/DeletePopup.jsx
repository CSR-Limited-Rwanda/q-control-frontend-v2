import React, { useState } from "react";
import api from "@/utils/api";
import { Trash2 } from "lucide-react";
function DeletePopup({ apiUrl, text, cancelFn }) {
  const handleDelete = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await api.delete(apiUrl);

      if (response.status >= 200 && response.status < 300) {
        setSuccess(true);
      } else {
        throw new Error(`Unexpected response: ${response.statusText}`);
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Delete failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delete-popup">
      <div className="trash-icon">
        <Trash2 size={34} />
      </div>
      <h4>Delete</h4>
      <p>{text}</p>
      <div className="delete-btn">
        <span>Delete</span>
      </div>
      <div className="cancel-btn" onClick={cancelFn}>
        <span>Cancel</span>
      </div>
    </div>
  );
}

export default DeletePopup;
