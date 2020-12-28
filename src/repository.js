const Convention = require("./convention")
const DataMapper = require("./dataMapper")
const Knex = require("knex")

const dependency = { convention: Convention, knex: Knex }

module.exports = class Repository {
  constructor(options) {
    const di = Object.assign({}, dependency, options.injection)
    this.convention = di.convention
    this.table = options.table
    this.schema = options.schema
    this.tableQualifiedName = this.schema
      ? `${this.schema}.${this.table}`
      : `${this.table}`
    this.entity = options.entity
    this.entityIDs = options.ids
    this.run = di.knex(options.dbConfig)
    this.runner = di.knex(options.dbConfig)(this.tableQualifiedName)
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

    const parsedValue = Array.isArray(ids) ? ids : [ids]
    const ret = await this.runner
      .select(tableFields)
      .whereIn(tableIDs[0], parsedValue)

    const entities = []

    for (const row of ret) {
      if (row === undefined) continue
      this.dataMapper.load(row)
      entities.push(this.entity.fromJSON(this.dataMapper))
    }

    return entities
  }

  async findBy(search) {
    const dataMapper = this.dataMapper
    const tableFields = dataMapper.getTableFields()

    const searchTermTableField = dataMapper.toTableField(
      Object.keys(search)[0]
    )
    const searchTerm = Object.keys(search)[0]
    if (!searchTerm || searchTerm === "0") throw "search term is invalid"

    const searchValue = Array.isArray(search[searchTerm])
      ? search[searchTerm]
      : [search[searchTerm]]

    if (
      !search[searchTerm] ||
      (typeof search[searchTerm] === "object" &&
        !Array.isArray(search[searchTerm])) ||
      (Array.isArray(search[searchTerm]) && !search[searchTerm].length)
    )
      throw "search value is invalid"

    const ret = await this.runner
      .select(tableFields)
      .whereIn(searchTermTableField, searchValue)

    const entities = []

    for (const row of ret) {
      if (row === undefined) continue
      this.dataMapper.load(row)
      entities.push(this.entity.fromJSON(this.dataMapper))
    }

    return entities
  }

  async insert(entityInstance) {
    const dataMapper = this.dataMapper
    const tableFields = dataMapper.getTableFieldsWithValue(entityInstance)
    await this.runner.insert(tableFields)
    return true
  }

  async persist(entityInstance) {
    const updated = await this.update(entityInstance)
    if (updated) return true

    await this.insert(entityInstance)
    return true
  }

  async update(entityInstance) {
    const dataMapper = this.dataMapper
    const tableIDs = dataMapper.getTableIDs()
    const tableFields = dataMapper.getTableFieldsWithValue(entityInstance)

    const ret = await this.runner
      .where(tableIDs[0], entityInstance[tableIDs[0]])
      .update(tableFields)
    return ret === 1
  }

  async delete(entityInstance) {
    const dataMapper = this.dataMapper
    const tableIDs = dataMapper.getTableIDs()

    const ret = await this.runner
      .where(tableIDs[0], entityInstance[tableIDs[0]])
      .delete()
    return ret === 1
  }

  async query(sql, values) {
    try {
      console.info("[SQL]", sql, " [VALUES]", values.toString())
      const runner = this.run
      return await runner.raw(sql, values)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async where(params, options) {
    const dataMapper = this.dataMapper

    const preparedParams = Object.keys(params)
      .map((param) => ({ [dataMapper.toTableField(param)]: params[param] }))
      .reduce((x, y) => ({ ...x, ...y }))

    let ret
    if (options?.first) ret = new Array(await this.runner.where(preparedParams).first())
    else ret = await this.runner.where(preparedParams)

    const entities = []

    for (const row of ret) {
      if (row === undefined) continue
      this.dataMapper.load(row)
      entities.push(this.entity.fromJSON(this.dataMapper))
    }

    return entities
  }
}
