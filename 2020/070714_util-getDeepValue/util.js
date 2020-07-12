function getDeepValue (obj, keyStr) {
    if (obj === undefined || obj === null) {
        return obj;
    }
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