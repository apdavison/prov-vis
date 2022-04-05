import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';
import Typography from '@material-ui/core/Typography';

import positions from './positions';


const useStyles = makeStyles((theme) => ({
  drawer: {
    width: positions.drawerWidth + 'px',
    position: 'absolute',
    left: '0px',
    top: positions.menuBarHeight + positions.searchBarHeight + 'px',
    overflow: 'auto',
    paddingTop: '1ex'
  },
  drawerHeading: {
    marginLeft: '1em'
  }
}));

const TRUNCATE_AT = 8;

function truncate(str, n){
    return (str.length > n) ? str.substr(0, n-1) + "…" : str;
};

function formatTimestamp(timestamp) {
  let dateObj = new Date(timestamp)
  return dateObj.toLocaleString('en-GB', { timeZone: 'UTC' });
};

export default function SideBar(props) {
  const classes = useStyles();

  if (props.workflows.length > 0) {
    return (
        <div className={classes.drawer}>
            <Typography variant="overline" className={classes.drawerHeading} gutterBottom>
              Available Workflows
            </Typography>
            <List>
              {props.workflows.map((obj, index) => (
                <ListItem button
                      key={index}
                      onClick={()=>props.handleSelect(index)}
                      selected={props.selectedIndex === index}>
                  <ListItemIcon>
                    <ShareIcon />
                  </ListItemIcon>
                  <ListItemText
                      primary={truncate(obj.id, TRUNCATE_AT)}
                      secondary={formatTimestamp(obj.stages[0].start_time)}
                      />
                </ListItem>
              ))}
            </List>
        </div>
    );
  } else {
    return (
      <div className={classes.drawer}>
          <Typography variant="overline" className={classes.drawerHeading} gutterBottom>
            No Workflows Available
          </Typography>
      </div>
    )
  }
}
