import React from 'react';
import randomColor from 'randomcolor';
import HLine from './HLine';
import VLine from './VLine';


function randomUniform(min, max) {
  return Math.random() * (max - min) + min;
};


function getJitter(jitterAmount) {
    if (jitterAmount) {
        return randomUniform(-jitterAmount, jitterAmount);
    } else {
        return 0;
    }
};


function Connector(props) {
    if (props.from === null) {
        return "";
    }
    const jitter = getJitter(props.jitter);
    const startPoint = {
        x: props.from.x + jitter,
        y: props.from.y //+ props.size.height/2
    };
    const endPoint = {
        x: props.to.x + jitter,
        y: props.to.y //- props.size.height/2
    }
    const dx = endPoint.x - startPoint.x;
    const colour = randomColor({luminosity: 'dark'});
    if (dx > 0) {
        return (
            <React.Fragment>
                <VLine x={startPoint.x} y0={startPoint.y} y1={(startPoint.y + endPoint.y)/2} colour={colour} />
                <VLine x={endPoint.x} y1={endPoint.y} y0={(startPoint.y + endPoint.y)/2} colour={colour} />
                <HLine x0={startPoint.x} x1={endPoint.x} y={(startPoint.y + endPoint.y)/2} colour={colour} />
            </React.Fragment>
        )
    } else if (dx < 0) {
        return (
            <React.Fragment>
                <VLine x={startPoint.x} y0={startPoint.y} y1={(startPoint.y + endPoint.y)/2} colour={colour} />
                <VLine x={endPoint.x} y1={endPoint.y} y0={(startPoint.y + endPoint.y)/2} colour={colour} />
                <HLine x1={startPoint.x} x0={endPoint.x} y={(startPoint.y + endPoint.y)/2} colour={colour} />
            </React.Fragment>
        )
    } else {
        return (
            <React.Fragment>
                <VLine x={startPoint.x} y0={startPoint.y} y1={endPoint.y} colour={colour} />
            </React.Fragment>
        )
    }
}

export default Connector;