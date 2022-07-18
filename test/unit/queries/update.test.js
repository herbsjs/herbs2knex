const { entity, field, id } = require("@herbsjs/gotu")
const Repository = require("../../../src/repository")
const assert = require("assert")

describe("Update an Entity", () => {
  const givenAnEntity = () => {
    const ParentEntity = entity('A Parent Entity', {})

    return entity('A entity', {
      id: id(Number),
      stringTest: field(String),
      booleanTest: field(Boolean),
      entityTest: field(ParentEntity),
      entitiesTest: field([ParentEntity]),
    })
  }

  const givenAnRepositoryClass = (options) => {
    return class ItemRepositoryBase extends Repository {
      constructor(options) {
        super(options)
      }
    }
  }

  const knexMySQL = (ret, spy = {}) => (
    () => ({
      client: { "driverName": "mysql"},
      where: (w, v) => {
        spy.where = w
        spy.value = v
        return {
          returning: (f) => {
            spy.fields = f
            return {
              update: (p) => {
                spy.payload = p
                return 1
              }
            }
          }
        }
      }
    })
  )

  const knexSqlite = (ret, spy = {}) => (
    () => ({
      client: { "driverName": "sqlite3"},
      where: (w, v) => {
        spy.where = w
        spy.value = v
        return {
          returning: (f) => {
            spy.fields = f
            return {
              update: (p) => {
                spy.payload = p
                return 1
              }
            }
          }
        }
      }
    })
  )

  const knex = (ret, spy = {}) => (
    () => ({
      where: (w, v) => {
        spy.where = w
        spy.value = v
        return {
          returning: (f) => {
            spy.fields = f
            return {
              update: (p) => {
                spy.payload = p
                return ret
              }
            }
          }
        }
      }
    })
  )

  it("should update an entity", async () => {
    //given
    let spy = {}
    const retFromDeb = [{ id: 3 }]
    const anEntity = givenAnEntity()
    const ItemRepository = givenAnRepositoryClass()
    const itemRepo = new ItemRepository({
      entity: anEntity,
      table: "aTable",
      knex: knex(retFromDeb, spy)
    })

    anEntity.id = 1
    anEntity.stringTest = "test"
    anEntity.booleanTest = true

    //when
    const ret = await itemRepo.update(anEntity)

    //then
    assert.deepStrictEqual(ret.id, 3)
    assert.deepStrictEqual(spy.where, 'id')
    assert.deepStrictEqual(spy.value, 1)
    assert.deepStrictEqual(spy.fields, ['id', 'string_test', 'boolean_test'])
    assert.deepStrictEqual(spy.payload, { id: 1, string_test: 'test', boolean_test: true })
  })

  

  it("should update an entity when driver is mysql", async () => {
    //given
    let spy = {}
    const retFromDeb = [{ id: 3 }]
    const anEntity = givenAnEntity()
    const ItemRepository = givenAnRepositoryClass()
    const itemRepo = new ItemRepository({
      entity: anEntity,
      table: "aTable",
      knex: knexMySQL(retFromDeb, spy)
    })

    anEntity.id = 1
    anEntity.stringTest = "test"
    anEntity.booleanTest = true

    //when
    const ret = await itemRepo.update(anEntity)

    //then
    assert.deepStrictEqual(ret, true)
    assert.deepStrictEqual(spy.where, 'id')
    assert.deepStrictEqual(spy.value, 1)
    assert.deepStrictEqual(spy.fields, ['id', 'string_test', 'boolean_test'])
    assert.deepStrictEqual(spy.payload, { id: 1, string_test: 'test', boolean_test: true })
  })

  it("should update an entity when driver is sqlite", async () => {
    //given
    let spy = {}
    const retFromDeb = [{ id: 3 }]
    const anEntity = givenAnEntity()
    const ItemRepository = givenAnRepositoryClass()
    const itemRepo = new ItemRepository({
      entity: anEntity,
      table: "aTable",
      knex: knexSqlite(retFromDeb, spy)
    })

    anEntity.id = 1
    anEntity.stringTest = "test"
    anEntity.booleanTest = true

    //when
    const ret = await itemRepo.update(anEntity)

    //then
    assert.deepStrictEqual(ret, true)
    assert.deepStrictEqual(spy.where, 'id')
    assert.deepStrictEqual(spy.value, 1)
    assert.deepStrictEqual(spy.fields, ['id', 'string_test', 'boolean_test'])
    assert.deepStrictEqual(spy.payload, { id: 1, string_test: 'test', boolean_test: true })
  })

  it("should update an entity with foreign key", async () => {
    //given
    let spy = {}
    const retFromDeb = [{ id: 1, string_test: 'x', boolean_test: false, fk_field: 41 }]
    const anEntity = givenAnEntity()
    const ItemRepository = givenAnRepositoryClass()
    const itemRepo = new ItemRepository({
      entity: anEntity,
      table: "aTable",
      foreignKeys: [{ fkField: String }],
      knex: knex(retFromDeb, spy)
    })

    anEntity.id = 1
    anEntity.stringTest = "test"
    anEntity.booleanTest = true
    anEntity.fkField = 42

    //when
    const ret = await itemRepo.update(anEntity)

    //then
    assert.deepStrictEqual(ret.id, 1)
    assert.deepStrictEqual(spy.where, 'id')
    assert.deepStrictEqual(spy.value, 1)
    assert.deepStrictEqual(spy.fields, ['id', 'string_test', 'boolean_test', 'fk_field'])
    assert.deepStrictEqual(spy.payload, { id: 1, string_test: 'test', boolean_test: true, fk_field: 42 })
  })

})
