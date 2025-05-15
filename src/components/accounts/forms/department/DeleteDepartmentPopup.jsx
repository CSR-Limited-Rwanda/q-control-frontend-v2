

const DeleteDepartmentPopup = ({ onClose, onConfirm, isLoading }) => {

    return (
        <div className="popup">
            <div className="popup-content">
                <div>
                    <h3>Delete department</h3>
                    <p>Are you sure you want delete this department?</p>
                </div>
                <div>
                    <button onClick={onClose} disabled={isLoading}>Cancel</button>
                    <button onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteDepartmentPopup
