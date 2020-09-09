import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import Stage from './Stage';
import Connector from './Connector';
import SideBar from './SideBar';

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
const data = require('./example_data.json');

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


function App() {
    const classes = useStyles();

    const config = {
        marginx: 240 + 50,  // same as drawerWidth in SideBar.js
        marginy: 100,
        nodesep: 100,
        ranksep: 50
    };

    const pipelines = data[0].children;


    function displayPipeline(index) {
        console.log("Change displayed pipeline");
        console.log(index);
        //const g = layout(pipelines[index], config);
    }
    let g = layout(data, config);

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
            <SideBar pipelines={pipelines} handleSelect={displayPipeline}/>
            <main className={classes.content}>
            <Toolbar />
            {
                g.nodes().map((label, index) => {
                    let item = g.node(label);
                    item["label"] = label;
                    return (
                        <div>
                            <Stage type={item.type} label={label} x={item.x} y={item.y} size={size}
                                   timestamp={item.timestamp} attributedTo={item.attributedTo} />
                        </div>
                    )
                })
            }
            {
                g.edges().map((edge, index) => {
                    let parent = g.node(edge.v);
                    let item = g.node(edge.w);
                    return (
                        <div>
                            <Connector from={parent} to={item} size={size}/>
                        </div>
                    )
                })
            }
            </main>
        </div>
    );
}

export default App;
