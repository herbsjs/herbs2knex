const { entity, field, id } = require('@herbsjs/gotu')
const Repository = require('../../src/repository')
const assert = require('assert')
const Convention = require('../../src/convention')

describe('Repository', () => {
  const EmptyEntity = entity('Empty', {})
  const DataMapper = function () {}

  context('Repository constructor', () => {
    it('should use the default convention when no convention is specified', () => {
      const repositoryInstance = new Repository({
        entity: EmptyEntity,
        injection: { DataMapper },
      })

      assert.equal(repositoryInstance.convention, Convention)
    })

    it('should use the specified convention', () => {
      const FakeConvention = function () {}

      const repositoryInstance = new Repository({
        entity: EmptyEntity,
        injection: { DataMapper, convention: FakeConvention },
      })

      assert.equal(repositoryInstance.convention, FakeConvention)
    })

    it('should use the specified table', () => {
      const tableName = 'my_sql_table'

      const repositoryInstance = new Repository({
        entity: EmptyEntity,
        table: tableName,
        injection: { DataMapper },
      })

      assert.equal(repositoryInstance.table, tableName)
    })

    it('should use the table name as tableQualifiedName when no schema is specified', () => {
      const tableName = 'my_sql_table'

      const repositoryInstance = new Repository({
        entity: EmptyEntity,
        table: tableName,
        injection: { DataMapper },
      })

      assert.equal(repositoryInstance.tableQualifiedName, tableName)
    })

    it('should use the schema and the table name to define the tableQualifiedName', () => {
      const tableName = 'my_sql_table'
      const schema = 'my_schema'

      const repositoryInstance = new Repository({
        entity: EmptyEntity,
        table: tableName,
        schema,
        injection: { DataMapper },
      })

      const tableQualifiedName = `${schema}.${tableName}`

      assert.equal(repositoryInstance.tableQualifiedName, tableQualifiedName)
    })

    it('should use the specified entity', () => {
      const repositoryInstance = new Repository({
        entity: EmptyEntity,
        injection: { DataMapper },
      })

      assert.equal(repositoryInstance.entity, EmptyEntity)
    })

    it('should use the specified ids', () => {
      const ids = ['id']

      const repositoryInstance = new Repository({
        entity: EmptyEntity,
        ids,
        injection: { DataMapper },
      })

      assert.equal(repositoryInstance.entityIDs, ids)
    })

    it('should find the entity ids when no id is specified', () => {
      const EntityWithIds = entity('EntityWithId', {
        first: field(Number, { isId: true }),
        second: id(Number),
      })

      const repositoryInstance = new Repository({
        entity: EntityWithIds,
        injection: { DataMapper },
      })

      assert.deepEqual(repositoryInstance.entityIDs, ['first', 'second'])
    })

    it('should set ids to empty array when no id is specified and the entity has no field set as the entity id', () => {
      const EntityWithoutIds = entity('EntityWithoutIds', {
        notId: field(Number),
      })

      const repositoryInstance = new Repository({
        entity: EntityWithoutIds,
        injection: { DataMapper },
      })

      assert.deepEqual(repositoryInstance.entityIDs, [])
    })

    it('should use the specified foreign keys', () => {
      const foreignKeys = ['another_table_id']

      const repositoryInstance = new Repository({
        entity: EmptyEntity,
        foreignKeys,
        injection: { DataMapper },
      })

      assert.equal(repositoryInstance.foreignKeys, foreignKeys)
    })

    it('should use the specified knex instance', () => {
      const knex = {}

      const repositoryInstance = new Repository({
        entity: EmptyEntity,
        knex,
        injection: { DataMapper },
      })

      assert.equal(repositoryInstance.knex, knex)
    })

    it('should create a DataMapper', () => {
      const tracker = new assert.CallTracker()
      const wrappedMapper = tracker.calls(DataMapper)

      new Repository({
        entity: EmptyEntity,
        injection: { DataMapper: wrappedMapper },
      })

      tracker.verify()
    })
  })
})
