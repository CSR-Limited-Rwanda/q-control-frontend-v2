import OutlineButton from "@/components/OutlineButton";
import PrimaryButton from "@/components/PrimaryButton";
import api from "@/utils/api";
import React, { useState } from "react";

const DeactivateUserForm = ({ handleClose, userId }) => {
  const [deactivating, setDeactivating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);

  const handleDeactivate = async () => {
    setDeactivating(true);
    try {
      const response = await api.patch(`users/${userId}/`, {
        action: "deactivate",
      });
      if (response.status === 200) {
        alert("User deactivated successfully");
        window.location.reload();
      }
    } catch (error) {
      if (error.response) {
        alert(
          error.response.data.message ||
            error.response.data.error ||
            "Error deactivating user"
        );
      } else {
        alert("An error occurred while deactivating user");
      }
      console.log(error);
    } finally {
      setDeactivating(false);
    }
  };
  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Deactivate Account</h2>
        <p>Are you sure you want to deactivate this user's account?</p>
        <div className="actions">
          <OutlineButton text={"Cancel"} onClick={handleClose} />
          <PrimaryButton
            text={"Deactivate"}
            isLoading={deactivating}
            onClick={handleDeactivate}
          />
        </div>
      </div>
    </div>
  );
};

export default DeactivateUserForm;
