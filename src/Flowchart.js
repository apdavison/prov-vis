import React from 'react';
import Stage from './Stage';
import Connector from './Connector';
import CircularProgress from '@material-ui/core/CircularProgress';

import StageDetail from './StageDetail'

export default function FlowChart(props) {

    const [dialogIsOpen, openDialog] = React.useState(false);
    const [currentItem, setCurrentItem] = React.useState({});

    const handleDialogOpen = (label) => {
        openDialog(true);
        let item = props.graph.node(label);
        setCurrentItem(item);
    };

    const handleDialogClose = () => {
        openDialog(false);
    };

    if (props.graph) {

        return (
            <div>
            {
                props.graph.nodes().map((label, index) => {
                    let item = props.graph.node(label);
                    item["label"] = label;
                    return (
                        <div onClick={() => handleDialogOpen(label)} key={"node" + index}>
                            <Stage type={item.type} label={label} x={item.x} y={item.y} size={props.size}
                                timestamp={item.timestamp} attributedTo={item.attributedTo} />
                        </div>
                    )
                })
            }
            {
                props.graph.edges().map((edge, index) => {
                    let parent = props.graph.node(edge.v);
                    let item = props.graph.node(edge.w);
                    return (
                        <div key={"edge" + index}>
                            <Connector from={parent} to={item} size={props.size} />
                        </div>
                    )
                })
            }
            <StageDetail open={dialogIsOpen} onClose={handleDialogClose} item={currentItem} />
            </div>
        )
    } else {
        return (
            <div style={{display: 'flex', justifyContent: 'center', marginTop: '40px'}}>
                <CircularProgress />
            </div>
        )
    }
}
