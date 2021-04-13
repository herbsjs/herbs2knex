const { validate } = require('suma')

const isEmpty = (object) => {    
    const validations = { presence: true }
    const result = validate(object, validations)
    return result.errors.length > 0
}

module.exports = { isEmpty }