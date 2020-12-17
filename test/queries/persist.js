const { entity, field } = require("gotu")
const Repository = require("../../src/repository")
const assert = require("assert")

describe("Persist an Entity", () => {
  const givenAnEntity = () => {
    return entity("A entity", {
      id: field(Number),
      stringTest: field(String),
      booleanTest: field(Boolean),
    })
  }

  const givenAnModifiedEntity = () => {
    const anEntity = givenAnEntity()
    const anEntityInstance = new anEntity()
    anEntityInstance.id = 1
    anEntityInstance.stringTest = "test"
    anEntityInstance.booleanTest = true
    return anEntityInstance
  }

  const givenAnRepositoryClass = (options) => {
    return class ItemRepositoryBase extends Repository {
      constructor(options) {
        super(options)
      }
    }
  }

  let querySQL
  let quetyValues

  const knex = () => () => ({
    raw: (sql, values) => {
      querySQL = sql
      quetyValues = values
      return true
    },
    where: () => ({ update: () => 1 }),
  })

  it("should persist entities", async () => {
    //given
    const anEntity = givenAnEntity()
    const ItemRepository = givenAnRepositoryClass()
    const aModifiedInstance = givenAnModifiedEntity()

    const injection = { knex }
    const itemRepo = new ItemRepository({
      entity: anEntity,
      table: "aTable",
      ids: ["id"],
      dbConfig: {},
      injection,
    })

    //when
    const ret = await itemRepo.persist(aModifiedInstance)

    //then
    assert.deepStrictEqual(ret, true)
  })
})
