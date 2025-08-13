const PopUp = ({ togglePopup, isPopupOpen, popupContent: PopupContent, spacialClass }) => {
  return (
    <div className={`popup ${spacialClass}`}>
      <div className={`popup-content`}>
        {isPopupOpen && PopupContent}
      </div>
    </div>
  );
};
export default PopUp;