import OutlineButton from "@/components/OutlineButton";
import PrimaryButton from "@/components/PrimaryButton";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import React from "react";

const DeleteUserForm = ({ handleClose, userId }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  const handleDelete = async () => {
    if (!userId) {
      setErrorMessage("User ID is missing.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.delete(`/users/${userId}/`);
      if (response.status === 204) {
        setSuccessMessage("User deleted successfully");
        setTimeout(() => {
          router.push("/accounts");
        }, 1000);
      }
    } catch (error) {
      handleDelete();

      if (error.response) {
        setErrorMessage(
          error.response.data.message ||
            error.response.data.error ||
            "Error deleting user"
        );
      } else {
        setErrorMessage("Unknown error deleting user");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Delete User</h2>
        <p>
          Are you sure you want to delete this user? This action cannot be
          undone.
        </p>
        <div className="actions">
          <OutlineButton text={"Cancel"} onClick={handleClose} />
          <PrimaryButton
            text={"Delete"}
            isLoading={isLoading}
            onClick={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default DeleteUserForm;
