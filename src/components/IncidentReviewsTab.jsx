'use client'
import '@/styles/_incidentReviews.scss';
import { createReview, fetchReviews } from '@/hooks/fetchReviews';
import React, { use, useEffect, useState } from 'react'
import Button from './forms/Button';
import { ArrowRight, Plus, Send, X } from 'lucide-react';
import UserCard from './UserCard';
import ProfilePlaceHolder from './ProfilePlaceHolder';
import { formatDateTime } from '@/utils/api';
import RichTextField from './RichTextField';
import PositionCard from './PositionCard';

const IncidentReviewsTab = ({ incidentId, apiLink, setCount = 0 }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const [newReviewFormVisible, setNewReviewFormVisible] = useState(false);
    const handleFetchReviews = async () => {
        setIsLoading(true);
        const response = await fetchReviews(incidentId, apiLink)
        if (!response.success) {
            setError(response.message);
            setIsLoading(false);
            return;
        }
        setReviews(response.data || []);
        setCount(Array.isArray(response.data) ? response.data.length : 0);
        setIsLoading(false);

    }


    useEffect(() => {
        handleFetchReviews();
    }, []);

    useEffect(() => {
        setCount(Array.isArray(reviews) ? reviews.length : 0);
    }, [reviews]);

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

                                <ProfilePlaceHolder fullName={`${review.created_by.first_name} ${review.created_by.last_name}`} />
                                <div className="review-item-content">
                                    <div className="name-position">
                                        <h3>{review.created_by.first_name} {review.created_by.last_name}</h3>
                                        <div className="postilion">
                                            <PositionCard position={review.created_by.position} itemsToShow={1} />
                                        </div>
                                    </div>
                                    {/* display html content */}
                                    <div className="review-content" dangerouslySetInnerHTML={{ __html: review.content }} />
                                    <small className="review-date">{formatDateTime(review.created_at)}</small>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-reviews">No reviews available.</div>
                )
            }

            {
                !isLoading && <Button onClick={() => setNewReviewFormVisible(true)} icon={<Plus />} hasIcon={true} text={'Create Review'}></Button>

            }
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
            <h3>Add a comment or review</h3>
            <p>Please provide your feedback below:</p>
            <form onSubmit={handleSubmit} className="">

                <RichTextField value={reviewContent} onEditorChange={setReviewContent} />
                {error && <div className="error-message">{error}</div>}
                <Button onClick={e => handleSubmit(e)} hasIcon={true} icon={<ArrowRight />} text={'Send'} type="submit" disabled={isSubmitting} isLoading={isSubmitting}>

                </Button>
            </form>
        </div>
    );
}