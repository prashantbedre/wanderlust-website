module.exports = function (fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);  // This will pass the error to the next middleware (error handling)
    };
};
