import { useLoaderData } from "react-router-dom";
import {
    graphlib,
    layout as dagreLayout,
} from "dagre";
import Navigation from "../components/Navigation";
import FlowChart from "../components/flowchart/Flowchart";
import { JITTER } from "../globals";
import positions from "../components/flowchart/positions";

const size = {
    height: 250,
    width: 300
};

const config = {
    marginx: 50,
    marginy: positions.menuBarHeight + positions.navBarHeight + 20,
    nodesep: 20,
    ranksep: 50
};

function generateNodeIdentifier(item) {
    if (item.software_name) {
        return `${item.software_name} ${item.software_version}`;
    } else if (item.file_name) {
        if (item.location && item.hash) {
            return `${item.location} (checksum ${item.hash.algorithm}:${item.hash.value})`;
        } else {
            return item.file_name;
        }
    } else {
        return item.id;
    }
};

function determineNodeType(item) {
    if (item.software_name) {
        return "software";
    } else if (item.file_name) {
        return "file";
    } else if (item.start_time) {
        return "stage";
    } else {
        return "unknown";
    }
};

function layout(workflow, config) {
    var g = new graphlib.Graph();
    // Set an object for the graph label
    g.setGraph(config);
    // Default to assigning a new object as a label for each new edge.
    g.setDefaultEdgeLabel(function() { return {}; });
    // Add nodes to the graph.
    function addNode(g, item, parent) {
        let itemId = generateNodeIdentifier(item);
        let nodeType = determineNodeType(item);
        g.setNode(itemId,
            {
                width: size.width,
                height: size.height,
                nodeType: nodeType,
                metadata: item
            });
        if (parent !== null) {
            let parentId = generateNodeIdentifier(parent);
            g.setEdge(parentId, itemId);
            //console.log(`Adding node with id ${itemId} and type ${nodeType}, parent=${parentId}`);
        } else {
            //console.log(`Adding node with id ${itemId} and type ${nodeType}, no parent`);
        }

    }
    console.log("Layout of workflow");
    console.log(workflow);
    workflow.stages.forEach(stage => {
        addNode(g, stage, null);
        stage.input.forEach(input => {
            addNode(g, input, null);
            addNode(g, stage, input);
        });
        stage.output.forEach(output => {
            addNode(g, output, stage);
        });
    });
    // Use dagre to perform layout
    dagreLayout(g);
    return g;
}

function WorkflowGraph() {
    const { workflow } = useLoaderData();

    const location = ["Runs", workflow.id, "graph"];

    const g = layout(workflow, config);

    return (
      <div id="workflow-graph">
        <Navigation location={location} />

        <FlowChart graph={g} size={size} jitter={JITTER} />

        </div>
    )
}

export default WorkflowGraph;
