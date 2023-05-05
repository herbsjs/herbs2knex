module.exports = class Convention {
  camelToSnake(string) {
    return string
      .replace(/^[A-Z]/, (match) => match.toLowerCase()) // Lowercase the first letter
      .replace(/([a-z])([A-Z]+)/g, (match, p1, p2) => p1 + '_' + p2) // Add underscore between lowercase and uppercase letters
      .toLowerCase() // Convert the entire string to lowercase
  }

  toTableFieldName(entityField) {
    return this.camelToSnake(entityField)
  }

  isScalarType(type) {
    const scalarTypes = [Number, String, Boolean, Date, Object, Array]
    return scalarTypes.includes(type)
  }
}
