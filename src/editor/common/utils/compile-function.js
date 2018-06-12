const compileFunction = (str, stack) => {
    return new Function(...Object.keys(stack), `return ${str}`)(...Object.values(stack));
};

exports.compileFunction = compileFunction;