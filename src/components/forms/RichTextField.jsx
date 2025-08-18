'use client'
import React, { useState } from "react";

const RichTexField = ({ value, onEditorChange }) => {
  const [text, setText] = useState("");

  const handleChange = (text) => {
    value = text;
    onEditorChange(value);
  };
  return (
    // <Editor
    //     apiKey={TINYEMCE_API_KEY}
    //     value={value}
    //     onEditorChange={onEditorChange}
    //     init={{
    //         height: 200,
    //         menubar: false,
    //         branding: false,
    //         plugins: [
    //             'advlist autolink lists link image charmap print preview anchor',
    //             'searchreplace visualblocks code fullscreen',
    //             'insertdatetime media table paste code help wordcount',
    //         ],
    //         toolbar:
    //             'undo redo | formatselect | bold italic backcolor | ' +
    //             'alignleft aligncenter alignright alignjustify | ' +
    //             'bullist numlist outdent indent',
    //     }}
    // />

    <textarea
      name=""
      id=""
      onChange={(e) => handleChange(e.target.value)}
      value={value || ""}
      placeholder="Type here"
      rows={5}
    ></textarea>
  );
};

export default RichTexField;
