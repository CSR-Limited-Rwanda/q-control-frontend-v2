"use client";
import React, { useState } from "react";
import { X, Link2, Info } from "lucide-react";
import "../styles/_messages.scss";
import CloseIcon from "./CloseIcon";

const NoteMessage = ({
  message,
  hideMessage,
  handleHideMessage,
  actionLink,
}) => {
  const [showMessage, setShowMessage] = useState(true);

  const toggleMessage = () => {
    setShowMessage(false);
    handleHideMessage();
  };
  return (
    <>
      {message && showMessage && (
        <div className="note-message">
          <div className="message">
            <Info className="message-icon" />
            <p>{message}</p>
            {actionLink && (
              <a className="link message-icon" href="">
                <span>Learn more</span> <Link2 size={18} />
              </a>
            )}
          </div>
          {hideMessage && <CloseIcon onClick={toggleMessage} />}
        </div>
      )}
    </>
  );
};

export default NoteMessage;
