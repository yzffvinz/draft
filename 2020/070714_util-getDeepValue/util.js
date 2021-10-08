function getDeepValue (obj, keyStr) {
    if (obj === undefined || obj === null) {
        return obj;
    }
    if (keyStr === undefined || keyStr === null) {
        return obj;
    }
    keyStr = String(keyStr);
    const keys = keyStr.split('.');
    let value = obj;
    for (let i = 0; i < keys.length; i++) {
        if (keys[i]) {
            value = value[keys[i]];
            if (value === undefined || value === null) {
                break;
            }
        }
    }
    return value;
}