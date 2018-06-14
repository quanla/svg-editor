var Env = require("../env.js").Env;
const keyCodeMap = {
    "ESC": 27,
    "ENTER": 13,
    "DELETE": 46,
    "BACKSPACE": 8,
    "ALT": 18,
    "F7": 118,
    "F8": 119,
    "F9": 120,
    "F10": 121,
    "F11": 122,
};

function createCombo(keyCode, modifiers) {
    if (keyCode == 18) {
        modifiers.altKey = null;
    }
    return {
        test(e) {
            if (e.target.tagName == "INPUT") {
                return false;
            }
            return (
                e.ctrlKey == modifiers.ctrlKey &&
                e.shiftKey == modifiers.shiftKey &&
                e.metaKey == modifiers.metaKey &&
                (modifiers.altKey == null || e.altKey == modifiers.altKey) &&
                e.keyCode == keyCode
            );
        },
        toString() {
            let modString = "";
            if (modifiers.metaKey) {
                modString += "⌘ + ";
            }
            if (modifiers.shiftKey) {
                modString += "⇧ + ";
            }
            if (modifiers.altKey) {
                modString += "⎇ + ";
            }
            if (modifiers.ctrlKey) {
                modString += "Ctrl + ";
            }
            return modString + String.fromCharCode(keyCode);
        },
    };
}

function toKeyCode1(keyPtn) {
    let alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(keyPtn);
    if (alpha > -1) {
        return alpha + 65;
    }
    let numeric = "0123456789".indexOf(keyPtn);
    if (numeric > -1) {
        return numeric + 48;
    }

    return keyPtn.charCodeAt(0);
}

function compileCombo(keyPtn, aggregatedMods) {
    if (aggregatedMods == null) {
        aggregatedMods = {
            altKey: false,
            shiftKey: false,
            ctrlKey: false,
            metaKey: false,
        };
    }

    let plusPos = keyPtn.indexOf("+");
    if (plusPos == -1) {
        let keyCode = keyCodeMap[keyPtn];
        if (keyCode) {
            return createCombo(keyCode, aggregatedMods);
        }
        if (keyPtn.length == 1) {
            return createCombo(toKeyCode1(keyPtn), aggregatedMods);
        }
    } else {
        let modStr = keyPtn.substring(0, plusPos).trim().toLowerCase();
        let cloneMods = Object.assign({}, aggregatedMods);
        if (modStr == "alt") {
            cloneMods.altKey = true;
        } else if (modStr == "shift") {
            cloneMods.shiftKey = true;
        } else if (modStr == "ctrl") {
            cloneMods.ctrlKey = true;
        } else if (modStr == "cmd") {

            if (Env.isMac()) {
                cloneMods.metaKey = true;
            } else {
                cloneMods.ctrlKey = true;
            }
        }
        return compileCombo(keyPtn.substring(plusPos + 1).trim(), cloneMods);
    }
}

const KeyCombo = {
    compileCombo,
};

exports.KeyCombo = KeyCombo;