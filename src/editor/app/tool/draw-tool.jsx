import {Fragment} from "react";
import {zoomed} from "./zoomed";
import {Cols} from "../../common/utils/cols";

function addPoint(index, polygons, point) {
    if (index == null) {
        polygons = [
            ... polygons,
            {points: [point]},
        ];

        return {polygons, index: polygons.length - 1};
    } else {
        let oldPolygon = polygons[index];
        polygons = Cols.replaceIndex(polygons, index, {
            ...oldPolygon,
            points: [
                ... oldPolygon.points,
                point,
            ],
        });
        return {polygons, index};
    }
}

const drawTool = {
    initState: {color: "blue"},
    render: ({state: {map, toolState}, onChange}) => {

        return {
            main: zoomed(map.dimension, ({width, height}) => (
                <svg
                    className="" style={{background: "white"}} width={width} height={height}
                    onClick={(e) => {

                        const offset = e.target.getBoundingClientRect();

                        const point = {
                            x: e.clientX - offset.x,
                            y: e.clientY - offset.y,
                        };

                        const {index, polygons} = addPoint(toolState.index, map.polygons, point);

                        onChange({
                            map: {
                                ...map,
                                polygons,
                            },
                            toolState: {
                                ...toolState,
                                index,
                            },
                        });
                    }}
                >
                    {toolState.index != null && (
                        <Fragment>
                            {map.polygons[toolState.index].points.map((p, i) => (
                                <circle cx={p.x} cy={p.y} r="2" fill="red" key={i} />
                            ))}
                            <polygon points={map.polygons[toolState.index].points.map((p) => `${p.x},${p.y}`).join(" ")} style={{fill:toolState.color,stroke:"purple",strokeWidth:1}} />
                        </Fragment>
                    )}
                </svg>
            )),
            quickProp: (
                <div className="">
                    <a onClick={() => onChange({toolState: {...toolState, color: "red"}})}>Red</a>
                    <a onClick={() => onChange({toolState: {...toolState, color: "blue"}})}>Blue</a>
                </div>
            ),
        };
    },
};

exports.drawTool = drawTool;