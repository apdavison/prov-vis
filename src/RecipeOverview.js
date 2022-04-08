import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import ClassIcon from '@material-ui/icons/Class';
import positions from './positions';

import RecipeDetail from './RecipeDetail';

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

export default function RecipeOverview(props) {
  const classes = useStyles();

  const [openRecipeDetail, setOpenRecipeDetail] = React.useState(false);

  function handleCloseRecipeDetail() {
    setOpenRecipeDetail(false);
  }

  function handleOpenRecipeDetail() {
    setOpenRecipeDetail(true);
  }

  if (props.recipe) {
    return (
      <React.Fragment>
        <div className={classes.objectInfo}>
            <Typography variant="subtitle1" gutterBottom>
              <IconButton aria-label="preview" onClick={handleOpenRecipeDetail}>
                <ClassIcon />
              </IconButton>
              {props.recipe.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
            {formatPeople(props.recipe.developers)}<br/>
            </Typography>
            <Typography variant="body1" gutterBottom>
              <Link href={props.recipe.location} target="_blank" >
                {props.recipe.location}
              </Link>
              </Typography>
            <Typography variant="caption">{props.recipe.id}</Typography>
        </div>
        <RecipeDetail open={openRecipeDetail} 
          onClose={handleCloseRecipeDetail} 
          recipe={props.recipe}
        />
      </React.Fragment>  
    );
  } else {
    return <div className={classes.objectInfo}>No recipe specified</div>
  }
}
