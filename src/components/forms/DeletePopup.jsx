import React, { useState } from "react";
import api from "@/utils/api";
import { Trash2 } from "lucide-react";
import { LoaderSpinner } from "../LoaderSpinner";
function DeletePopup({ apiUrl, text, cancelFn }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [errorExist, setErrorExist] = useState(false);
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

        window.location.reload();
        setErrorExist(false);
      } else {
        throw new Error(`Unexpected response: ${response.statusText}`);
      }
    } catch (err) {
      if (err.response?.data?.message || err.message) {
        setError(
          err.response?.data?.message || err.message || "Delete failed."
        );
        setErrorExist(true);

      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="delete-popup">
      {errorExist && <div className="error-container">{error}</div>}

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
