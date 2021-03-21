module.exports = class Convention {

    static camelToSnake(string) {
        return string.replace(/([A-Z])/g, "_$1").toLowerCase()
    }

    static toTableFieldName(entityField) {
        return this.camelToSnake(entityField)
    }

    static isScalarType(type) {
        const scalarTypes = [Number, String, Boolean, Date, Object, Array]
        return scalarTypes.includes(type)
    }

}