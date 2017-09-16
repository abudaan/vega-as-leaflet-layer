const getPadding = (view) => {
    const padding = view.padding();
    // check if the spec has defined a valid padding object
    if (
        typeof padding.top === 'undefined' &&
        typeof padding.bottom === 'undefined' &&
        typeof padding.right === 'undefined' &&
        typeof padding.left === 'undefined'
    ) {
        return null;
    }
    // fill empty slots with 0
    const {
        top = 0,
        bottom = 0,
        right = 0,
        left = 0,
    } = padding;
    // this is the padding
    const result = {
        top,
        bottom,
        right,
        left,
    };
    return result;
};

export default getPadding;
