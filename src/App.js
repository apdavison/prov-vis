import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import SideBar from './SideBar';
import FlowChart from './Flowchart';

import axios from 'axios';

import {
    graphlib,
    layout as dagreLayout,
} from "dagre";


const USE_EXAMPLE_DATA = false;
const example_data = require('./example_data.json');
const MAX_DEPTH = 10;
const baseUrl = "https://neural-activity-resource.brainsimulation.eu"

const size = {
    height: 200,
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
                output: item.output
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


function App(props) {
    const classes = useStyles();

    const config = {
        marginx: 240 + 50,  // same as drawerWidth in SideBar.js
        marginy: 100,
        nodesep: 100,
        ranksep: 50
    };

    const [index, setIndex] = useState(0);
    const [pipelines, setPipelines] = useState([]);
    const [graph, setGraph] = useState(null);
    const [loaded, setLoaded] = useState([]);

    useEffect(() => {
        //console.log("Getting pipeline data")
        if (USE_EXAMPLE_DATA) {
            let pipelines = example_data[0].children;
            setIndex(0);
            setPipelines(pipelines);
            setGraph(layout([pipelines[0]], config));
            setLoaded(new Array(pipelines.length).fill(true))
        } else {
            getPipelines("electrophysiology.MultiChannelMultiTrialRecording",
                         "542e63ea-e096-415b-9ca7-36e37c4fe332",
                         props.auth,
                         0)
            .then(res => {
                //console.log(res);
                let pipelines = res.data[0].children;
                setIndex(0);
                setPipelines(pipelines);
                setGraph(layout([pipelines[0]], config));
                setLoaded(new Array(pipelines.length).fill(false))
            })
            .catch(err => {
                console.log('Error: ', err.message);
            });
        }
    }, []);

    function displayPipeline(index) {
        //console.log("Change displayed pipeline " + index);
        //console.log(loaded);
        if (!loaded[index]) {
            //console.log("Getting pipeline data for #" + index);
            let startingPoint = pipelines[index];
            getPipelines(startingPoint.type_,
                         extractUUID(startingPoint.uri),
                         props.auth,
                         MAX_DEPTH)
            .then(res => {
                //console.log(res.data[0]);
                let newPipelines = [...pipelines];
                newPipelines[index] = res.data[0];
                const g = layout([newPipelines[index]], config);
                setIndex(index);
                setGraph(g);
                setPipelines(newPipelines);
            }).catch(err => {
                console.log('Error: ', err.message);
            });
            let newLoaded = [...loaded];
            newLoaded[index] = true;
            setLoaded(newLoaded);
        } else {
            const g = layout([pipelines[index]], config);
            setIndex(index);
            setGraph(g);
            setPipelines(pipelines);
        }
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" noWrap>
                    Toolbar
                    </Typography>
                </Toolbar>
            </AppBar>
            <SideBar pipelines={pipelines} handleSelect={displayPipeline} selectedIndex={index} />
            <main className={classes.content}>
            <Toolbar />
            <FlowChart graph={graph} size={size} />
            </main>
        </div>
    );
}

export default App;
