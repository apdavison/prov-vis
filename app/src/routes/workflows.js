import React from "react";
import { Link, useLoaderData } from "react-router-dom";
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

import { datastore } from "../datastore";
import { fullName, getTimeStamp } from "../utils";
import Navigation from "../components/Navigation";

export async function loader() {
  const workflows = await datastore.getWorkflows(null, {});
  console.log(workflows);
  return { workflows };
}

function getRecipeName(recipe) {
  if (recipe) {
    return <a href={recipe.location}>{recipe.name}</a>;
  } else {
    return "";
  }
}

function Workflows(props) {
  const { workflows } = useLoaderData();
  console.log(workflows);

  return (
    <div id="workflows">
      <Navigation location={["Runs"]} />

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
            {workflows.map((workflow) => (
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
    </div>
  );
}

export default Workflows;
