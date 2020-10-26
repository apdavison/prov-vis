import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';

import positions from './positions';


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

export default function SideBar(props) {
  const classes = useStyles();
  const [objectType, setObjectType] = React.useState('');
  const [objectId, setObjectId] = React.useState('');

  function updateSearch() {
    props.onUpdate(objectType, objectId);
  }

  return (
      <div className={classes.searchBar}>
          <form>
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="object-type-label">Object class</InputLabel>
                <Select
                    labelId="object-type-label"
                    id="object-type-select"
                    value={objectType}
                    onChange={ev => setObjectType(ev.target.value)}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value="electrophysiology.MultiChannelMultiTrialRecording">Multi-channel, multi-trial recording</MenuItem>
                    <MenuItem value="analysis.AnalysisResult">Analysis Result</MenuItem>
                </Select>
            </FormControl>

            <TextField id="object-id" label="Object ID" variant="outlined"
                       value={objectId} onChange={ev => setObjectId(ev.target.value)}
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
