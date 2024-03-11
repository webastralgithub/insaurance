import React, { useState } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function Editor() {
  const [editorData, setEditorData] = useState("");

  const handleEditorDataChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);
  };

  return (
    <div>

      <CKEditor
        editor={ClassicEditor}
        data={editorData}
        onChange={handleEditorDataChange}
      />
      <div>
        <h3>Editor Content:</h3>
        <div dangerouslySetInnerHTML={{ __html: editorData }}></div>
      </div>
    </div>
  );
}

export default Editor;
