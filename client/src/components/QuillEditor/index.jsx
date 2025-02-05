// import React, {useEffect} from "react";
// import {useQuill} from "react-quilljs";
// import "quill/dist/quill.snow.css";

// const QuillEditor = ({value, setValue}) => {
//   const {quill, quillRef} = useQuill();

//   useEffect(() => {
//     if (quill) {
//       quill.on("text-change", () => {
//         const currentValue = quill.root.innerHTML;
//         setValue(currentValue);
//       });
//     }

//     return () => {
//       if (quill) {
//         quill.off("text-change"); // Remove event listener
//         quill.root.innerHTML = ""; // Clear content
//       }
//     };
//   }, [quill]);

//   return   <div ref={quillRef} style={{height: 150, border: "1px solid #ccc", borderRadius: "5px"}} />;
// };

// export default QuillEditor;
import React, {useState} from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const QuillEditor = ({value, setValue}) => {
  const handleChange = (content) => {
    
    setValue(content);
  };

  return <ReactQuill value={value} onChange={handleChange} style={{ borderRadius: "5px"}} />;
};

export default QuillEditor;
