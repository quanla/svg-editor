import classnames from "classnames";
import {RComponent} from "../../common/r-component";

function createDragger({getCurrentPosition, setPosition}) {
    let dispose = null;

    const start = (e) => {
        let startPos = getCurrentPosition();
        let mouseStartPos = {x: e.clientX, y: e.clientY};

        const change = (e) => {
            if (startPos == null) {
                return;
            }
            const newPos = {x: e.clientX, y: e.clientY};

            setPosition({
                x: startPos.x + (newPos.x - mouseStartPos.x),
                y: startPos.y + (newPos.y - mouseStartPos.y),
            });
        };
        const stop = () => {
            dispose && dispose();
            dispose = null;
        };

        window.addEventListener("mousemove", change);
        window.addEventListener("mouseup", stop);

        dispose = () => {
            window.removeEventListener("mousemove", change);
            window.removeEventListener("mouseup", stop);
        };

    };

    return {
        control: {
            onMouseDown: start,
        },
        dispose: () => {
            dispose && dispose();
        },
    };
}

export class FloatBox extends RComponent {
    constructor(props, context) {
        super(props, context);

        this.state = {
            position: {x: 30, y: 30},
            size: {width: 150, height: 150},
        };

        this.dragger = createDragger({
            getCurrentPosition: () => this.state.position,
            setPosition: (position) => this.setState({position}),
        });

        this.onUnmount(this.dragger.dispose);
    }

    render() {
        const {render} = this.props;
        const {position, size} = this.state;

        return (
            <div
                className="float-box"
                style={{
                    top: position.y, left: position.x,
                    width: size.width,
                    height: size.height,
                }}
            >
                <div
                    className="header"
                    {... this.dragger.control}
                >

                </div>
                <div className="content">
                    {render({width: size.width - 4, height: size.width - 4 - 12 })}
                </div>
            </div>
        );
    }
}
