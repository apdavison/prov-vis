import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

import { getRecipeName } from "../utils";
import Environment from "./Environment";
import LaunchConfig from "./LaunchConfig";
import FileList from "./FileList";
import KeyValueTable from "./KeyValueTable";

function getResourceUsage(resources) {
  return resources.map((item) => `${item.value} ${item.units};`).join("");
}

function StageDetail(props) {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{ bgcolor: "#dddddd" }}
      >
        <Typography>{getRecipeName(props.stage.recipe)}</Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Paper sx={{ padding: 2, margin: 1 }}>
          <KeyValueTable
            data={{
              ID: props.stage.id,
              "Start time": props.stage.start_time,
              "End time": props.stage.end_time,
              Description: props.stage.description,
              Status: props.stage.status,
              Type: props.stage.type,
              Tags: props.stage.tags,
              "Resource Usage": getResourceUsage(props.stage.resource_usage),
            }}
            boldKeys
          />
        </Paper>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{ bgcolor: "#dddddd" }}
          >
            Environment
          </AccordionSummary>
          <AccordionDetails>
            <Environment env={props.stage.environment} />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{ bgcolor: "#dddddd" }}
          >
            Inputs
          </AccordionSummary>
          <AccordionDetails>
            <FileList files={props.stage.input} />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{ bgcolor: "#dddddd" }}
          >
            Launch configuration
          </AccordionSummary>
          <AccordionDetails>
            <LaunchConfig config={props.stage.launch_config} />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{ bgcolor: "#dddddd" }}
          >
            Outputs
          </AccordionSummary>
          <AccordionDetails>
            <FileList files={props.stage.output} />
          </AccordionDetails>
        </Accordion>
      </AccordionDetails>
    </Accordion>
  );
}

export default StageDetail;
