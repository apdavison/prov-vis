import React from 'react';
import Stage from './Stage';
import Connector from './Connector';
import CircularProgress from '@material-ui/core/CircularProgress';

import StageDetail from './StageDetail';
import positions from './positions';

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

    function getCode(item) {
        if (item && item.code) {
            return item.code.name;
        } else {
            return "";
        }
    }

    if (props.graph && !props.loading) {
        return (
            <div>
            {
                props.graph.nodes().map((label, index) => {
                    let item = props.graph.node(label);
                    item["label"] = label;
                    return (
                        <div onClick={() => handleDialogOpen(label)} key={"node" + index}>
                            <Stage type={item.type} label={label} x={item.x} y={item.y} size={props.size}
                                timestamp={item.timestamp} attributedTo={item.attributedTo}
                                code={getCode(item)} output={item.output} uri={item.uri} />
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
                            <Connector from={parent} to={item} size={props.size} jitter={props.jitter} />
                        </div>
                    )
                })
            }
            <StageDetail open={dialogIsOpen} onClose={handleDialogClose} item={currentItem} />
            </div>
        )
    } else if (props.loading) {
        return (
            <div style={{display: 'flex', justifyContent: 'center', marginTop: positions.searchBarHeight + positions.objectDetailBarHeight + 100 + 'px'}}>
                <CircularProgress />
            </div>
        )
    } else {
        return (
            <div style={{display: 'flex', justifyContent: 'center', marginTop: positions.searchBarHeight + positions.objectDetailBarHeight + 100 + 'px'}}>
                <p>Click in left column to load pipeline</p>
            </div>
        )
    }
}
