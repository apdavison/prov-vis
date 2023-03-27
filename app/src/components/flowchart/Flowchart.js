import React from 'react';

import Stage from './Stage';
import File from './File';
import Connector from './Connector';

import positions from './positions';

export default function FlowChart(props) {

    if (props.graph) {
        return (
            <div>
            {
                props.graph.nodes().map((label, index) => {
                    let item = props.graph.node(label);
                    item["label"] = label;
                    if (item.nodeType === "stage") {
                        return (
                            <div key={"node" + index}>
                                <Stage label={label} x={item.x} y={item.y} size={props.size}
                                    metadata={item.metadata} />
                            </div>
                        )
                    } else if (item.nodeType === "file") {
                        return (
                            <div key={"node" + index}>
                                <File label={label} x={item.x} y={item.y} size={props.size}
                                    metadata={item.metadata} />
                            </div>
                        )
                    } else {
                        console.log(`TODO: Not yet able to show ${item.nodeType} objects`);
                        return null;
                    }
                })
            }
            {
                props.graph.edges().map((edge, index) => {
                    let parent = props.graph.node(edge.v);
                    let item = props.graph.node(edge.w);
                    return (
                        <div key={"edge" + index}>
                            <Connector from={parent} to={item} size={props.size} jitter={props.jitter} />
                        </div>
                    )
                })
            }
            </div>
        )
    } else {
        return (
            <div sx={{display: 'flex', justifyContent: 'center', marginTop: positions.menuBarHeight + positions.navBarHeight + 100 + 'px'}}>
                <p>Workflow not found</p>
            </div>
        )
    }
}
