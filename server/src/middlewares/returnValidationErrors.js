const validator = require('../validator')

module.exports = (req, res, next) => {
    let errors = validator.getValidationErrors(req, res);
    if (!errors.isEmpty()) {
        res.status(400).json({messageBag: errors.array()});
    } else {
        next()
    }
}
