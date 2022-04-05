import React from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
}));


function FileContentDisplay(props) {

  const [content, setContent] = React.useState("Loading ...");

  React.useEffect(() => {
    //console.log("Getting workflow data")
    if (props.format.startsWith("text")) {
      // todo: only download files under a certain size
      axios.get(props.location)
      .then(res => {
        setContent(res);
      })
      .catch(err => {
        setContent("The contents of this file could not be displayed, authentication may be required");
      })
    }
  }, []);

  if (props.format.startsWith("image")) {
    return <img src={props.location} alt={props.alt} />
  } else {
    return <pre>{content}</pre>
  }

}


export default function Preview(props) {
  const classes = useStyles();

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
