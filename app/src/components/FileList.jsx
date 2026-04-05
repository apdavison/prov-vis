import { useState } from "react";
import {
  IconButton,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableContainer,
  TableCell,
} from "@mui/material";
import { FileDownload, Visibility } from "@mui/icons-material";
import Preview from "./flowchart/Preview";

const supportedPreviewFormats = [
  "text/plain",
  "application/json",
  "image/png",
  "image/jpeg",
  "application/x-python",
];

function getHashStr(hashObj) {
  if (hashObj) {
    return `${hashObj.algorithm} ${hashObj.value}`;
  } else {
    return "";
  }
}

function getDownloadButton(url) {
  if (url && url.startsWith("http")) {
    return (
      <IconButton size="small" aria-label="download" href={url} target="_blank">
        <FileDownload />
      </IconButton>
    );
  } else {
    return "";
  }
}

function getPreviewButton(url, format, onClick) {
  if (url && url.startsWith("http") && supportedPreviewFormats.includes(format)) {
    return (
      <IconButton size="small" aria-label="preview" onClick={onClick}>
        <Visibility />
      </IconButton>
    );
  } else {
    return "";
  }
}

function FileList(props) {
  const [openPreview, setOpenPreview] = useState(false);
  const [currentPreview, setCurrentPreview] = useState({});

  let previews = [];
  for (const index in props.files) {
    const file = props.files[index];
    if (
      file.location &&
      file.location.startsWith("http") &&
      supportedPreviewFormats.includes(file.format)
    ) {
      previews.push(file);
    }
  }

  function handleOpenPreview(file) {
    setCurrentPreview(file);
    setOpenPreview(true);
  }

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="file list">
          <TableHead>
            <TableRow>
              <TableCell>Filename</TableCell>
              <TableCell />
              <TableCell />
              <TableCell>Format</TableCell>
              <TableCell>Hash</TableCell>
              <TableCell>Size (bytes)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.files.map((file) => (
              <TableRow
                key={file.file_name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{file.file_name}</TableCell>
                <TableCell>{getDownloadButton(file.location)}</TableCell>
                <TableCell>
                  {getPreviewButton(file.location, file.format, () =>
                    handleOpenPreview(file)
                  )}
                </TableCell>
                <TableCell>{file.format}</TableCell>
                <TableCell>{getHashStr(file.hash)}</TableCell>
                <TableCell>{file.size}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Preview
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        format={currentPreview.format}
        fileName={currentPreview.file_name}
        location={currentPreview.location}
      />
    </div>
  );
}

export default FileList;
