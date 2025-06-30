'use client'
import { useState } from "react";
import { X, ArrowDownToLine, LoaderCircle } from 'lucide-react';
import Link from "next/link";
import SliceText from "@/components/SliceText";
import api from "@/utils/api";

const FilesList = ({
    setDocuments,
    documents,
    showDownload,
    canDelete,
    apiLink,
    incidentId,
}) => {
    const [deletingFile, setDeletingFile] = useState(false);
    const [files, setFiles] = useState(documents);
    const [fileToDelete, setFilesToDelete] = useState({});
    const [, setSelectedFile] = useState({});
    const [showFilePreview, setShowFilePreview] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSelectFile = (file) => {
        setSelectedFile(file);
        setShowFilePreview(true);
    };

    const handleDeleteFile = async (file) => {
        setDeletingFile(true);
        setFilesToDelete(file);
        try {
            const response = await api.delete(
                `/incidents/${apiLink}/${incidentId}/documents/${file.id}/delete/`
            );
            if (response.status === 200) {
                setSuccessMessage("File deleted successfully");
                setDeletingFile(false);
                setDocuments((prevFiles) =>
                    prevFiles.filter((prevFile) => prevFile.id !== file.id)
                );
                console.log(response.data);
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage(
                    error.response.data.message ||
                    error.response.data.error ||
                    "Error deleting file"
                );
            }
            console.log(error);
            setDeletingFile(false);
            console.log(error);
        }
    };
    return (
        <>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && (
                <div className="success-message">{successMessage}</div>
            )}
            <div className="documents-list">
                {documents && documents.length > 0
                    ? documents.map((doc, index) => (
                        <div onClick={() => handleSelectFile(doc)} className="document">
                            <div className="document-container">
                                <div className="icon">
                                    <img
                                        src={
                                            doc.file_type === ".pdf"
                                                ? "/images/file_types/pdf2-svgrepo-com 1.svg"
                                                : doc.file_type === ".xlsx"
                                                    ? "/images/file_types/excel2-svgrepo-com 1.svg"
                                                    : doc.file_type === ".doc"
                                                        ? "/images/file_types/word2-svgrepo-com 1.svg"
                                                        : "/images/file_types/file-link-stroke-rounded.svg"
                                        }
                                        alt=""
                                    />
                                </div>
                                <div className="text-content">
                                    <h4 className="file-name">
                                        <SliceText text={doc.name} maxLength={20} />
                                    </h4>
                                </div>
                            </div>
                            {showDownload ? (
                                <Link href={doc.url} target="_black" className="download-icon">
                                    <ArrowDownToLine size={20} />
                                </Link>
                            ) : (
                                ""
                            )}
                            {!doc.delete && (
                                <div className="delete-document">
                                    {deletingFile && fileToDelete === doc ? (
                                        <LoaderCircle size={18} className="loading-icon" />
                                    ) : (
                                        <X
                                            size={18}
                                            onClick={() => handleDeleteFile(doc)}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                    : "No documents found"}
                <div className="files-list"></div>
            </div>
        </>
    );
};

export default FilesList;
