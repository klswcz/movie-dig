const {validationResult} = require('express-validator')

exports.getValidationErrors = (req, res) => {
    return validationResult(req);
}
