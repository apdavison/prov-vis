import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import { ZoomIn, FormatListBulleted as List } from "@mui/icons-material";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";


import { datastore } from "../datastore";
import { getDevelopersString } from "../utils";
import Navigation from "../components/Navigation";

export async function loader() {
  const recipes = await datastore.getRecipes(null, {});
  console.log(recipes);
  return { recipes };
}

function Workflows(props) {
  const { recipes } = useLoaderData();
  console.log(recipes);

  return (
    <div id="recipes">
      <Navigation location={["Recipes"]} />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="list of workflow recipes">
          <TableHead>
            <TableRow sx={{ bgcolor: "#dddddd" }}>
              <TableCell></TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Authors</TableCell>
              <TableCell align="left">Definition</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recipes.map((recipe) => (
              <TableRow
                key={recipe.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <Link to={recipe.id}>
                    <ZoomIn />
                  </Link>
                </TableCell>
                <TableCell>{recipe.name}</TableCell>
                <TableCell>{getDevelopersString(recipe.developers)}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    startIcon={<List />}
                    href={recipe.location}
                    target="_blank"
                  >
                    View recipe definition
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Workflows;
