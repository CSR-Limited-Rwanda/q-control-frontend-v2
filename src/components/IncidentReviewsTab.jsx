'use client'
import { createReview, fetchReviews } from '@/hooks/fetchReviews';
import React, { useEffect, useState } from 'react'
import Button from './forms/Button';
import { Plus, Send, X } from 'lucide-react';

const IncidentReviewsTab = ({ incidentId, apiLink }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const [newReviewFormVisible, setNewReviewFormVisible] = useState(false);
    const handleFetchReviews = async () => {
        setIsLoading(true);
        const response = await fetchReviews(incidentId, apiLink)
        if (!response.success) {
            setError(response.message);
        }
        setReviews(response.data);
        setIsLoading(false);

    }


    useEffect(() => {
        handleFetchReviews();
    }, []);

    return (
        <div className='incident-reviews-tab'>
            {
                isLoading ? (
                    <div className="loading">Loading...</div>
                ) : error ? (
                    <div className="message error">{error}</div>
                ) : reviews.length > 0 ? (
                    <div className="reviews-list">
                        {reviews.map((review) => (
                            <div key={review.id} className="review-item">
                                <h3>{review.title}</h3>
                                <p>{review.content}</p>
                                <span className="review-date">{new Date(review.created_at).toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-reviews">No reviews available.</div>
                )
            }

            <Button onClick={() => setNewReviewFormVisible(true)} icon={<Plus />} hasIcon={true} text={'Create Review'}></Button>
            {newReviewFormVisible && (
                <NewReviewForm
                    incidentId={incidentId}
                    apiLink={apiLink}
                    handleClose={() => {
                        setNewReviewFormVisible(false);
                        handleFetchReviews();
                    }}
                />
            )}
        </div>
    )
}

export default IncidentReviewsTab

export const NewReviewForm = ({ incidentId, apiLink, handleClose, }) => {
    const [reviewContent, setReviewContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const response = await createReview(incidentId, apiLink, { content: reviewContent });
        if (!response.success) {
            setError(response.message);
            setIsSubmitting(false);
            return;
        }

        setReviewContent('');
        handleClose();
        setIsSubmitting(false);
    }


    return (
        <div className="new-review-form">
            <div className="close-icon" onClick={handleClose}>
                <X />
            </div>
            <form onSubmit={handleSubmit} className="">
                <textarea
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    placeholder="Write your review here..."
                    required
                />
                {error && <div className="error-message">{error}</div>}
                <Button hasIcon={true} icon={<Send />} text={'Submit Review'} type="submit" disabled={isSubmitting} isLoading={isSubmitting}>

                </Button>
            </form>
        </div>
    );
}