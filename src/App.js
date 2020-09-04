import React from 'react';
import Stage from './Stage';
import Connector from './Connector';
import {
    graphlib,
    layout as dagreLayout,
} from "dagre";


const data = [
    {
        type: "entity",
        label: "1",
        children: [
            {
                type: "activity",
                label: "2a",
                children: []
            },
            {
                type: "entity",
                label: "2b",
                children: [
                    {
                        type: "entity",
                        label: "3a",
                        children: [
                            {
                                type: "entity",
                                label: "4a",
                                children: []
                            },
                            {
                                type: "entity",
                                label: "4b",
                                children: []}
                        ]
                    },
                ]
            }
        ]
    }
];


const size = {
    height: 100,
    width: 150
};


function layout(flowchart, config) {
    var g = new graphlib.Graph();
    // Set an object for the graph label
    g.setGraph(config);
    // Default to assigning a new object as a label for each new edge.
    g.setDefaultEdgeLabel(function() { return {}; });
    // Add nodes to the graph.
    function addNode(g, item, parent) {
        g.setNode(item.label, {width: size.width, height: size.height, type: item.type});
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

    const config = {
        marginx: 100,
        marginy: 100,
        nodesep: 100,
        ranksep: 50
    };
    const g = layout(data, config);

    return (
        <div className="App">
            {
                g.nodes().map((label, index) => {
                    let item = g.node(label);
                    item["label"] = label;
                    return (
                        <div>
                            <Stage type={item.type} label={label} x={item.x} y={item.y} size={size}/>
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
        </div>
    );
}

export default App;
