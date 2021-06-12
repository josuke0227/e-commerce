import React, { useEffect, useState } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Box, Chip, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  charCounter: {
    margin: "0.5rem 0",
  },
});

const RichTextField = ({ setValue, characters, count }) => {
  const classes = useStyles();

  const strippedString = characters.replace(/(<([^>]+)>)/gi, "");

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  };

  useEffect(() => {
    setValue(draftToHtml(convertToRaw(editorState.getCurrentContent())));
  }, [editorState, setValue]);

  return (
    <>
      <Editor
        editorStyle={{
          border: "1px solid rgb(241, 241, 241)",
          borderRadius: "4px",
          minHeight: "400px",
          backgroundColor: "#fff",
          padding: "0 0.5rem",
          maxHeight: "50vh",
          overflowX: "scroll",
        }}
        toolbarStyle={{
          borderRadius: "4px",
        }}
        toolbar={{
          options: [
            "inline",
            "blockType",
            "fontSize",
            "fontFamily",
            "list",
            "textAlign",
            "colorPicker",
            "link",
            "embedded",
            "emoji",
            "remove",
            "history",
          ],
        }}
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
      />
      {count && (
        <Box className={classes.charCounter} textAlign="end">
          <Chip
            label={`${count - strippedString.length + 1}  characters left`}
            color="primary"
          />
        </Box>
      )}
    </>
  );
};

export default RichTextField;
