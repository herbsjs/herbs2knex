const Convention = require("./convention")
const DataMapper = require("./dataMapper")
const { isEmpty } = require("./helpers/isEmpty")

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

  /** 
  *
  * Find all method
  * 
  * @param {type}   object.limit Limit items to list  
  * @param {type}   object.orderBy Order by query
  *
  * @return {type} List of entities
  */
  async findAll(options = {
    limit: 0,
    orderBy: []
  }) {

    const entities = this.find({ limit, orderBy })
    return entities
  }

  /** 
  *
  * Find with search term
  * 
  * @param {type}   search Term to find entities
  *
  * @return {type} Single entity
  */
  async findBy(search) {
    const entities = await this.find({ search });
    return entities;
  }

  /** 
  *
  * Find entities
  * 
  * @param {type}   object.limit Limit items to list  
  * @param {type}   object.offset Offset records
  * @param {type}   object.search Where query term
  * @param {type}   object.orderBy Order by query
  *
  * @return {type} List of entities
  */
  async find(options = {
    limit: 0,
    offset,
    orderBy: [],
    search: null
  }) {

    options.orderBy = options.orderBy || []
    options.limit = options.limit || 0
    options.offset = options.offset || 0
    options.search = options.search || null

    const tableFields = this.dataMapper.tableFields()
    const searchTermTableField = this.dataMapper.toTableFieldName(Object.keys(search)[0])
    const searchTerm = Object.keys(search)[0]
    if (!searchTerm || searchTerm === "0") throw "search term is invalid"

    const searchValue = Array.isArray(search[searchTerm])
      ? search[searchTerm]
      : [search[searchTerm]]

    if (!options.orderBy || typeof options.orderBy === "object" && !Array.isArray(options.orderBy) && isEmpty(options.orderBy)) throw "order by is invalid"
    if (!options.search[searchTerm] || (typeof options.search[searchTerm] === "object" && !Array.isArray(options.search[searchTerm])) || (Array.isArray(options.search[searchTerm]) && !options.search[searchTerm].length)) throw "search value is invalid"

    let query = this.runner
      .select(tableFields)

    if (options.limit > 0) query = query.limit(options.limit)
    if (options.offset > 0) query = query.offset(options.offset)
    if (options.search) query = query.whereIn(searchTermTableField, searchValue)
    if (!isEmpty(options.orderBy)) query = query.orderBy(options.orderBy)

    const entities = []
    const ret = await query

    for (const row of ret) {
      if (row === undefined) continue
      entities.push(this.dataMapper.toEntity(row))
    }

    return entities
  }

  /** 
  *
  * Create a new entity
  * 
  * @param {type}   entityInstance Entity instance
  *
  * @return {type} Current entity
  */
  async insert(entityInstance) {
    const fields = this.dataMapper.tableFields()
    const payload = this.dataMapper.tableFieldsWithValue(entityInstance)

    const ret = await this.runner
      .returning(fields)
      .insert(payload)

    return this.dataMapper.toEntity(ret[0])
  }

  /** 
  *
  * Update entity
  * 
  * @param {type}   entityInstance Entity instance
  *
  * @return {type} Current entity
  */
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

  /** 
  *
  * Delete entity
  * 
  * @param {type}   entityInstance Entity instance
  *
  * @return {type} True when success
  */
  async delete(entityInstance) {
    const tableIDs = this.dataMapper.tableIDs()

    const ret = await this.runner
      .where(tableIDs[0], entityInstance[tableIDs[0]])
      .delete()

    return ret === 1
  }

}
