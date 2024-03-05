const sendResponse = (res, statusCode, message, data = null) => res.status(statusCode).json({
    statusCode,
    message,
    data,
});

const sendError = (res, message, status = 500) => res.status(status).json({
    status,
    message,
});

const sendSuccess = (res, message, data = null) => sendResponse(res, 200, message, data);
const sendCreated = (res, message, data = null) => sendResponse(res, 201, message, data);
const sendBadRequest = (res, message = 'Bad Request') => sendError(res, message, 400);
const sendUnauthorized = (res, message = 'Unauthorized') => sendError(res, message, 401)
const sendNotFound = (res, message = 'Not Found') => sendError(res, message, 404);

module.exports = {
    sendResponse,
    sendError,
    sendSuccess,
    sendCreated,
    sendBadRequest,
    sendUnauthorized,
    sendNotFound,
};