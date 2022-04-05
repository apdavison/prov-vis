import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
import ClassIcon from '@material-ui/icons/Class';
import ReactMarkdown from 'react-markdown'

import positions from './positions';


const useStyles = makeStyles((theme) => ({
  objectInfo: {
    position: 'absolute',
    left: positions.drawerWidth + 20 + 'px',
    top: positions.menuBarHeight + positions.searchBarHeight + 10 + 'px',
    width: '100%',
    height: positions.objectDetailBarHeight + 'px',
    overflow: 'auto',
    backgroundColor: "#eeeeee",
    padding: "1em"
  }
}));


function formatType(typeIdentifier) {
  return typeIdentifier.split(".")[1];
};

function formatPeople(people) {
  if (people) {
    let repr = "👤 ";
    people.forEach(person => {
      repr += `${person.given_name} ${person.family_name}, `;
    }); 
    repr = repr.slice(0, -2);  // remove un-needed final comma
    return repr; // todo: add ORCID icons
  } else {
    return " ";
  }
}

export default function RecipeDetail(props) {
  const classes = useStyles();

  if (props.recipe) {
    return (
        <div className={classes.objectInfo}>
            <Typography variant="subtitle1" gutterBottom>
              <ClassIcon /> {props.recipe.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
            {formatPeople(props.recipe.developers)}<br/>
            </Typography>
            <Typography variant="body1" gutterBottom>{props.recipe.location}</Typography>
            <ReactMarkdown>{props.recipe.description}</ReactMarkdown>
            <Typography variant="caption">{props.recipe.id}</Typography>
        </div>
    );
  } else {
    return <div className={classes.objectInfo}>No recipe specified</div>
  }
}
