
const drawTool = {
    render: ({map, setMap, toolState, setToolState}) => {

        return {
            main: (
                <svg
                    className="" style={{background: "white"}} width={200} height={200}
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
                    {toolState && toolState.points && toolState.points.map((p, i) => (
                        <circle cx={p.x} cy={p.y} r="2" fill="red" key={i} />
                    ))}
                </svg>
            )
        };
    },
};

exports.drawTool = drawTool;