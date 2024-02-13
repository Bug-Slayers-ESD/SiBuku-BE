export const sendResponse = (res, statusCode, message, data = null) => res.status(statusCode).json({
    statusCode,
    message,
    data,
})

export const sendError = (res, message, status = 500) => res.status(status).json({
    status,
    message,
})

export const sendSuccess = (res, message, data = null) => sendResponse(res, 200, message, data)
export const sendCreated = (res, message, data = null) => sendResponse(res, 201, message, data)
export const sendBadRequest = (res, message = 'Bad Request') => sendError(res, message, 400)
export const sendNotFound = (res, message = 'Not Found') => sendError(res, message, 404)