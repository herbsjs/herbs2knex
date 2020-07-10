const Convention = require('./convention')
const DataMapper = require('./dataMapper')

const dependency = { convention: Convention }

module.exports = class Repository {

    constructor(options) {
        const di = Object.assign({}, dependency, options.injection)
        this.convention = di.convention
        this.table = options.table
        this.schema = options.schema
        this.entity = options.entity
        this.entityIDs = options.ids
        this.dbDriver = options.dbDriver
        this.mapFields()
    }

    mapFields() {
        const entity = this.entity
        this.tableIDs = this.entityIDs.map(id => this.convention.entityToTableField(id))

        this.tableFields = Object.keys(entity.prototype.meta.schema)
        // TODO: only scalar types allowed
        //this.tableFields = this.tableFields.filter((f) => isScalarType(entity.prototype.meta.schema[f].type))

        // TODO: exclude fields
        // this.sqlExcludedFields = options.exclude
        // this.tableFields = this.tableFields.filter((f) => !this.sqlExcludedFields.includes(f))

        this.tableFields = this.tableFields.map(field => this.convention.entityToTableField(field))
        this.dataMapper = DataMapper.getFrom(entity)
    }


    async getByIDs(ids) {
        const tableName = this.schema ? `${this.schema}.${this.table}` : `${this.table}`
        const sql = `SELECT ${this.tableFields.join(', ')} FROM ${tableName} WHERE ${this.tableIDs[0]} = ANY ($1)`
        const ret = await this.query(sql, ids)
        const entities = []
        for (const row of ret.rows) {
            if (row === undefined) continue
            this.dataMapper.load(row)
            entities.push(this.entity.fromJSON(this.dataMapper))
        }
        return entities
    }

    async query(sql, values) {
        try {
            // const parsedValue = Array.isArray(value) ? parsedValue
            return await this.dbDriver.query(sql, [values])
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}