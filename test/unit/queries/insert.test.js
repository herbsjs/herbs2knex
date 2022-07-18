const { entity, field, id } = require("@herbsjs/gotu")
const Repository = require("../../../src/repository")
const assert = require("assert")

describe("Insert an Entity", () => {
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

  const knex = (ret, spy = {}) => (
    () => ({
      returning: (f) => {
        spy.fields = f
        return {
          insert: (p) => {
            spy.payload = p
            return ret
          }
        }
      }
    })
  )

  it("should insert an entity", async () => {
    //given
    let spy = {}
    const retFromDeb = [{ id: 1 }]
    const anEntity = givenAnEntity()
    const ItemRepository = givenAnRepositoryClass()
    const itemRepo = new ItemRepository({
      entity: anEntity,
      table: "aTable",
      knex: knex(retFromDeb, spy)
    })

    anEntity.id = 2
    anEntity.stringTest = "test"
    anEntity.booleanTest = true

    //when
    const ret = await itemRepo.insert(anEntity)

    //then
    assert.deepStrictEqual(ret.id, 1)
    assert.deepStrictEqual(spy.fields, ['id', 'string_test', 'boolean_test'])
    assert.deepStrictEqual(spy.payload, { id: 2, string_test: 'test', boolean_test: true })
  })


  it("should insert an entity with foreign key", async () => {
    //given
    let spy = {}
    const retFromDeb = [{ id: 2 }]
    const anEntity = givenAnEntity()
    const ItemRepository = givenAnRepositoryClass()
    const itemRepo = new ItemRepository({
      entity: anEntity,
      table: "aTable",
      foreignKeys: [{ fkField: String }],
      knex: knex(retFromDeb, spy)
    })

    anEntity.id = 2
    anEntity.stringTest = "test"
    anEntity.booleanTest = true
    anEntity.fkField = 42

    //when
    const ret = await itemRepo.insert(anEntity)

    //then
    assert.deepStrictEqual(ret.id, 2)
    assert.deepStrictEqual(spy.fields, ['id', 'string_test', 'boolean_test', 'fk_field'])
    assert.deepStrictEqual(spy.payload, { id: 2, string_test: 'test', boolean_test: true, fk_field: 42 })
  })
})
