import FilesList from "@/components/incidents/documentHistory/FilesList";
import api from "@/utils/api";
import React, { useEffect, useState } from "react";

import toast from "react-hot-toast";

const ProfileDocuments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    // fetch documents
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/accounts/profile/documents/`);
        if (response.status === 200) {
          setDocuments(response.data.documents);
          setIsLoading(false);

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
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {isLoading ? (
        "Loading..."
      ) : (
        <FilesList canDelete={true} documents={documents} showDownload={true} />
      )}
    </div>
  );
};

export default ProfileDocuments;
