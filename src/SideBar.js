import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  }
}));

const TRUNCATE_AT = 20;

function truncate(str, n){
    return (str.length > n) ? str.substr(0, n-1) + "…" : str;
};

export default function SideBar(props) {
  const classes = useStyles();

  function byDate(obj1, obj2) {
    // most recent first
    if (obj1.timestamp < obj2.timestamp) {
        return 1;
    }
    if (obj1.timestamp > obj2.timestamp) {
        return -1;
    }
    return 0;
  }

  const sortedPipelines = props.pipelines.slice().sort(byDate);

  return (
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            {sortedPipelines.map((obj, index) => (
              <ListItem button key={index} onClick={()=>props.handleSelect(index)}>
                <ListItemText
                    primary={truncate(obj.label, TRUNCATE_AT)}
                    secondary={obj.timestamp}
                    />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
  );
}
