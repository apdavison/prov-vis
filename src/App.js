import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';

import SideBar from './SideBar';
import SearchBar from './SearchBar';
import RecipeOverview from './RecipeOverview';
import FlowChart from './Flowchart';
import positions from './positions';

import axios from 'axios';

import {
    graphlib,
    layout as dagreLayout,
} from "dagre";


const USE_EXAMPLE_DATA = false;
const exampleData = require('./example_data.json');
const MAX_DEPTH = 10;
const baseUrl = "https://prov.brainsimulation.eu"
const JITTER = 20;
const DEFAULT_COLLAB_SPACE = "collab-poc-workflows";  // todo: change to "myspace"

const size = {
    height: 250,
    width: 300
};

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }));


function getWorkflows(collabSpace, searchFilters, auth) {
    let url = baseUrl + "/workflows/?space=" + collabSpace;
    if (searchFilters) {
        const query_params = new URLSearchParams(searchFilters).toString();
        url += "&" + query_params;
    }
    let config = {
        headers: {
            'Authorization': 'Bearer ' + auth.token,
        }
    }
    console.log("Getting workflow executions from " + url);
    return axios.get(url, config)
};

function getRecipe(recipeId, auth) {
    let url = baseUrl + "/recipes/" + recipeId;
    let config = {
        headers: {
            'Authorization': 'Bearer ' + auth.token,
        }
    }
    console.log("Getting workflow recipe from " + url);
    return axios.get(url, config)
};

function extractUUID(uri) {
    // could do something fancier with regex, but for now do something simple
    const parts =  uri.split("/");
    return parts[parts.length - 1]
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
    } else {
        return "stage";
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
        g.setNode(itemId,
            {
                width: size.width,
                height: size.height,
                nodeType: determineNodeType(item),
                metadata: item
            });
        if (parent !== null) {
            let parentId = generateNodeIdentifier(parent);
            g.setEdge(parentId, itemId);
            //console.log(`Adding node with id ${itemId}, parent=${parentId}`);
        } else {
            //console.log(`Adding node with id ${itemId}, no parent`);
        }
        
    }
    console.log("Layout of workflow");
    console.log(workflow);
    workflow.stages.forEach(stage => {
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


function byDate(obj1, obj2) {
    // most recent first
    if (obj1.stages[0].start_time < obj2.stages[0].start_time) {
        return 1;
    }
    if (obj1.stages[0].start_time > obj2.stages[0].start_time) {
        return -1;
    }
    return 0;
};


function App(props) {
    const classes = useStyles();

    const theme = createMuiTheme({
        palette: {
          primary: green,
        },
      });

    const config = {
        marginx: positions.drawerWidth + 50,
        marginy: positions.menuBarHeight + positions.searchBarHeight + positions.objectDetailBarHeight + 20,
        nodesep: 100,
        ranksep: 50
    };

    const [index, setIndex] = useState(0);
    const [collabSpace, setCollabSpace] = useState(DEFAULT_COLLAB_SPACE);
    const [searchFilters, setSearchFilters] = useState({});
    const [workflows, setWorkflows] = useState([]);
    const [recipe, setRecipe] = useState(null);
    const [graph, setGraph] = useState(null);
    const [loaded, setLoaded] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        //console.log("Getting workflow data")
        if (USE_EXAMPLE_DATA) {
            let exampleWorkflows = exampleData[0].children.slice().sort(byDate);
            setWorkflows(exampleWorkflows);
            setLoaded(new Array(exampleWorkflows.length).fill(true));
        } else {
            handleSearchUpdate(collabSpace);
        }
    }, []);

    function handleSearchUpdate(searchCollabSpace, searchFilters) {
        setCollabSpace(searchCollabSpace);
        setSearchFilters(searchFilters);
        console.log(`Searching for workflows in space ${collabSpace}`);

        setLoading(true);
        getWorkflows(searchCollabSpace, searchFilters, props.auth)
        .then(res => {
            setLoading(false);
            console.log(res);
            let workflows = res.data.slice().sort(byDate);
            setWorkflows(workflows);
            setLoaded(new Array(workflows.length).fill(false));
        })
        .catch(err => {
            console.log('Error: ', err.message);
        });
    }

    function displayWorkflow(newIndex) {
        //console.log("Change displayed workflow " + newIndex);
        //console.log(loaded);
        setGraph(null);
        //if (!loaded[newIndex]) {
        if (false) {
            //console.log("Getting workflow data for #" + newIndex);
            let currentWorkflow = workflows[newIndex];
            setLoading(true);
            getWorkflows(collabSpace, searchFilters, props.auth)
            .then(res => {
                //console.log(res.data);
                setLoading(false);
                let newWorkflows = [...workflows];
                newWorkflows[newIndex] = res.data[0];
                const g = layout([newWorkflows[newIndex]], config);
                setWorkflows(newWorkflows);
                setIndex(newIndex);
                setGraph(g);
            }).catch(err => {
                console.log('Error: ', err.message);
            });
            let newLoaded = [...loaded];
            newLoaded[newIndex] = true;
            setLoaded(newLoaded);
        } else {
            getRecipe(workflows[newIndex].recipe_id, props.auth).
            then(res => {
                setRecipe(res.data);
            });
            const g = layout(workflows[newIndex], config);
            setIndex(newIndex);
            setGraph(g);
        }
    }

    return (
        <ThemeProvider theme={theme}>
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" noWrap>
                    EBRAINS: Workflows
                    </Typography>
                </Toolbar>
            </AppBar>
            <SearchBar onUpdate={handleSearchUpdate} auth={props.auth} />
            <SideBar workflows={workflows} handleSelect={displayWorkflow} selectedIndex={index} />
            <main className={classes.content}>
            <Toolbar />
            <RecipeOverview recipe={recipe} />
            <FlowChart graph={graph} size={size} jitter={JITTER} loading={loading} />
            </main>
        </div>
        </ThemeProvider>
    );
}

export default App;
