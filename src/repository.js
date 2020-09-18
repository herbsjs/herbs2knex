const Convention = require('./convention')
const DataMapper = require('./dataMapper')

const dependency = { convention: Convention }

module.exports = class Repository {

    constructor(options) {
        const di = Object.assign({}, dependency, options.injection)
        this.convention = di.convention
        this.table = options.table
        this.schema = options.schema
        this.tableQualifiedName = this.schema ? `${this.schema}.${this.table}` : `${this.table}`
        this.entity = options.entity
        this.entityIDs = options.ids
        this.dbDriver = options.dbDriver
        this.dataMapper = DataMapper.getFrom(this.entity, this.entityIDs)
    }

    mapFields() {
        const entity = this.entity
        this.dataMapper = DataMapper.getFrom(entity)
    }


    async findByID(ids) {
        const dataMapper = this.dataMapper
        const tableIDs = dataMapper.getTableIDs()
        const tableFields = dataMapper.getTableFields()
        const sql = `SELECT ${tableFields.join(', ')} FROM ${this.tableQualifiedName} WHERE ${tableIDs[0]} = ANY ($1);`
        const parsedValue = Array.isArray(ids) ? ids : [ids]
        const ret = await this.query(sql, [parsedValue])
        const entities = []
        for (const row of ret.rows) {
            if (row === undefined) continue
            this.dataMapper.load(row)
            entities.push(this.entity.fromJSON(this.dataMapper))
        }
        return entities
    }

    async persist(entityInstance) {

        const dataMapper = this.dataMapper
        const tableIDs = dataMapper.getTableIDs()
        const tableFields = dataMapper.getTableFields()
        const values = dataMapper.getValuesFromEntity(entityInstance)
        const placeholders = values.map((e, i) => `$${i + 1}`).join(', ')
        const updateFields = 
            tableFields.filter((f) => !tableIDs.includes(f))
            .map((f) => `${f} = EXCLUDED.${f}`)
        let sql = `INSERT INTO ${this.tableQualifiedName} (${tableFields.join(', ')}) VALUES (${placeholders}) `
        sql += `ON CONFLICT (${tableIDs.join(', ')}) DO `
        sql += `UPDATE SET `
        sql += `${updateFields.join(', ')}`

        const ret = await this.query(sql, values)
        return true
    }

    async query(sql, values) {
        try {
            console.info("[SQL]", sql, " [VALUES]", values.toString())
            return await this.dbDriver.query(sql, values)
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async update(entityInstance) {
        const dataMapper = this.dataMapper
        const tableFields = dataMapper.getTableFields()
        const values = dataMapper.getValuesFromEntity(entityInstance)
        const placeholders = values.map((e, i) => `$${i + 1}`)
        const updateFields = tableFields.map((f, i) => `${f} = ${placeholders[i]}`)
        const sql = `UPDATE ${this.tableQualifiedName} SET ${updateFields.join(', ')} WHERE ${updateFields.join(', ')}`

        const ret = await this.query(sql, values)

        console.log(ret)
        return ret

    }
}