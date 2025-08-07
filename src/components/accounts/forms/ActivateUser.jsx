import OutlineButton from "@/components/OutlineButton";
import PrimaryButton from "@/components/PrimaryButton";
import api from "@/utils/api";
import React, { useState } from "react";
import "../../../styles/reviews/reviewTemplates/_reviewTemplates.scss";

const ActivateUserForm = ({ handleClose, userId }) => {
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);

  const handleActivate = async () => {
    setActivating(true);
    try {
      const response = await api.patch(`users/${userId}/`, {
        action: "activate",
      });
      if (response.status === 200) {
        alert("User activated successfully");
        window.location.reload();
      }
    } catch (error) {
      if (error.response) {
        alert(
          error.response.data.message ||
            error.response.data.error ||
            "Error activating user"
        );
      } else {
        alert("An error occurred while activating user");
      }

    } finally {
      setActivating(false);
    }
  };
  return (
    <div className="popup">
      <div className="message-container">{error}</div>
      <div className="popup-content">
        <h2>Activate Account</h2>
        <p>Are you sure you want to activate this user's account?</p>
        <div className="actions">
          <OutlineButton text={"Cancel"} onClick={handleClose} />
          <PrimaryButton
            text={"Activate"}
            isLoading={activating}
            onClick={handleActivate}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivateUserForm;
