module.exports = class Convention {

    static camelToSnake(string) {
        return string.replace(/([A-Z])/g, "_$1").toLowerCase();
    }

    static entityToTableField(name) {
        return this.camelToSnake(name)
    }

    static isScalarType(type) {
        const scalarTypes = [Number, String, Boolean, Date, Object, Array]
        return scalarTypes.includes(type)
    }

}