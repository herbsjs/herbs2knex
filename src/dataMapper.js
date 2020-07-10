const Convention = require('./convention')

const dependency = { convention: Convention }

module.exports = class DataMapper {

    static getFrom(entity, options = {}) {
        const di = Object.assign({}, dependency, options.injection)
        const convetion = di.convention

        function getDataParser(type) {
            const originalType = type
            let parser = originalType
            // if (Array.isArray(originalType))
            //     parser = (v) =>
            //         v.map((_) => getDataParser(originalType[0])(_))
            if ((originalType === Date) || (!convetion.isScalarType(originalType)))
                parser = (v) =>
                    v
            return parser
        }

        const mapper2entity = {
            load(data) { this.tableData = data },
        }

        const schema = entity.prototype.meta.schema
        const fields = Object.keys(schema)
        for (const entityName of fields) {
            const parseData = getDataParser(schema[entityName].type)
            const tableName = convetion.entityToTableField(entityName)
            Object.defineProperty(mapper2entity, entityName, {
                get: function () {
                    return parseData(this.tableData[tableName])
                }
            })
        }
        return mapper2entity
    }
}