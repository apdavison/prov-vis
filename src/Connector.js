import React from 'react';
import HLine from './HLine';
import VLine from './VLine';


function Connector(props) {
    if (props.from === null) {
        return "";
    }
    const startPoint = {
        x: props.from.x,
        y: props.from.y //+ props.size.height/2
    };
    const endPoint = {
        x: props.to.x,
        y: props.to.y //- props.size.height/2
    }
    const dx = endPoint.x - startPoint.x;
    if (dx > 0) {
        return (
            <React.Fragment>
                <VLine x={startPoint.x} y0={startPoint.y} y1={(startPoint.y + endPoint.y)/2} />
                <VLine x={endPoint.x} y1={endPoint.y} y0={(startPoint.y + endPoint.y)/2} />
                <HLine x0={startPoint.x} x1={endPoint.x} y={(startPoint.y + endPoint.y)/2} />
            </React.Fragment>
        )
    } else if (dx < 0) {
        return (
            <React.Fragment>
                <VLine x={startPoint.x} y0={startPoint.y} y1={(startPoint.y + endPoint.y)/2} />
                <VLine x={endPoint.x} y1={endPoint.y} y0={(startPoint.y + endPoint.y)/2} />
                <HLine x1={startPoint.x} x0={endPoint.x} y={(startPoint.y + endPoint.y)/2} />
            </React.Fragment>
        )
    } else {
        return (
            <React.Fragment>
                <VLine x={startPoint.x} y0={startPoint.y} y1={endPoint.y} />
            </React.Fragment>
        )
    }
}

export default Connector;