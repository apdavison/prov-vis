import React from 'react';
import Stage from './Stage';
import Connector from './Connector';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function FlowChart(props) {

    if (props.graph) {

        return (
            <div>
            {
                props.graph.nodes().map((label, index) => {
                    let item = props.graph.node(label);
                    item["label"] = label;
                    return (
                        <div>
                            <Stage type={item.type} label={label} x={item.x} y={item.y} size={props.size}
                                timestamp={item.timestamp} attributedTo={item.attributedTo} key={"node" + index} />
                        </div>
                    )
                })
            }
            {
                props.graph.edges().map((edge, index) => {
                    let parent = props.graph.node(edge.v);
                    let item = props.graph.node(edge.w);
                    return (
                        <div>
                            <Connector from={parent} to={item} size={props.size}  key={"edge" + index} />
                        </div>
                    )
                })
            }
            </div>
        )
    } else {
        return (
            <div style={{display: 'flex', justifyContent: 'center', marginTop: '40px'}}>
                <CircularProgress />;
            </div>
        )
    }
}
