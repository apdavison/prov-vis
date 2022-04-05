import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';

import positions from './positions';

const baseUrl = "https://prov.brainsimulation.eu"
const DEFAULT_COLLAB_SPACE = "collab-poc-workflows";  // todo: change to "myspace"

const useStyles = makeStyles((theme) => ({
  searchBar: {
    position: 'absolute',
    left: '0px',
    top: positions.menuBarHeight + 'px',
    width: '100%',
    height: positions.searchBarHeight + 'px',
    overflow: 'auto',
    //backgroundColor: "#00ccdd"
  },
  formControl: {
    margin: theme.spacing(2),
    minWidth: 240,
  },
}));


function getSpaces(auth) {
  const url = baseUrl + "/statistics/spaces/";
  const config = {
      headers: {
          'Authorization': 'Bearer ' + auth.token,
      }
  }
  console.log("Getting spaces from " + url);
  return axios.get(url, config)
};


export default function SearchBar(props) {
  const classes = useStyles();
  const [availableCollabSpaces, setAvailableCollabSpaces] = useState([DEFAULT_COLLAB_SPACE]);
  const [selectedCollabSpace, setSelectedCollabSpace] = useState(DEFAULT_COLLAB_SPACE);
  const [recipeId, setRecipeId] = useState(null);

  useEffect(() => {
        getSpaces(props.auth)
        .then(res => {
          setAvailableCollabSpaces(
            res.data.map(item => {
              return item.space;
            })
          );
       })
  }, []);

  function updateSearch() {
    let searchFilters = {};
    if (recipeId) {
      searchFilters["recipe_id"] = recipeId;
    }
    props.onUpdate(selectedCollabSpace, searchFilters);
  }

  return (
      <div className={classes.searchBar}>
          <form>
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="collab-space-label">Collab space</InputLabel>
                <Select
                    labelId="collab-space-label"
                    id="collab-space-select"
                    value={selectedCollabSpace}
                    onChange={ev => setSelectedCollabSpace(ev.target.value)}
                >
                    {
                      availableCollabSpaces.map(name => {
                        return <MenuItem value={name} key={name}>{name}</MenuItem>
                      })
                    }
                </Select>
            </FormControl>

            <TextField id="recipe-id" label="Workflow recipe ID" variant="outlined"
                       value={recipeId} onChange={ev => setRecipeId(ev.target.value)}
                       className={classes.formControl} />

            <Button variant="contained" color="primary"
                    onClick={updateSearch}
                    className={classes.formControl} >
              Search
            </Button>
          </form>
      </div>
  );
}
