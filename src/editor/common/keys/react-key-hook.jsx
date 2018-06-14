import classnames from "classnames";
import {RComponent} from "../r-component";
import {keys} from "./keys";

export class ReactKeyHook extends RComponent {

    constructor(props, context) {
        super(props, context);

        this.onUnmount(keys.onKeyDown(props.keyCombo, props.action));
    }

    render() {
        return null;
    }
}