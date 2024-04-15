import React from "react";
// import AceEditor from "react-ace";
const CodeEditor = ({ code, language }) => {
  return (
    <div>
      {/* <AceEditor
        mode={language}
        theme="github"
        // onChange={onChange}
        name="UNIQUE_ID_OF_DIV"
        value={`function onLoad(editor) {
            console.log("i've loaded");
          }`}
        editorProps={{ $blockScrolling: true }}
      /> */}
    </div>
  );
};

export default CodeEditor;
