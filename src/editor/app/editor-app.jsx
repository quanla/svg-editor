import classnames from "classnames";
import {RComponent} from "../common/r-component";
import {drawTool} from "./tool/draw-tool";
import {History} from "./history";
import {O} from "../common/utils/object-util";
import {FloatBox} from "./float-box/float-box";
import {DockedBox} from "./docked-box/docked-box";
import {ReactKeyHook} from "../common/keys/react-key-hook";
import {KeyCombo} from "../common/keys/key-combo";


export class EditorApp extends RComponent {


    constructor(props, context) {
        super(props, context);

        this.state = {
            tool: drawTool,
        };

        this.history = History.createHistory({
            toolState: drawTool.initState,
            zoomState: null,
            map: {dimension: {width: 200, height: 200}, polygons: []},
        });
    }


    render() {
        const {style} = this.props;
        const {tool} = this.state;

        const {main, quickProp} = tool.render({
            state: this.history.getState(),
            onChange: (newState) => {
                this.history.push(newState);
                this.forceUpdate();
            },
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

                <ReactKeyHook
                    keyCombo={KeyCombo.compileCombo("cmd+Z")}
                    action={() => {
                        this.history.back();
                        this.forceUpdate();
                    }}
                />
            </div>
        );
    }
}
