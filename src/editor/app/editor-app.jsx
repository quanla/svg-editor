import classnames from "classnames";
import {RComponent} from "../common/r-component";
import {drawTool} from "./tool/draw-tool";
import {History} from "./history";
import {O} from "../common/utils/object-util";
import {FloatBox} from "./float-box/float-box";
import {DockedBox} from "./docked-box/docked-box";


export class EditorApp extends RComponent {


    constructor(props, context) {
        super(props, context);

        this.state = {
            tool: drawTool,
            toolState: drawTool.initState,
            zoomState: null,
            map: {dimension: {width: 200, height: 200}, polygons: []},
        };

        this.history = History.createHistory({
            getState: () => O.getKeys(this.state, [""])
        });
    }


    render() {
        const {style} = this.props;
        const {tool, toolState, zoomState, map} = this.state;

        const {main, quickProp} = tool.render({
            toolState,
            setToolState: (toolState) => this.setState({toolState}),
            zoomState,
            setZoomState: (zoomState) => this.setState({zoomState}),
            map,
            setMap: (map) => this.setState({map}),
        });

        return (
            <div className="editor-app" style={style}>
                <div className="quick-prop-bar">
                    {quickProp}
                </div>

                <DockedBox
                    render={(dimension) => main(dimension)}
                />

                {/*<FloatBox*/}
                    {/*render={(dimension) => main(dimension)}*/}
                {/*/>*/}
            </div>
        );
    }
}
