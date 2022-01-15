const Convention = require('./convention')
const { entity } = require('@herbsjs/gotu')

class DataMapper {
    constructor(entity, entityIDs = [], foreignKeys = [], options = {}) {
        this.convention = Object.assign(new Convention(), options.convention)
        this.entity = entity
        const schema = entity.prototype.meta.schema
        this.allFields = DataMapper.buildAllFields(schema, entityIDs, foreignKeys, this.convention)
        this._proxy === undefined
    }

    toEntity(payload) {
        if (this._proxy === undefined) this._proxy = this.buildProxy()
        this._proxy.load(payload)
        return this.entity.fromJSON(this._proxy, { allowExtraKeys: true })
    }

    static buildAllFields(schema, entityIDs, foreignKeys, convention) {

        function fieldType(type) {
            if (Array.isArray(type)) return fieldType(type[0])
            return type
        }

        const fields = Object.keys(schema)
            .map((field) => {
                if (typeof schema[field] === 'function') return { type: Function }
                const isArray = Array.isArray(schema[field].type)
                const type = fieldType(schema[field].type)
                const isEntity = entity.isEntity(type)
                const nameDb = convention.toTableFieldName(field)
                const isID = entityIDs.includes(field)
                return { name: field, type, isEntity, nameDb, isArray, isID }
            })

        const fkFields = foreignKeys.flatMap((fks) => {
            return Object.keys(fks).map((field) => {
                const isArray = Array.isArray(fks[field])
                const type = fieldType(fks[field])
                const isEntity = entity.isEntity(type)
                const nameDb = convention.toTableFieldName(field)
                return { name: field, type, isEntity, nameDb, isArray, isFk: true }
            })
        })

        const allFields = fields.concat(fkFields).filter((f) => f.type !== Function)

        return allFields
    }

    toTableFieldName(entityFieldName) {
        return this.convention.toTableFieldName(entityFieldName)
    }

    tableIDs() {
        return this.allFields.filter((i) => i.isID).map(i => this.convention.toTableFieldName(i.name))
    }

    tableFields() {
        return this.allFields
            .filter((i) => !i.isEntity)
            .map((i) => i.nameDb)
    }

    tableFieldsWithValue(instance) {
        return this.allFields
            .filter((i) => !i.isEntity)
            .map(i => ({ [i.nameDb]: instance[i.name] }))
            .reduce((x, y) => ({ ...x, ...y }))
    }

    buildProxy() {

        function getDataParser(type, isArray) {
            function arrayDataParser(value, parser) {
                if (value === null) return null
                return value.map((i) => parser(i))
            }

            function dataParser(value, parser) {
                if (value === null) return null
                return parser(value)
            }

            if (isArray) {
                const parser = getDataParser(type, false)
                return (value) => arrayDataParser(value, parser)
            }

            if ((type === Date) || (!convention.isScalarType(type)))
                return (x) => x

            return (value) => dataParser(value, type)
        }

        const convention = this.convention
        const proxy = {}

        Object.defineProperty(proxy, '_payload', {
            enumerable: false,
            writable: true,
            value: null
        })

        Object.defineProperty(proxy, 'load', {
            enumerable: false,
            value: function load(payload) { this._payload = payload },
        })

        for (const field of this.allFields) {
            const parser = getDataParser(field.type, field.isArray)
            const nameDb = field.nameDb
            Object.defineProperty(proxy, field.name, {
                enumerable: true,
                get: function () {
                    if (field.isEntity) return undefined
                    return parser(this._payload[nameDb])
                }
            })
        }
        return proxy
    }
}

module.exports = DataMapper