import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

function FileContentDisplay(props) {

  const [content, setContent] = React.useState("Loading ...");

  React.useEffect(() => {
    //console.log("Getting workflow data")
    if (props.format.startsWith("text")) {
      // todo: only download files under a certain size
      fetch(props.location)
      .then(res => {
        setContent(res);
      })
      .catch(err => {
        setContent("The contents of this file could not be displayed, authentication may be required");
      })
    }
  }, [props.format, props.location]);

  if (props.format.startsWith("image")) {
    return <img src={props.location} alt={props.alt} />
  } else {
    return <pre>{content}</pre>
  }

}


export default function Preview(props) {
  const fullWidth = true;
  const maxWidth = "lg";

  const handleClose = () => {
    props.onClose();
  };

  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={props.open}
      onClose={handleClose}
      aria-labelledby="file-preview-title"
    >
      <DialogTitle id="file-preview-title">{props.fileName}</DialogTitle>
      <DialogContent>
        <FileContentDisplay format={props.format} location={props.location} alt={props.fileName} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
