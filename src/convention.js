module.exports = class Convention {
  camelToSnake (string) {
    return string.replace(/([A-Z])/g, '_$1').toLowerCase()
  }

  toTableFieldName (entityField) {
    return this.camelToSnake(entityField)
  }

  isScalarType (type) {
    const scalarTypes = [Number, String, Boolean, Date, Object, Array]
    return scalarTypes.includes(type)
  }
}
