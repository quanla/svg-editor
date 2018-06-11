export class RComponent extends React.Component {
    onUnmounts = [];
    onChanges = [];
    onMounts = [];
    mounted = false;

    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        this.mounted = true;
        this.onMounts.forEach((l)=> l());
    }

    componentWillUnmount() {
        this.mounted = false;
        this.onUnmounts.forEach((l)=> l());
    }

    componentWillReceiveProps(nextProps) {
        this.onChanges.forEach((l)=> l(nextProps));
    }

    setState(newState, cb) {
        if (this.mounted) {
            super.setState(newState, cb);
        } else {
            this.state = Object.assign(this.state, newState);
            cb();
        }
    }

    forceUpdate() {
        if (this.mounted) {
            super.forceUpdate();
        }
    }

    onMount(f) {
        this.onMounts.push(f);
    }
    onUnmount(f) {
        this.onUnmounts.push(f);
    }
    onChange(f) {
        this.onChanges.push(f);
    }

}