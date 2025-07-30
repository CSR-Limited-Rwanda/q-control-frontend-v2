'use client'
import React, { useEffect, useState } from "react";
import api, {API_URL} from "@/utils/api";
import { useParams } from "react-router-dom";
import NamesInitials from "@/components/NamesInitials";
import ReviewForm from "../../incidentForms/ReviewForm";
import DateFormatter from "@/components/DateFormatter";

const GeneralIncidentReviews = () => {
  const [reviews, setReviews] = useState([]);
  const { incidentId } = useParams();
  const [gettingReviews, setGettingReviews] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const toggleReviewForm = () => {
    setShowReviewForm(!showReviewForm);
  };
  useEffect(() => {
    const getIncidentReviews = async () => {
      try {
        const response = await api.get(
          `${API_URL}/incidents/general/${incidentId}/reviews/`
        );
        if (response.status === 200) {
          setReviews(response.data);
          console.log(response.data);
          localStorage.setItem("incidentReviewsCount", response.data.length);
          setGettingReviews(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          window.customToast.error("Authentication error");
        } else {
          window.customToast.error("Failed to fetch incident reviews");
          console.error(error);
        }
        setGettingReviews(false);
      }
    };
    getIncidentReviews();

    const intervalId = setInterval(getIncidentReviews, 3000);
    return () => clearInterval(intervalId);
  }, [incidentId]);
  return gettingReviews ? (
    <p>...getting reviews</p>
  ) : (
    <div className="incident-comments">
      {reviews &&
        reviews.map((review, index) => (
          <div key={index} className="review">
            <div className="profile">
              {review.created_by.profile_img ? (
                <img
                  className="profile-pic"
                  src={`${API_URL}${review.created_by.profile_img}`}
                  alt="Profile Pic"
                />
              ) : (
                <div className="profile-place-holder">
                  {/* we will find a way to change color according to the user who is logged in */}
                  <NamesInitials
                    fullName={`${review.created_by.last_name || "None"} ${
                      review.created_by.first_name || "None"
                    }`}
                  />
                </div>
              )}
            </div>
            <div className="content">
              <div className="names-title">
                <h4>
                  {review.created_by?.last_name || review.created_by?.first_name
                    ? `${review.created_by?.last_name} ${review.created_by?.first_name}`
                    : "None"}
                </h4>
                <div className="title">
                  <small>
                    {(() => {
                      const positions = review.created_by.position.split(", ");
                      const displayedPositions = positions
                        .slice(0, 3)
                        .join(", ");
                      const remainingPositions =
                        positions.length > 3 ? (
                          <sup>+ {positions.length - 3} more</sup>
                        ) : (
                          ""
                        );

                      return (
                        <>
                          {displayedPositions} &nbsp; {remainingPositions || ""}
                        </>
                      );
                    })() || "None"}
                  </small>
                </div>
              </div>

              <div
                className="text"
                dangerouslySetInnerHTML={{ __html: review.content } || "None"}
              />
              {review.files &&
                review.files.map((file, index) => (
                  <a
                    key={index}
                    href={`${API_URL}${file.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.file_name}
                  </a>
                ))}
              <small className="date-time">
                <DateFormatter dateString={review.created_at} />
              </small>
            </div>
          </div>
        ))}

      {showReviewForm ? (
        <div className="review-form-popup">
          <ReviewForm
            incidentId={incidentId}
            toggleReviewForm={toggleReviewForm}
            incidentName={"general"}
          />
        </div>
      ) : (
        <button
          onClick={toggleReviewForm}
          className="primary-button show-review-button"
        >
          Add review
        </button>
      )}
    </div>
  );
};

export default GeneralIncidentReviews;
