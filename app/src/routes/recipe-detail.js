import { useLoaderData } from "react-router-dom";
import { Button, Paper, Typography } from "@mui/material";
import { FormatListBulleted as List } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import { datastore } from "../datastore";
import { getDevelopersString } from "../utils";
import Navigation from "../components/Navigation";

export async function loader({ params }) {
  const recipe = await datastore.getRecipe(params.recipeId);
  console.log(recipe);
  return { recipe };
}

// https://gitlab.ebrains.eu/technical-coordination/project-internal/standardised-workflows/sc3_cwl/-/blob/f778dc8fb08f4757ec97ee64dcbb0ec28852a14c/steps/run_simulation.cwl
// https://gitlab.ebrains.eu/technical-coordination/project-internal/standardised-workflows/sc3_cwl/-/raw/f778dc8fb08f4757ec97ee64dcbb0ec28852a14c/steps/run_simulation.cwl?inline=false

function Workflow() {
  const { recipe } = useLoaderData();
  console.log(recipe);
  let location = ["Recipes", recipe.id];

  return (
    <div id="recipe">
      <Navigation location={location} />

      <Paper sx={{ padding: 2, margin: 1, bgcolor: "#dddddd" }}>
        <Typography variant="h2" gutterBottom>
          {recipe.name} ({recipe.version_identifier})
        </Typography>
        <Typography variant="body1" gutterBottom>
          {getDevelopersString(recipe.developers)}
        </Typography>
        <Typography variant="caption" gutterBottom display="block">
          <b>Type:</b> {recipe.type} <b>Recipe ID:</b> {recipe.id}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<List />}
          href={recipe.location}
          target="_blank"
        >
          View recipe definition
        </Button>
      </Paper>

      <Paper sx={{ padding: 2, margin: 1 }}>
        <ReactMarkdown
          components={{
            h1: "h2",
            h2: "h3",
            h3: "h4",
          }}
        >
          {recipe.description}
        </ReactMarkdown>
      </Paper>
    </div>
  );
}

export default Workflow;
