import React, { useState } from "react";
import api from "@/utils/api";
import { Trash2 } from "lucide-react";
import { LoaderSpinner } from "../LoaderSpinner";
function DeletePopup({ apiUrl, text, cancelFn }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const handleDelete = async (e) => {
    e.preventDefault();
    setIsDeleting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await api.delete(apiUrl);

      if (response.status >= 200 && response.status < 300) {
        setSuccess(true);
        console.log(response.data);
        window.location.reload();
      } else {
        throw new Error(`Unexpected response: ${response.statusText}`);
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Delete failed.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="delete-popup">
      <div className="trash-icon">
        <Trash2 size={34} />
      </div>
      <h4>Delete</h4>
      <p>{text}</p>
      <div className="delete-btn" onClick={(e) => handleDelete(e)}>
        {isDeleting ? <LoaderSpinner /> : <span>Delete</span>}
      </div>
      <div className="cancel-btn" onClick={cancelFn}>
        <span>Cancel</span>
      </div>
    </div>
  );
}

export default DeletePopup;
