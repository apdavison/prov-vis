import React from "react";
import { Link } from "react-router-dom";
import { ZoomIn, FormatListBulleted as List } from "@mui/icons-material";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getDevelopersString } from "../utils";

function RecipeTable(props) {
  const [typeFilter, setTypeFilter] = React.useState("");

  let availableTypeFilters = new Set();
  props.recipes.forEach((recipe) => {
    if (recipe.type) {
      availableTypeFilters.add(recipe.type);
    } else {
      recipe.type = "unknown";
    }
  });
  availableTypeFilters = Array.from(availableTypeFilters);

  const handleChange = (event) => {
    setTypeFilter(event.target.value);
  };

  const filterByType = (item) => {
    if (typeFilter) {
      return item.type === typeFilter;
    } else {
      return true;
    }
  };

  return (
    <React.Fragment>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <FormControl sx={{ m: 1, minWidth: 240 }} size="small">
          <InputLabel id="select-type-filter">Filter by type</InputLabel>
          <Select
            labelId="select-type-filter"
            id="select-type-filter"
            value={typeFilter}
            label="Filter by type"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>Show all</em>
            </MenuItem>
            {availableTypeFilters.map((name) => (
              <MenuItem value={name}>{name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="list of workflow recipes">
          <TableHead>
            <TableRow sx={{ bgcolor: "#dddddd" }}>
              <TableCell></TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Authors</TableCell>
              <TableCell>Definition</TableCell>
              <TableCell>Collab</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.recipes.filter(filterByType).map((recipe) => (
              <TableRow
                key={recipe.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell>
                  <Link to={recipe.id}>
                    <ZoomIn />
                  </Link>
                </TableCell>
                <TableCell>{recipe.name}</TableCell>
                <TableCell>{recipe.type || "unknown"}</TableCell>
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
                <TableCell>{recipe.project_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}

export default RecipeTable;
