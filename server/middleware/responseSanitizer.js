export const sanitizeResponse = (req, res, next) => {
    const originalSend = res.send;
    res.send = function (body) {
        if (typeof body === 'object' && body !== null) {
            // Remove sensitive fields from any response
            const { password, __v, _id, user, ...sanitized } = body;
            if (_id) sanitized.id = _id;
            return originalSend.call(this, sanitized);
        }
        return originalSend.call(this, body);
    };
    next();
};
