import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  IconButton,
  Chip,
} from "@mui/material";
import { Visibility, CloudDownloadOutlined } from "@mui/icons-material";
import Preview from "./Preview";

const colours = {
  entity: "moccasin",
  activity: "paleturquoise",
};

const TRUNCATE_AT = 25;

function truncate(str, n) {
  return str.length > n ? str.substr(0, n - 1) + "…" : str;
}

function formatTimestamp(timestamp) {
  let dateObj = new Date(timestamp);
  return "⏱ " + dateObj.toLocaleString("en-GB", { timeZone: "UTC" });
}

function formatType(typeIdentifier) {
  return typeIdentifier;
}

function getFileExtension(url) {
  const urlObj = new URL(url);
  const path = urlObj.pathname.split("/");
  return path[path.length - 1].split(".")[1];
}

function formatFileSize(numBytes) {
  if (numBytes === 0) {
    return "0 B";
  }
  let n = Math.floor(Math.log2(numBytes) / Math.log2(1024));
  let size = numBytes / Math.pow(1024, n);
  const prefix = ["", "K", "M", "G", "T"];
  return `${size.toFixed(1)} ${prefix[n]}iB`;
}

function ViewButton(props) {
  if (props.location && props.location.startsWith("https://") && props.format) {
    if (props.format.startsWith("image") || props.format.startsWith("text")) {
      return (
        <IconButton aria-label="preview" onClick={props.onClick}>
          <Visibility />
        </IconButton>
      );
    }
  }
  return "";
}

function DownloadButton(props) {
  if (props.href && props.href.startsWith("https://")) {
    return (
      <IconButton aria-label="download" href={props.href} target="_blank">
        <CloudDownloadOutlined />
      </IconButton>
    );
  } else {
    return (
      <Button disabled variant="contained">
        Not available
      </Button>
    );
  }
}

function File(props) {
  const width = props.size.width;
  const height = props.size.height;
  const styles = {
    top: props.y - height / 2 + "px",
    left: props.x - width / 2 + "px",
    width: width + "px",
    height: height + "px",
    backgroundColor: colours[props.type],
    position: "absolute",
  };
  const [openPreview, setOpenPreview] = React.useState(false);

  function handleClosePreview() {
    setOpenPreview(false);
  }

  function handleOpenPreview() {
    setOpenPreview(true);
  }

  return (
    <React.Fragment>
      <Card id="stage{props.label}" sx={styles}>
        <CardContent>
          <Typography variant="overline" gutterBottom>
            file
          </Typography>
          <Typography gutterBottom variant="body" component="h3">
            {truncate(props.metadata.file_name, TRUNCATE_AT)}
          </Typography>
          <Chip label={props.metadata.format} size="small" />
          <Chip label={formatFileSize(props.metadata.size)} size="small" />
          <Chip
            label={
              props.metadata.hash
                ? `${props.metadata.hash.algorithm}:${truncate(
                    props.metadata.hash.value,
                    8
                  )}`
                : ""
            }
            size="small"
          />
          <Typography variant="body2" color="textSecondary" component="p">
            {props.metadata.description}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <DownloadButton href={props.metadata.location} />
          <ViewButton
            location={props.metadata.location}
            format={props.metadata.format}
            onClick={handleOpenPreview}
          />
        </CardActions>
      </Card>
      <Preview
        open={openPreview}
        onClose={handleClosePreview}
        format={props.metadata.format}
        fileName={props.metadata.file_name}
        location={props.metadata.location}
      />
    </React.Fragment>
  );
}

export default File;
