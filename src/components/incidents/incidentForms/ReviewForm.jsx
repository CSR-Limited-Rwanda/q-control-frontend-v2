"use client";
import React, { useState } from "react";
// import { Editor } from "@tinymce/tinymce-react";
import api, { API_URL } from "@/utils/api";
import { LoaderCircle } from "lucide-react";

const ReviewForm = ({ incidentId, toggleReviewForm, incidentName }) => {
  const [content, setContent] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const handleReviewContent = (content, editor) => {
    setContent(content);
  };

  const handleNewReview = async () => {
    setSubmittingReview(true);
    try {
      const response = await api.post(
        `${API_URL}/incidents/${incidentName}/${incidentId}/reviews/new/`,
        { content: content }
      );
      if (response.status === 201) {
        window.customToast.success("Review added successfully");
        setContent("");
        setSubmittingReview(false);
        toggleReviewForm();
      }
    } catch (error) {
      console.log(error);
      if (error.response.data) {
        window.customToast.error(
          error.response.data.error || "Error adding review"
        );
      } else {
        window.customToast.error("Failed to add review");
      }
      setSubmittingReview(false);
    }
  };
  return (
    <form action="" className="review-form">
      {/* <Editor
        apiKey={TINYEMCE_API_KEY}
        onEditorChange={handleReviewContent}
        init={{
          height: 200,
          menubar: false,
          branding: false,
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime  wordcount",
          ],
          toolbar:
            "undo redo | formatselect | bold italic backcolor | \
                            alignleft aligncenter alignright alignjustify | \
                            bullist numlist outdent indent",
        }}
      /> */}

      <div className="buttons">
        <button
          disabled={submittingReview}
          onClick={handleNewReview}
          type="button"
          className="primary-button"
        >
          {submittingReview ? (
            <LoaderCircle className="loading-icon" size={15} />
          ) : (
            "Add a new review"
          )}
        </button>
        <button
          onClick={toggleReviewForm}
          type="button"
          className="outline-button"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
