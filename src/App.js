import React from 'react';
import Stage from './Stage';
import HLine from './HLine';
import VLine from './VLine';


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
        id: "1", x: "300", y: "50",
        children: [
            {
                type: "activity",
                id: "2a", x: "50", y: "200",
                children: []
            },
            {
                type: "entity",
                id: "2b", x: "550", y: "200",
                children: [
                    {
                        type: "entity",
                        id: "3a", x: "550", y: "350",
                        children: [
                            {type: "entity",   id: "4a", x: "300", y: "500", children: []},
                            {type: "entity",   id: "4b", x: "800", y: "500", children: []}
                        ]
                    },
                ]
            }
        ]
    }
];

function App() {

    function renderStage(item) {
        return (
            <div>
                <Stage type={item.type} id={item.id} x={item.x} y={item.y} />
                {item.children.map((childItem, index) => {
                    return renderStage(childItem)
                })}
            </div>
        )
    };

    return (
        <div className="App">

            {data.map((item, index) => {
                return renderStage(item)
            })}
            <VLine x="375px" y0="150" y1="175" />
            <HLine x0="125" x1="625" y="175px" />
        </div>
    );
}

export default App;
