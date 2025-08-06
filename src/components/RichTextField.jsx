'use client'
import { TINYEMCE_API_KEY } from '@/utils/api'
import { Editor } from '@tinymce/tinymce-react';
import React, { useState } from 'react'

const RichTextField = ({ value, onEditorChange }) => {
    const [text, setText] = useState("");

    const handleChange = (text) => {
        setText(text);
        onEditorChange(text);
    };


    return (
        <Editor
            apiKey={TINYEMCE_API_KEY}
            value={value}
            onEditorChange={onEditorChange}
            init={{
                height: 200,
                menubar: false,
                branding: false,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview', 'anchor',
                    'searchreplace', 'visualblocks', 'code', 'fullscreen', 'help', 'wordcount'
                ],
                toolbar:
                    'undo redo | formatselect | bold italic backcolor | ' +
                    'alignleft aligncenter alignright alignjustify | ' +
                    'bullist numlist outdent indent',
            }}
        />

        // <textarea
        //     name=""
        //     id=""
        //     onChange={(e) => handleChange(e.target.value)}
        //     value={value}
        //     placeholder="Type here"
        //     rows={5}
        // ></textarea>
    )
}

export default RichTextField