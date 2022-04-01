import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
//import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
//import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import Chip from '@material-ui/core/Chip';
//import Stack from '@material-ui/core/Stack';

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

function getFileExtension(url) {
    const urlObj = new URL(url);
    const path = urlObj.pathname.split("/");
    return path[path.length - 1].split(".")[1];
};

function formatFileSize(numBytes) {
    if (numBytes === 0) {
        return "0 B"
    }
    let n = Math.floor(Math.log2(numBytes) / Math.log2(1024));
    let size = numBytes / Math.pow(1024, n);
    const prefix = ["", "K", "M", "G", "T"]
    return `${size.toFixed(1)} ${prefix[n]}iB`;

}

function ViewButton(props) {
    if (props.href.startsWith("https://")) {
        return (
            <Button variant="contained" href={props.href} target="_blank">
                View
            </Button>
        )
    } else {
        return (
            <Button disabled variant="contained">
                Not available
            </Button>
        )
    }
}


function File(props) {
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
                    file
                </Typography>
                <Typography gutterBottom variant="h5" component="h2">
                    {truncate(props.metadata.file_name, TRUNCATE_AT)}
                </Typography>
                <Chip label={props.metadata.format} size="small" />
                <Chip label={formatFileSize(props.metadata.size)} size="small" />
                <Chip label={`${props.metadata.hash.algorithm}:${truncate(props.metadata.hash.value, 8)}`} size="small" />
                <Typography variant="body2" color="textSecondary" component="p">
                    {props.metadata.description}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <ViewButton href={props.metadata.location} />
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

export default File;