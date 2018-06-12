
function timeout(duration = 0) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, Math.max(duration, 0));
    });
}

async function timeoutLight(duration = 0, isStopped) {
    let endTime = Date.now() + duration;

    for (;endTime > Date.now() + 1 && !isStopped();) {
        await timeout(Math.min(endTime - Date.now(), 200));
    }

}

const retrieveWait = async (fn, check, duration = 6000) => {
    let endTime = Date.now() + duration;
    for (; endTime > Date.now() + 1; ) {
        let ret = await fn();
        if (check(ret)) {
            return ret;
        } else {
            await timeout(500);
        }
    }
};

const wait = async (check, duration = 10000) => {
    if (check == null) {
        throw "check is undefined";
    }
    let endTime = Date.now() + duration;
    for (; endTime > Date.now() + 1; ) {
        let ret = await check();
        if (ret) {
            return true;
        } else {
            await timeout(500);
        }
    }
    return false;
};

function defer() {
    let resolve = null;
    let reject = null;
    let promise = new Promise((resolve1, reject1) => {
        resolve = resolve1;
        reject = reject1;
    });

    return {
        resolve,
        reject,
        promise,
    };
}

function sequential(fns) {
    return async (...args) => {
        for (let i = 0; i < fns.length; i++) {
            let f = fns[i];
            await f(...args);
        }
    };
}

exports.AsyncUtil = {
    sequential,
    timeout,
    retrieveWait,
    wait,
    defer,
    timeoutLight,
};