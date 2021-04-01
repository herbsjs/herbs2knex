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
    this.dataMapper = new DataMapper(this.entity, this.entityIDs, this.foreignKeys)
  }

  async findByID(ids) {
    const tableIDs = this.dataMapper.tableIDs()
    const tableFields = this.dataMapper.tableFields()

    const parsedValue = Array.isArray(ids) ? ids : [ids]
    const ret = await this.runner
      .select(tableFields)
      .whereIn(tableIDs[0], parsedValue)

    const entities = []

    for (const row of ret) {
      if (row === undefined) continue
      entities.push(this.dataMapper.toEntity(row))
    }

    return entities
  }

  async findAll(orderBy = []) {

    const tableFields = this.dataMapper.tableFields()

    if (!orderBy || typeof orderBy === "object" && !Object.keys(orderBy)) throw "order by is invalid"

    const ret = await this.runner
      .select(tableFields)
      .orderBy(orderBy)

    const entities = []

    for (const row of ret) {
      if (row === undefined) continue
      entities.push(this.dataMapper.toEntity(row))
    }

    return entities
  }

  async findBy(search) {

    const tableFields = this.dataMapper.tableFields()
    const searchTermTableField = this.dataMapper.toTableFieldName(Object.keys(search)[0])
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
      entities.push(this.dataMapper.toEntity(row))
    }

    return entities
  }

  async insert(entityInstance) {
    const fields = this.dataMapper.tableFields()
    const payload = this.dataMapper.tableFieldsWithValue(entityInstance)

    const ret = await this.runner
      .returning(fields)
      .insert(payload)

    return this.dataMapper.toEntity(ret[0])
  }

  async update(entityInstance) {
    const tableIDs = this.dataMapper.tableIDs()
    const fields = this.dataMapper.tableFields()
    const payload = this.dataMapper.tableFieldsWithValue(entityInstance)

    const ret = await this.runner
      .where(tableIDs[0], entityInstance[tableIDs[0]])
      .returning(fields)
      .update(payload)

    return this.dataMapper.toEntity(ret[0])
  }

  async delete(entityInstance) {
    const tableIDs = this.dataMapper.tableIDs()

    const ret = await this.runner
      .where(tableIDs[0], entityInstance[tableIDs[0]])
      .delete()

    return ret === 1
  }

}
