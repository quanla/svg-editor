import {Fragment} from "react";
import {zoomed} from "./zoomed";

const drawTool = {
    initState: {color: "blue"},
    render: ({map, setMap, toolState, setToolState}) => {

        return {
            main: zoomed(map.dimension, ({width, height}) => (
                <svg
                    className="" style={{background: "white"}} width={width} height={height}
                    onClick={(e) => {

                        const offset = e.target.getBoundingClientRect();

                        setToolState({
                            ...toolState,
                            points: [
                                ...toolState && toolState.points || [],
                                {
                                    x: e.clientX - offset.x,
                                    y: e.clientY - offset.y,
                                },
                            ],
                        });
                    }}
                >
                    {toolState && toolState.points && (
                        <Fragment>
                            {toolState.points.map((p, i) => (
                                <circle cx={p.x} cy={p.y} r="2" fill="red" key={i} />
                            ))}
                            <polygon points={toolState.points.map((p) => `${p.x},${p.y}`).join(" ")} style={{fill:toolState.color,stroke:"purple",strokeWidth:1}} />
                        </Fragment>
                    )}
                </svg>
            )),
            quickProp: (
                <div className="">
                    <a onClick={() => setToolState({...toolState, color: "red"})}>Red</a>
                    <a onClick={() => setToolState({...toolState, color: "blue"})}>Blue</a>
                </div>
            ),
        };
    },
};

exports.drawTool = drawTool;