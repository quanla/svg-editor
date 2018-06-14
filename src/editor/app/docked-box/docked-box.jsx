import classnames from "classnames";
import {RComponent} from "../../common/r-component";

export class DockedBox extends RComponent {

    constructor(props, context) {
        super(props, context);

        this.state = {
            dimension: null,
        };

        this.onMount(() => {
            const dom = ReactDOM.findDOMNode(this);
            const {width, height} = dom.getBoundingClientRect();

            return this.setState({dimension: {width, height}});
        });
    }

    render() {
        const {dimension} = this.state;
        const {render} = this.props;

        return (
            <div className="docked-box">
                {dimension && (
                    render(dimension)
                )}
            </div>
        );
    }
}
