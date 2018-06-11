import classnames from "classnames";
import {RComponent} from "../common/r-component";
import {drawTool} from "./tool/draw-tool";
import {History} from "./history";


export class EditorApp extends RComponent {


    constructor(props, context) {
        super(props, context);

        this.state = {
            tool: drawTool,
            toolState: null,
            zoomState: null,
            map: {boundaries: []},
        };

        this.history = History.createHistory();
    }


    render() {
        const {style} = this.props;
        const {tool, toolState, zoomState, map} = this.state;

        const {main} = tool.render({
            toolState,
            setToolState: (toolState) => this.setState({toolState}),
            zoomState,
            setZoomState: (zoomState) => this.setState({zoomState}),
            map,
            setMap: (map) => this.setState({map}),
        });

        return (
            <div className="editor-app" style={style}>
                {main}
            </div>
        );
    }
}
