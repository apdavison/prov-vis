import React from 'react';
import Stage from './Stage';
import Connector from './Connector';
import {
    graphlib,
    layout as dagreLayout,
} from "dagre";


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
        </div>
    );
}

export default App;
