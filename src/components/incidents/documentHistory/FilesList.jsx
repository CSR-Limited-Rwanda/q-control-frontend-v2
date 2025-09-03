"use client";

import toast from "react-hot-toast";
import { useState } from "react";
import { X, ArrowDownToLine, LoaderCircle } from "lucide-react";
import Link from "next/link";
import SliceText from "@/components/SliceText";
import api from "@/utils/api";
import "@/styles/_main.scss";

const FilesList = ({ setDocuments, documents, showDownload, canDelete }) => {
  const [deletingFile, setDeletingFile] = useState(false);
  const [fileToDelete, setFileToDelete] = useState({});
  const [selectedFile, setSelectedFile] = useState({});
  const [showFilePreview, setShowFilePreview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const documentsPerPage = 12;

  console.log(documents);

  const handleSelectFile = (file) => {
    setSelectedFile(file);
    setShowFilePreview(true);
  };

  const getTextAfterFirstUnderscore = (str) => {
    if (typeof str !== "string" || !str.includes("_")) {
      return str;
    }
    return str.split("_").slice(1).join("_");
  };

  const handleDeleteFile = async (file) => {
    setDeletingFile(true);
    setFileToDelete(file);
    try {
      const response = await api.delete(
        `/accounts/profile/documents/${file.id}/`
      );
      if (response.status === 200) {
        toast.success("File deleted successfully");

        setDeletingFile(false);

        setTimeout(() => {
          window.location.reload();
        }, 1000);

        setDocuments((prevFiles) =>
          prevFiles.filter((prevFile) => prevFile.id !== file.id)
        );

        const totalDocsAfterDelete = documents.filter(
          (prevFile) => prevFile.id !== file.id
        ).length;
        const totalPagesAfterDelete = Math.ceil(
          totalDocsAfterDelete / documentsPerPage
        );
        if (currentPage > totalPagesAfterDelete && totalPagesAfterDelete > 0) {
          setCurrentPage(totalPagesAfterDelete);
        }
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.error ||
            error.response.data.message ||
            "Error deleting file"
        );
      }
    } finally {
      setDeletingFile(false);
    }
  };

  const indexOfLastDocument = currentPage * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const currentDocuments = Array.isArray(documents)
    ? documents.slice(indexOfFirstDocument, indexOfLastDocument)
    : [];

  const totalDocuments = documents ? documents.length : 0;
  const totalPages = Math.ceil(totalDocuments / documentsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="files-list-wrapper">
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      <div className="documents-list">
        {currentDocuments && currentDocuments.length > 0 ? (
          currentDocuments.map((doc, index) => (
            <div
              key={index}
              onClick={() => handleSelectFile(doc)}
              className="document"
            >
              <div className="document-container">
                <div className="icon">
                  <img
                    src={
                      doc.type || doc.file_type === ".pdf"
                        ? "/images/file_types/pdf2-svgrepo-com 1.svg"
                        : doc.type || doc.file_type === ".xlsx"
                        ? "/images/file_types/excel2-svgrepo-com 1.svg"
                        : doc.type ||
                          doc.file_type === ".doc" ||
                          doc.type ||
                          doc.file_type === ".docx"
                        ? "/images/file_types/word2-svgrepo-com 1.svg"
                        : "/images/file_types/file-link-stroke-rounded.svg"
                    }
                    alt=""
                  />
                </div>
                <div className="text-content">
                  <h4 className="file-name">
                    <SliceText
                      text={getTextAfterFirstUnderscore(doc.name)}
                      maxLength={16}
                    />
                  </h4>
                </div>
              </div>
              {showDownload ? (
                <Link href={doc.url} target="_blank" className="download-icon">
                  <ArrowDownToLine size={20} />
                </Link>
              ) : (
                ""
              )}
              {canDelete && (
                <div className="delete-document">
                  {deletingFile && fileToDelete === doc ? (
                    <LoaderCircle size={18} className="loading-icon" />
                  ) : (
                    <X
                      size={18}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDeleteFile(doc)}
                    />
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-documents">No documents found</div>
        )}

        {totalDocuments > documentsPerPage && (
          <div
            className="pagination"
            style={{
              marginTop: "20px",
              display: "flex",
              gap: "5px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {currentPage > 1 && (
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                style={{
                  padding: "8px 12px",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  background: currentPage === 1 ? "#EBF5FF" : "#145C9E",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Prev
              </button>
            )}

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  background: currentPage === index + 1 ? "#145C9E" : "#fff",
                  color: currentPage === index + 1 ? "white" : "black",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                {index + 1}
              </button>
            ))}

            {currentPage !== totalPages && (
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                style={{
                  padding: "8px 12px",
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                  background:
                    currentPage === totalPages ? "#EBF5FF" : "#145C9E",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilesList;
