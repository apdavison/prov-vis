import React from "react";
import { Link } from "react-router-dom";
import { ZoomIn } from "@mui/icons-material";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { fullName, getTimeStamp } from "../utils";

function getRecipeName(recipe) {
  if (recipe) {
    return <a href={recipe.location}>{recipe.name}</a>;
  } else {
    return "";
  }
}

function WorkflowTable(props) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="list of workflow runs">
        <TableHead>
          <TableRow sx={{ bgcolor: "#dddddd" }}>
            <TableCell></TableCell>
            <TableCell>Timestamp</TableCell>
            <TableCell align="left">Recipe</TableCell>
            <TableCell>Run by</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.workflows.map((workflow) => (
            <TableRow
              key={workflow.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>
                <Link to={workflow.id}>
                  <ZoomIn />
                </Link>
              </TableCell>
              <TableCell>{getTimeStamp(workflow.stages)}</TableCell>
              <TableCell>{getRecipeName(workflow.recipe)}</TableCell>
              <TableCell>{fullName(workflow.started_by)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default WorkflowTable;
