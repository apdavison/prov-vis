import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';


const colours = {
    entity: "moccasin",
    activity: "paleturquoise"
}

const TRUNCATE_AT = 20;

function truncate(str, n){
    return (str.length > n) ? str.substr(0, n-1) + "…" : str;
};

function formatTimestamp(timestamp) {
    let dateObj = new Date(timestamp)
    return "⏱ " + dateObj.toLocaleString('en-GB', { timeZone: 'UTC' });
};

function formatType(typeIdentifier) {
    return typeIdentifier;
};

function formatLaunchConfig(launchConfig) {
    if (launchConfig) {
        let repr = "📄 " + launchConfig.executable + " ";
        if (launchConfig.arguments) {
            repr += launchConfig.arguments.join(", ");
        }
        return repr;
    } else {
        return " ";
    }
};

function formatPerson(person) {
    if (person) {
        return `👤 ${person.given_name} ${person.family_name}`; // todo: add ORCID icon
    } else {
        return " ";
    }
}

function getFileExtension(url) {
    const urlObj = new URL(url);
    const path = urlObj.pathname.split("/");
    return path[path.length - 1].split(".")[1];
};


function Stage(props) {
    const width = props.size.width;
    const height = props.size.height;
    const useStyles = makeStyles({
        root: {
            top: props.y - height/2 + "px",
            left: props.x - width/2 + "px",
            width: width + "px",
            height: height + "px",
            backgroundColor: colours[props.type],
            position: "absolute"
        }
      });
    const classes = useStyles();
    //console.log("Stage");
    //console.log(props);
    return (
        <Card id="stage{props.label}" className={classes.root}>
            <CardContent>
                <Typography variant="overline" gutterBottom>
                    {formatType(props.metadata.type)}
                </Typography>
                <Typography gutterBottom variant="h5" component="h2">
                    {truncate(props.label, TRUNCATE_AT)}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    {formatTimestamp(props.metadata.start_time)}<br/>
                    {formatPerson(props.metadata.started_by)}<br/>
                    {formatLaunchConfig(props.metadata.launch_config)}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default Stage;