const Convention = require('./convention')
const DataMapper = require('./dataMapper')
const { checker } = require('@herbsjs/suma')
const { BaseEntity } = require("@herbsjs/gotu/src/baseEntity")

module.exports = class Repository {
  constructor(options) {
    this.convention = Object.assign(new Convention(), options.convention)
    this.table = options.table
    this.schema = options.schema
    this.tableQualifiedName = this.schema
      ? `${this.schema}.${this.table}`
      : `${this.table}`
    this.entity = options.entity
    this.entityIDs = this.#getEntityIds(options)
    this.foreignKeys = options.foreignKeys
    this.knex = options.knex
    this.dataMapper = new DataMapper(
      this.entity,
      this.entityIDs,
      this.foreignKeys,
      options
    )
  }

  runner() {
    return this.knex(this.tableQualifiedName)
  }

  /** 
  *
  * Finds entities matching the ID condition.
  * 
  * @param {type}   ids The id or the array of id's to search
  * @return {type} List of entities
  */
  async findByID(ids) {
    const tableIDs = this.dataMapper.tableIDs()
    const tableFields = this.dataMapper.tableFields()

    const parsedValue = Array.isArray(ids) ? ids : [ids]
    const ret = await this.runner()
      .select(tableFields)
      .whereIn(tableIDs[0], parsedValue)

    const entities = []

    for (const row of ret) {
      if (row === undefined) continue
      entities.push(this.dataMapper.toEntity(row))
    }

    return entities
  }

  async #executeFindQuery(query, options) {


    if (options.where) {
      const conditionTermTableField = this.dataMapper.toTableFieldName(Object.keys(options.where)[0])
      const conditionTerm = Object.keys(options.where)[0]
      if (!conditionTerm || conditionTerm === "0") throw "condition term is invalid"

      const conditionValue = Array.isArray(options.where[conditionTerm])
        ? options.where[conditionTerm]
        : [options.where[conditionTerm]]

      if (!options.where[conditionTerm] ||
        (typeof options.where[conditionTerm] === "object" && !Array.isArray(options.where[conditionTerm])) ||
        (Array.isArray(options.where[conditionTerm]) && !options.where[conditionTerm].length))
        throw "condition value is invalid"

      query = query.whereIn(conditionTermTableField, conditionValue)
    }

    if (options.orderBy) {
      if (!options.orderBy || typeof options.orderBy === "object" && !Array.isArray(options.orderBy) && checker.isEmpty(options.orderBy)) throw "order by is invalid"
      query = query.orderBy(options.orderBy)
    }

    const entities = []
    const ret = await query

    if (checker.isDefined(ret)) {
      if (checker.isIterable(ret)) {
        for (const row of ret) {
          if (row === undefined) continue
          entities.push(this.dataMapper.toEntity(row))
        }
      }
      else
        entities.push(this.dataMapper.toEntity(ret))
    }
    return entities
  }

  /** 
*
* Finds entities matching the conditions.
* 
* @param {type}   object.limit Limit items to list  
* @param {type}   object.offset Rows that will be skipped from the resultset
* @param {type}   object.where Where query term
* @param {type}   object.orderBy Order by query
*
* @return {type} List of entities
*/
  async find(options = {
    limit: 0,
    offset: 0,
    orderBy: null,
    where: null
  }) {

    options.orderBy = options.orderBy || null
    options.limit = options.limit || 0
    options.offset = options.offset || 0
    options.where = options.where || null

    const tableFields = this.dataMapper.tableFields()

    let query = this.runner()
      .select(tableFields)

    if (options.limit > 0) query = query.limit(options.limit)
    if (options.offset > 0) query = query.offset(options.offset)

    return this.#executeFindQuery(query, options)
  }

  /** 
  *
  * Find all entities
  * 
  * @param {type}   object.limit Limit items to list  
  * @param {type}   object.orderBy Order by query
  * @param {type}   object.offset Rows that will be skipped from the resultset
  *
  * @return {type} List of entities
  */
  async findAll(options = {
    limit: 0,
    offset: 0,
    orderBy: null
  }) {

    const entities = this.find({ limit: options.limit, offset: options.offset, orderBy: options.orderBy })
    return entities
  }

  /** 
 *
 * Finds the first entity matching the conditions.
 * 
 * @param {type}   object.orderBy Order by query to get the first element of, if null will return the first element without order
 *
 * @return {type} Entity
 */
  async first(options = {
    orderBy: null,
    where: null
  }) {

    options.orderBy = options.orderBy || null
    options.where = options.where || null

    const tableFields = this.dataMapper.tableFields()

    let query = this.runner().first(tableFields)

    return this.#executeFindQuery(query, options)
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

    const ret = await this.runner()
      .returning(fields)
      .insert(payload)

    //.returning() is not supported by sqlite3 and will not have any effect, so we have to get last inserted row
    if (this.runner().client && this.runner().client.driverName && (this.runner().client.driverName.includes('sqlite3'))) {
      const tableIDs = this.dataMapper.tableIDs()
      let searchId = payload[tableIDs[0]]
      if(!searchId) searchId = (await this.knex.raw(`SELECT last_insert_rowid();`))[0]['last_insert_rowid()']
      return (await this.findByID(searchId))[0]
    }

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

    const ret = await this.runner()
      .where(tableIDs[0], entityInstance[tableIDs[0]])
      .returning(fields)
      .update(payload)

    //.returning() is not supported by mysql or mysql2 and will not have any effect, update only return 1 to true or 0 to false
    if (this.runner().client && this.runner().client.driverName && (this.runner().client.driverName.includes('mysql') || this.runner().client.driverName.includes('sqlite3')))
      return ret === 1

    return this.dataMapper.toEntity(ret[0])
  }

  /** 
  *
  * Delete entity
  * 
  * @param {type} entityInstance Entity instance
  *
  * @return {type} True when success
  */
  async delete(entityInstance) {
    const tableIDs = this.dataMapper.tableIDs()

    const ret = await this.runner()
      .where(tableIDs[0], entityInstance[tableIDs[0]])
      .delete()

    return ret === 1
  }

  #getEntityIds({ entity, ids }) {
    if (ids) return ids

    if (entity && entity.prototype instanceof BaseEntity) {
      const fields = Object.values(entity.prototype.meta.schema)
      const idFields = fields.filter(({ options }) => options.isId)
      const idFieldsNames = idFields.map(({ name }) => name)

      return idFieldsNames
    }

    return []
  }
}
