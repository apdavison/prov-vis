import { useLoaderData, Link as RouterLink } from "react-router-dom";
import { Button, Paper, Typography } from "@mui/material";
import { Schema } from "@mui/icons-material";
import { datastore } from "../datastore";
import { fullName, getTimeStamp, getRecipeName } from "../utils";
import KeyValueTable from "../components/KeyValueTable";
import StageDetail from "../components/StageDetail";
import Navigation from "../components/Navigation";

export async function loader({ params }) {
  const workflow = await datastore.getWorkflow(params.workflowId);
  console.log(workflow);
  return { workflow };
}



function Workflow() {
  const { workflow } = useLoaderData();
  console.log(workflow);
  let location = ["Runs", workflow.id];

  return (
    <div id="workflow">
      <Navigation location={location} />

      <Paper sx={{ padding: 2, margin: 1, bgcolor: "#dddddd" }}>
        <Typography variant="h2" gutterBottom>
          {getRecipeName(workflow.recipe)}
        </Typography>
        <Typography variant="caption">
          <b>Run ID:</b> {workflow.id}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Started by {fullName(workflow.started_by)} on{" "}
          {getTimeStamp(workflow.stages)}
        </Typography>
        <Button variant="outlined" startIcon={<Schema />} component={RouterLink} to="graph">
          View flowchart
        </Button>
      </Paper>

      <Paper sx={{ padding: 2, margin: 1 }}>
        <Typography variant="h3" gutterBottom>
          Configuration
        </Typography>
        <KeyValueTable data={workflow.configuration} />
      </Paper>

      <Paper sx={{ padding: 2, margin: 1 }}>
        <Typography variant="h3" gutterBottom>
          Stages
        </Typography>

        {workflow.stages.map((stage) => (
          <StageDetail stage={stage} key={stage.id} />
        ))}
      </Paper>
    </div>
  );
}

export default Workflow;
