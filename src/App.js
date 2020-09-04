import React from 'react';
import Stage from './Stage';
import Connector from './Connector';


// const data = [
//     {type: "entity",   id: "1",  x: "300", y: "50"},
//     {type: "activity", id: "2a", x: "50",  y: "200"},
//     {type: "entity",   id: "2b", x: "550", y: "200"},
//     {type: "entity",   id: "3a", x: "550", y: "350"},
//     {type: "entity",   id: "4a", x: "300", y: "500"},
//     {type: "entity",   id: "4b", x: "800", y: "500"}
// ];

const data = [
    {
        type: "entity",
        id: "1", x: 375, y: 100,
        children: [
            {
                type: "activity",
                id: "2a", x: 125, y: 250,
                children: []
            },
            {
                type: "entity",
                id: "2b", x: 625, y: 250,
                children: [
                    {
                        type: "entity",
                        id: "3a", x: 625, y: 400,
                        children: [
                            {type: "entity",   id: "4a", x: 375, y: 550, children: []},
                            {type: "entity",   id: "4b", x: 875, y: 550, children: []}
                        ]
                    },
                ]
            }
        ]
    }
];

function App() {

    const size = {
        height: 100,
        width: 150
    };

    function renderStage(item, parent) {
        return (
            <div>
                <Stage type={item.type} id={item.id} x={item.x} y={item.y} size={size}/>
                <Connector from={parent} to={item} size={size}/>
                {item.children.map((childItem, index) => {
                    return renderStage(childItem, item)
                })}
            </div>
        )
    };

    return (
        <div className="App">
            {data.map((item, index) => {
                return renderStage(item, null)  // top-level stages have 'parent' set to null
            })}
        </div>
    );
}

export default App;
