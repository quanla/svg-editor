const History = {
    createHistory(initState) {
        let history = [{state: initState}];
        let index = 0;

        const getState = () => history[index].state;
        return {
            getState,
            push: (update) => {
                if (index < history.length - 1) {
                    history.splice(index + 1);
                }
                history.push({
                    state: {
                        ...getState(),
                        ...update,
                    },
                });
                index++;
            },
            back: () => {
                if (index == 0) {
                    return;
                }
                index--;
            },
        };
    }
};

exports.History = History;