import FilesList from "@/components/incidents/documentHistory/FilesList";
import api from "@/utils/api";
import React, { useEffect, useState } from "react";

import toast from "react-hot-toast";

const ProfileDocuments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedUserProfileId, setSelectedUserProfileId] = useState(
    localStorage.getItem("selected_user_profile_id")
  );

  useEffect(() => {
    // fetch documents
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(
          `/users/${selectedUserProfileId}/documents/`
        );
        if (response.status === 200) {
          setDocuments(response.data.documents);
          setIsLoading(false);
          toast.success("Documents fetched successfully");
          console.log(response.data.documents);
        }
      } catch (error) {
        if (error.response) {
          toast.error(
            error.response.data.message ||
              error.response.data.error ||
              "Error getting your documents"
          );
        } else {
          toast.error("Unknown error getting your documents");
        }
        setIsLoading(false);
      }
    };
    fetchDocuments();
  }, []);
  return (
    <div className="profile-documents">
      {isLoading ? (
        "Loading..."
      ) : (
        <FilesList canDelete={true} documents={documents} showDownload={true} />
      )}
    </div>
  );
};

export default ProfileDocuments;
