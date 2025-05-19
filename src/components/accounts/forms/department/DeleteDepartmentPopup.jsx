import '../../../../styles/facilities/_facilities.scss'

const DeleteDepartmentPopup = ({ onClose, onConfirm, isLoading }) => {

    return (
        <div className="popup">
            <div className="popup-content">
                <div className='delete-department-popup-titles'>
                    <h3>Delete department</h3>
                    <p>Are you sure you want delete this department?</p>
                </div>
                <div className='delete-department-buttons'>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className='cancel-delete-btn'
                    >
                        Cancel
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

export default DeleteDepartmentPopup
