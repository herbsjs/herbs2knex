const Convention = require('./convention')
const { entity } = require('gotu')
const dependency = { convention: Convention }

module.exports = class DataMapper {

    static getProxyFrom(entityInstance, entityIDs = [], foreignKeys = [], options = {}) {
        const di = Object.assign({}, dependency, options.injection)
        const convention = di.convention

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

        function fieldType(type) {
            if (Array.isArray(type)) return fieldType(type[0])
            return type
        }

        const schema = entityInstance.prototype.meta.schema

        const fields = Object.keys(schema)
            .map((field) => {
                const isArray = Array.isArray(schema[field].type)
                const type = fieldType(schema[field].type)
                const isEntity = entity.isEntity(type)
                const nameDb = convention.toTableField(field)
                const isID = entityIDs.includes(field)
                return { name: field, type, isEntity, nameDb, isArray, isID }
            })

        const fkFields = foreignKeys.flatMap((fks) => {
            return Object.keys(fks).map((field) => {
                const isArray = Array.isArray(fks[field])
                const type = fieldType(fks[field])
                const isEntity = entity.isEntity(type)
                const nameDb = convention.toTableField(field)
                return { name: field, type, isEntity, nameDb, isArray, isFk: true }
            })
        })

        const allFields = fields.concat(fkFields)

        const proxy = {}

        Object.defineProperty(proxy, '_mapper', {
            enumerable: false,
            value: {
                load(payload) { this.payload = payload },

                toTableField: (entityFieldName) =>
                    convention.toTableField(entityFieldName),

                getTableIDs: () =>
                    allFields.filter((i) => i.isID).map(i => convention.toTableField(i.name)),

                getTableFields: () =>
                    allFields
                        .filter((i) => !i.isEntity)
                        .map((i) => i.nameDb),

                getTableFieldsWithValue:
                    (instance) =>
                        allFields
                            .filter((i) => !i.isEntity)
                            .map(i => ({ [i.nameDb]: instance[i.name] }))
                            .reduce((x, y) => ({ ...x, ...y })),

            }
        })

        for (const field of allFields) {
            const parser = getDataParser(field.type, field.isArray)
            const nameDb = field.nameDb
            Object.defineProperty(proxy, field.name, {
                enumerable: true,
                get: function () {
                    if (field.isEntity) return undefined
                    return parser(this._mapper.payload[nameDb])
                }
            })
        }
        return proxy
    }
}