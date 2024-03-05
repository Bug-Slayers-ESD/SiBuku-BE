const jwt = require('jsonwebtoken')
const { sendUnauthorized } = require('../helpers/response.js')

const authenticate = (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT)
            
            req.user = decoded
            next()
        } else {
            return sendUnauthorized(res)
        }
    } catch {
        return sendUnauthorized(res)
    }
}
