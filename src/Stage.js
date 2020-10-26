import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
//import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
//import CardMedia from '@material-ui/core/CardMedia';
//import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';


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
    return typeIdentifier.split(".")[1];
};

function formatCode(codeRepr) {
    if (codeRepr) {
        return "📄 " + codeRepr.split("@")[0];
    } else {
        return " ";
    }
};

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

    return (
        <Card id="stage{props.label}" className={classes.root}>
            <CardContent>
                <Typography variant="overline" gutterBottom>
                    {formatType(props.type)}
                </Typography>
                <Typography gutterBottom variant="h5" component="h2">
                    {truncate(props.label, TRUNCATE_AT)}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    {formatTimestamp(props.timestamp)}<br/>
                    {props.attributedTo ? "👤 ": ""}{props.attributedTo}<br/>
                    {formatCode(props.code)}<br/>
                    ➽ {getFileExtension(props.output.location).toUpperCase()}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>
            </CardActions>
        </Card>
    )
}

export default Stage;