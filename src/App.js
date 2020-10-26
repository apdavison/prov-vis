import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import amber from '@material-ui/core/colors/amber';

import SideBar from './SideBar';
import SearchBar from './SearchBar';
import ObjectDetail from './ObjectDetail';
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
const baseUrl = "https://neural-activity-resource.brainsimulation.eu"
const JITTER = 20;

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


function getPipelines(startingPointType, startingPointID, auth, max_depth) {
    let url = baseUrl + "/pipeline/?type_=" + startingPointType + "&id=" + startingPointID + "&direction=downstream&max_depth=" + max_depth;
    let config = {
        headers: {
            'Authorization': 'Bearer ' + auth.token,
        }
    }
    console.log("Getting pipeline data from " + url);
    return axios.get(url, config)
};


function extractUUID(uri) {
    // could do something fancier with regex, but for now do something simple
    const parts =  uri.split("/");
    return parts[parts.length - 1]
};


function layout(flowchart, config) {
    var g = new graphlib.Graph();
    // Set an object for the graph label
    g.setGraph(config);
    // Default to assigning a new object as a label for each new edge.
    g.setDefaultEdgeLabel(function() { return {}; });
    // Add nodes to the graph.
    function addNode(g, item, parent) {
        g.setNode(item.label,
            {
                width: size.width,
                height: size.height,
                type: item.type_,
                timestamp: item.timestamp,
                attributedTo: item.attributed_to,
                desciption: item.description,
                code: item.code,
                output: item.output,
                uri: item.uri
            });
        if (parent !== null) {
            g.setEdge(parent.label, item.label);
        }
        item.children.forEach(childItem => addNode(g, childItem, item));
    }
    flowchart.forEach(item => addNode(g, item, null));
    // Use dagre to perform layout
    dagreLayout(g);
    return g;
}


function byDate(obj1, obj2) {
    // most recent first
    if (obj1.timestamp < obj2.timestamp) {
        return 1;
    }
    if (obj1.timestamp > obj2.timestamp) {
        return -1;
    }
    return 0;
};


function App(props) {
    const classes = useStyles();

    const theme = createMuiTheme({
        palette: {
          primary: amber,
        },
      });

    const config = {
        marginx: positions.drawerWidth + 50,
        marginy: positions.menuBarHeight + positions.searchBarHeight + positions.objectDetailBarHeight + 20,
        nodesep: 100,
        ranksep: 50
    };

    const [index, setIndex] = useState(0);
    const [obj, setObj] = useState(null);
    const [pipelines, setPipelines] = useState([]);
    const [graph, setGraph] = useState(null);
    const [loaded, setLoaded] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        //console.log("Getting pipeline data")
        if (USE_EXAMPLE_DATA) {
            let examplePipelines = exampleData[0].children.slice().sort(byDate);
            setPipelines(examplePipelines);
            setLoaded(new Array(examplePipelines.length).fill(true));
        } else {
            handleSearchUpdate(
                "electrophysiology.MultiChannelMultiTrialRecording",
                "542e63ea-e096-415b-9ca7-36e37c4fe332"
            )
        }
    }, []);

    function handleSearchUpdate(objType, objId) {
        console.log(`Searching for ${objType} with ID ${objId}`);
        setLoading(true);
        getPipelines(objType, objId, props.auth, 0)
        .then(res => {
            setLoading(false);
            setObj(res.data[0]);
            let initialStages = res.data[0].children.slice().sort(byDate);
            setPipelines(initialStages);
            setLoaded(new Array(initialStages.length).fill(false));
        })
        .catch(err => {
            console.log('Error: ', err.message);
        });
    }

    function displayPipeline(newIndex) {
        //console.log("Change displayed pipeline " + newIndex);
        //console.log(loaded);
        setGraph(null);
        if (!loaded[newIndex]) {
            //console.log("Getting pipeline data for #" + newIndex);
            let startingPoint = pipelines[newIndex];
            setLoading(true);
            getPipelines(startingPoint.type_,
                         extractUUID(startingPoint.uri),
                         props.auth,
                         MAX_DEPTH)
            .then(res => {
                //console.log(res.data[0]);
                setLoading(false);
                let newPipelines = [...pipelines];
                newPipelines[newIndex] = res.data[0];
                const g = layout([newPipelines[newIndex]], config);
                setPipelines(newPipelines);
                setIndex(newIndex);
                setGraph(g);
            }).catch(err => {
                console.log('Error: ', err.message);
            });
            let newLoaded = [...loaded];
            newLoaded[newIndex] = true;
            setLoaded(newLoaded);
        } else {
            const g = layout([pipelines[newIndex]], config);
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
                    EBRAINS: Data analysis pipelines
                    </Typography>
                </Toolbar>
            </AppBar>
            <SearchBar onUpdate={handleSearchUpdate} />
            <ObjectDetail obj={obj} />
            <SideBar pipelines={pipelines} handleSelect={displayPipeline} selectedIndex={index} />
            <main className={classes.content}>
            <Toolbar />
            <FlowChart graph={graph} size={size} jitter={JITTER} loading={loading} />
            </main>
        </div>
        </ThemeProvider>
    );
}

export default App;
