import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ReactMarkdown from 'react-markdown'


export default function RecipeDetail(props) {

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
      aria-labelledby="recipe-detail-title"
    >
      <DialogTitle id="recipe-detail-title">{props.recipe.name}</DialogTitle>
      <DialogContent>
        <ReactMarkdown>{props.recipe.description}</ReactMarkdown>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
