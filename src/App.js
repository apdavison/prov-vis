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

/*
const data = [
    {
        type_: "entity",
        label: "1.cghmwhgcmeorzhbcmoerzhbcmrjbc;b oigmerogx eomxiguersgnce oaexoeasg roigmxoruieug xrimgxu",
        timestamp: "2020-09-23T12:43:34",
        attributed_to: "Michael Palin",
        children: [
            {
                type_: "activity",
                label: "2a",
                timestamp: "2020-09-23T12:43:34",
                attributed_to: "Michael Palin",
                children: []
            },
            {
                type_: "entity",
                label: "2b",
                timestamp: "2020-09-23T12:43:34",
                attributed_to: "Michael Palin",
                children: [
                    {
                        type_: "entity",
                        label: "3a",
                        timestamp: "2020-09-23T12:43:34",
                        attributed_to: "Michael Palin",
                        children: [
                            {
                                type_: "entity",
                                label: "4a",
                                timestamp: "2020-09-23T12:43:34",
                                attributed_to: "Michael Palin",
                                children: []
                            },
                            {
                                type_: "entity",
                                label: "4b",
                                timestamp: "2020-09-23T12:43:34",
                                attributed_to: "Michael Palin",
                                children: []}
                        ]
                    },
                ]
            }
        ]
    }
];
*/

const baseUrl = "https://neural-activity-resource.brainsimulation.eu"

export function getPipelines(startingPointType, startingPointID, auth) {

    let url = baseUrl + "/pipeline/?type_=" + startingPointType + "&id=" + startingPointID + "&direction=downstream&max_depth=10";
    let config = {
        headers: {
            'Authorization': 'Bearer ' + auth.token,
        }
    }
    return axios.get(url, config)
        // .then(res => {
        //     console.log(res);
        //     return res.data;
        // })
        // .catch(err => {
        //     console.log('Error: ', err.message);
        // });
};

//const data = require('./example_data.json');


const size = {
    height: 200,
    width: 300
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
                attributedTo: item.attributed_to
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

    const [state, setState] = useState({
        index: 0,
        pipelines: [],
        graph: null
    });

    useEffect(() => {
        console.log("Getting pipeline data")
        getPipelines("electrophysiology.MultiChannelMultiTrialRecording",
                     "542e63ea-e096-415b-9ca7-36e37c4fe332",
                    props.auth)
        .then(res => {
            console.log(res);
            let pipelines = res.data[0].children;
            setState({
                index: 0,
                pipelines: pipelines,
                graph: layout([pipelines[0]], config)
            })
        })
        .catch(err => {
            console.log('Error: ', err.message);
        });
    }, []);

    function displayPipeline(index) {
        console.log("Change displayed pipeline");
        console.log(index);
        const g = layout([state.pipelines[index]], config);
        setState({index: index, graph: g, pipelines: state.pipelines});
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
            <SideBar pipelines={state.pipelines} handleSelect={displayPipeline} selectedIndex={state.index} />
            <main className={classes.content}>
            <Toolbar />
            <FlowChart graph={state.graph} size={size} />
            </main>
        </div>
    );
}

export default App;
