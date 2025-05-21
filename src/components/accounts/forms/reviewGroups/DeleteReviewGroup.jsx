import { AlertCircle } from 'lucide-react'
import '../../../../styles/reviews/reviewGroups/_reviewGroups.scss'

const DeleteReviewGroup = ({ onClose, onConfirm, isLoading, error }) => {
    return (
        <div className='popup'>
            <div className='popup-content'>
                {error && (
                    <div className='delete-error-message'>
                        <AlertCircle color='#F87C47' size={18} />
                        <span>{error}</span>
                    </div>
                )}
                <div className='delete-review-group-titles'>
                    <h3>Delete review group</h3>
                    <p>Are you sure you want to delete this review group?</p>
                </div>
                <div className='delete-review-group-buttons'>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className='cancel-delete-btn'
                    >
                        cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className='delete-btn'
                    >
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteReviewGroup

