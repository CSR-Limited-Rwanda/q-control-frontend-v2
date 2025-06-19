const PopUp = ({ tootlePopup, isPopupOpen, popupContent: PopupContent, spacialClass }) => {
    return (
      <div className="pop-up incident-form-popup">
        <div className={`popup-content`}>
  
          {isPopupOpen && PopupContent}
          {console.log(isPopupOpen)}
        </div>
      </div>
    );
  };
  export default PopUp;