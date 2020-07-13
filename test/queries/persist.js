const { entity, field } = require('gotu')
const Repository = require('../../src/repository')
const assert = require('assert')

describe('Persist an Entity', () => {

    const givenAnEntity = () => {
        return entity('A entity', {
            id: field(Number),
            stringTest: field(String),
            booleanTest: field(Boolean)
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
            constructor() {
                super(options)
            }
        }
    }

    const givenADbDriver = (ret) => {
        return {
            async query(sql, values) {
                this.sql = sql
                this.values = values[0]
                return true
            }
        }
    }

    it('should persist entities', async () => {
        //given
        const dbDriver = givenADbDriver()
        const anEntity = givenAnEntity()
        const ItemRepository = givenAnRepositoryClass({
            entity: anEntity,
            table: 'aTable',
            ids: ['id'],
            dbDriver
        })
        const aModifiedInstance = givenAnModifiedEntity()

        const injection = {}
        const itemRepo = new ItemRepository(injection)

        //when
        const ret = await itemRepo.persist(aModifiedInstance)

        //then
        assert.deepStrictEqual(dbDriver.sql, 
            "INSERT INTO aTable (id, string_test, boolean_test) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET string_test = EXCLUDED.string_test, boolean_test = EXCLUDED.boolean_test")
        assert.deepStrictEqual(dbDriver.values, [[1, 'test', true]])
        assert.deepStrictEqual(ret, true)
    })
})