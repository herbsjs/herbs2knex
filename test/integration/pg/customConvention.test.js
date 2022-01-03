const { entity, field } = require('@herbsjs/gotu')
const Repository = require('../../../src/repository')
const db = require('./db')
const connection = require('../connection')
const assert = require('assert')
const { camelCase } = require('lodash')

describe('Query Find with Conventions', () => {
  const table = 'testRepository'
  const schema = 'herbs2knex_testdb'

  const givenAnRepositoryClass = options => {
    return class ItemRepositoryBase extends Repository {
      constructor () {
        super(options)
      }
    }
  }

  const GivenAnEntity = () => {
    return entity('A entity', {
      id: field(Number),
      stringTest: field(String),
      booleanTest: field(Boolean)
    })
  }

  const GivenAnSnakeCaseEntity = () => {
    return entity('A entity', {
      id: field(Number),
      string_test: field(String),
      boolean_test: field(Boolean)
    })
  }

  before(async () => {
    const sql = `
          DROP SCHEMA IF EXISTS ${schema} CASCADE;
          CREATE SCHEMA ${schema};
          DROP TABLE IF EXISTS ${schema}.${table} CASCADE;
          CREATE TABLE ${schema}."${table}" (
              "id" INT,
              "stringTest" TEXT,
              "booleanTest" BOOL
          )`
    await db.query(sql)

    await db.query(
      `INSERT INTO ${schema}."${table}" ("id", "stringTest", "booleanTest") VALUES (10, 'marie', true)`
    )
  })

  after(async () => {
    const sql = `
          DROP SCHEMA IF EXISTS ${schema} CASCADE;
      `
    await db.query(sql)
  })

  it('should return entities using table field custom convention for camel case', async () => {
    //given
    const toCamelCase = value => camelCase(value)

    const anEntity = GivenAnEntity()
    const ItemRepository = givenAnRepositoryClass({
      entity: anEntity,
      table,
      schema,
      ids: ['id'],
      knex: connection,
      convention: {
        toTableFieldName: field => toCamelCase(field)
      }
    })

    const itemRepo = new ItemRepository()

    //when
    const ret = await itemRepo.find({ where: { stringTest: ['marie'] } })

    //then
    assert.deepStrictEqual(ret[0].toJSON(), {
      id: 10,
      stringTest: 'marie',
      booleanTest: true
    })
  })

  it("should return entities when the convention of the entity's fields is different from the database", async () => {
    //given
    const toCamelCase = value => camelCase(value)

    const anEntity = GivenAnSnakeCaseEntity()
    const ItemRepository = givenAnRepositoryClass({
      entity: anEntity,
      table,
      schema,
      ids: ['id'],
      knex: connection,
      convention: {
        toTableFieldName: field => toCamelCase(field)
      }
    })

    const itemRepo = new ItemRepository()

    //when
    const ret = await itemRepo.find({ where: { stringTest: ['marie'] } })

    //then
    assert.deepStrictEqual(ret[0].toJSON(), {
      id: 10,
      string_test: 'marie',
      boolean_test: true
    })
  })

  it('should return a error when custom convention throws a exception', async () => {
    //given
    const anEntity = GivenAnSnakeCaseEntity()
    const ItemRepository = givenAnRepositoryClass({
      entity: anEntity,
      table,
      schema,
      ids: ['id'],
      knex: connection,
      convention: {
        toTableFieldName: _ => {
          throw new Error('error')
        }
      }
    })


    //when & then
    assert.throws(() => new ItemRepository())
  })
})
