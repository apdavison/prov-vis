import React from 'react';

function VLine(props) {
    let styleObj = {
        top: props.y0 + "px",
        left: props.x + "px",
        width: "2px",
        height: (props.y1 - props.y0) + "px",
        backgroundColor: "gray",
        position: "absolute",
        zIndex: -1
    };
    //console.log("vline: top=" + styleObj.top + " left=" + styleObj.left);
    return (
        <div style={styleObj} />
    )
}

export default VLine;