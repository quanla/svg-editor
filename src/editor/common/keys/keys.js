import {KeyCombo} from "./key-combo";
let keydownListeners = [];
let keyupListeners = [];

document.body.addEventListener("keydown", (e)=> {
    for (let i = 0; i < keydownListeners.length; i++) {
        let kl = keydownListeners[i];
        if (kl(e)) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
    }
});

document.body.addEventListener("keyup", (e)=> {
    for (let i = 0; i < keyupListeners.length; i++) {
        let kl = keyupListeners[i];
        if (kl(e)) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
    }
});


function onKeyDown(keyCombo, listener) {
    return addKeyListener(keyCombo, listener, keydownListeners);
}
function onKeyUp(keyCombo, listener) {
    return addKeyListener(keyCombo, listener, keyupListeners);
}

function addKeyListener(keyCombo, listener, listeners) {
    let wrap = (e)=> {
        if (keyCombo.test(e)) {
            listener();
            return true;
        }
        return false;
    };
    listeners.splice(0,0, wrap );

    return ()=> {
        listeners.splice(listeners.indexOf(wrap), 1);
    };
}
function addKeysListener(keyCombos, listener, listeners) {

    let removes = keyCombos.map((keyCombo) => addKeyListener(keyCombo, listener, listeners));

    return ()=> {
        removes.forEach((r) => r());
    };
}

export const keys = {
    onEsc : (listener)=> {
        return onKeyDown(KeyCombo.compileCombo("ESC"), listener);
    },
    onEnter : (listener)=> {
        return onKeyDown(KeyCombo.compileCombo("ENTER"), listener);
    },
    onDelete : (listener)=> {
        return addKeysListener(["DELETE", "BACKSPACE"].map((keyPtn) => KeyCombo.compileCombo(keyPtn)), listener, keydownListeners);
    },
    on: (keyPattern, listener) => {
        return onKeyDown(KeyCombo.compileCombo(keyPattern), listener);
    },
    onKeyDown,
    onHold: (keyPtn, listener) => {
        let keyCombo = KeyCombo.compileCombo(keyPtn);
        let removeKeyDown = onKeyDown(keyCombo, () => listener(true));
        let removeKeyUp   = onKeyUp(  keyCombo, () => listener(false));

        return () => {
            removeKeyDown();
            removeKeyUp();
        };
    },
};