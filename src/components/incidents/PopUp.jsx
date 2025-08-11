const PopUp = ({ togglePopup, isPopupOpen, popupContent: PopupContent, spacialClass }) => {
  return (
    <div className="popup incident-form-popup">
      <div className={`popup-content`}>

        {isPopupOpen && PopupContent}

      </div>
    </div>
  );
};
export default PopUp;