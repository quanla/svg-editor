function findPathRecursive(name, base, getChildMap) {
    let childMap = getChildMap(base);
    if (childMap == null) {
        return null;
    }
    if (childMap.hasOwnProperty(name)) {
        return [name];
    }

    for (let token in childMap) {
        let foundPath = findPathRecursive(name, childMap[token], getChildMap);
        if (foundPath) {
            return [token].concat(foundPath);
        }
    }
}

const MapHierDataResolver = {
    creteMapHierDataResolver(getChildMap) {
        return {
            resolve(path, base) {
                for (let i = 0; i < path.length; i++) {
                    let pathToken = path[i];

                    let childMap = getChildMap(base);
                    base = childMap[pathToken];
                    if (base == null) {
                        return null;
                    }
                }
                return base;
            },
            findPathRecursive: (name, base) => findPathRecursive(name, base, getChildMap),
        };
    }
};

exports.MapHierDataResolver = MapHierDataResolver;