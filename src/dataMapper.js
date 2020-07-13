const Convention = require('./convention')

const dependency = { convention: Convention }

module.exports = class DataMapper {

    static getFrom(entity, entityIDs, options = {}) {
        const di = Object.assign({}, dependency, options.injection)
        const convention = di.convention

        function getDataParser(type) {
            const originalType = type
            let parser = originalType
            // if (Array.isArray(originalType))
            //     parser = (v) =>
            //         v.map((_) => getDataParser(originalType[0])(_))
            if ((originalType === Date) || (!convention.isScalarType(originalType)))
                parser = (v) =>
                    v
            return parser
        }

        const schema = entity.prototype.meta.schema
        const entityFields = Object.keys(schema)
        const entity2table = {
            load(data) { this.tableData = data },
            // toEntityField: (tableFieldName) => convention.toEntityField(tableFieldName),
            toTableField: (entityFieldName) => convention.toTableField(entityFieldName),
            getTableIDs: () => entityIDs.map(i => convention.toTableField(i)),
            getEntityFields: () => entityFields,
            getTableFields: () => entityFields.map(e => convention.toTableField(e)),
            getValuesFromEntity: (instance) => entityFields.map(e => instance[e])
        }

        for (const entityField of entityFields) {
            const parseData = getDataParser(schema[entityField].type)
            const tableField = convention.toTableField(entityField)
            Object.defineProperty(entity2table, entityField, {
                get: function () {
                    return parseData(this.tableData[tableField])
                }
            })
        }
        return entity2table
    }
}