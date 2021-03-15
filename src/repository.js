const Convention = require("./convention")
const DataMapper = require("./dataMapper")

const dependency = { convention: Convention }

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
    this.foreignKeys = options.foreignKeys
    this.knex = options.knex
    this.runner = this.knex(this.tableQualifiedName)
    this.proxy = DataMapper.getProxyFrom(this.entity, this.entityIDs, this.foreignKeys)
  }

  mapFields() {
    const entity = this.entity
    this.proxy = DataMapper.getProxyFrom(entity)
  }

  async findByID(ids) {
    const proxy = this.proxy
    const tableIDs = proxy._mapper.getTableIDs()
    const tableFields = proxy._mapper.getTableFields()

    const parsedValue = Array.isArray(ids) ? ids : [ids]
    const ret = await this.runner
      .select(tableFields)
      .whereIn(tableIDs[0], parsedValue)

    const entities = []

    for (const row of ret) {
      if (row === undefined) continue
      this.proxy._mapper.load(row)
      entities.push(
        this.entity.fromJSON(this.proxy, { allowExtraKeys: true })
      )
    }

    return entities
  }

  async findBy(search) {
    const proxy = this.proxy
    const tableFields = proxy._mapper.getTableFields()

    const searchTermTableField = proxy._mapper.toTableField(
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
      this.proxy._mapper.load(row)
      entities.push(
        this.entity.fromJSON(this.proxy)
      )
    }

    return entities
  }

  async insert(entityInstance) {
    const proxy = this.proxy
    const fields = proxy._mapper.getTableFields(entityInstance)
    const payload = proxy._mapper.getTableFieldsWithValue(entityInstance)
    const ret = await this.runner
      .returning(fields)
      .insert(payload)
    this.proxy._mapper.load(ret[0])
    return this.entity.fromJSON(this.proxy)
  }

  async update(entityInstance) {
    const proxy = this.proxy
    const tableIDs = proxy._mapper.getTableIDs()
    const fields = proxy._mapper.getTableFields(entityInstance)
    const payload = proxy._mapper.getTableFieldsWithValue(entityInstance)

    const ret = await this.runner
      .where(tableIDs[0], entityInstance[tableIDs[0]])
      .returning(fields)
      .update(payload)
    this.proxy._mapper.load(ret[0])
    return this.entity.fromJSON(this.proxy)
  }

  async delete(entityInstance) {
    const proxy = this.proxy
    const tableIDs = proxy._mapper.getTableIDs()

    const ret = await this.runner
      .where(tableIDs[0], entityInstance[tableIDs[0]])
      .delete()
    return ret === 1
  }
}
