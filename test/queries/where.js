const { entity, field } = require("gotu")
const Repository = require("../../src/repository")
const assert = require("assert")

describe("Where", () => {
  const givenAnEntity = () => {
    return entity("A entity", {
      id: field(Number),
      stringTest: field(String),
      booleanTest: field(Boolean),
    })
  }

  const givenAnRepositoryClass = (options) => {
    return class ItemRepositoryBase extends Repository {
      constructor(options) {
        super(options)
      }
    }
  }

  const returnData = [
    { id: 1, string_test: "john", boolean_test: true },
    { id: 2, string_test: "clare", boolean_test: false },
  ]

  const knex = () => {
    return () => ({
      where: (param, options) => {
        return returnData
      },
    })
  }

  it("should return entities", async () => {
    //given
    const anEntity = givenAnEntity()
    const injection = { knex }
    const ItemRepository = givenAnRepositoryClass()
    const itemRepo = new ItemRepository({
      entity: anEntity,
      table: "aTable",
      ids: ["id"],
      dbConfig: {},
      injection,
    })

    //when
    const ret = await itemRepo.where({ stringTest: ["john"] })

    //then
    assert.deepStrictEqual(ret[0].toJSON(), {
      id: 1,
      stringTest: "john",
      booleanTest: true,
    })
    assert.deepStrictEqual(ret[1].toJSON(), {
      id: 2,
      stringTest: "clare",
      booleanTest: false,
    })
  })

  
  it("should return entities with first", async () => {

    const knexInjection = () => {
        return () => ({
          where: (param, options) => ({
            first: () => {
                return [returnData[0]]
            },
          }),
        })
      }

    //given
    const anEntity = givenAnEntity()
    const injection = { knex: knexInjection }
    const ItemRepository = givenAnRepositoryClass()
    const itemRepo = new ItemRepository({
      entity: anEntity,
      table: "aTable",
      ids: ["id"],
      dbConfig: {},
      injection,
    })

    //when
    const ret = await itemRepo.where({ stringTest: ["john"] }, { first: true })

    //then
    assert.deepStrictEqual(ret[0].toJSON(), {
      id: 1,
      stringTest: "john",
      booleanTest: true,
    })
  })
})
