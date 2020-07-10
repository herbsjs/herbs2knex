const { entity, field } = require('gotu')
const Repository = require('../../src/repository')
const assert = require('assert')

describe('Query Get by IDs', () => {

    const givenAnEntity = () => {
        return entity('A entity', {
            id: field(Number),
            stringTest: field(String),
            booleanTest: field(Boolean)
        })
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
                return { rows: ret }
            }
        }
    }

    it('should return entities', async () => {
        //given
        const rowsFromDb = [
            {id: 1, string_test: "john", boolean_test: true},
            {id: 2, string_test: "clare", boolean_test: false}
        ]
        const dbDriver = givenADbDriver(rowsFromDb)
        const anEntity = givenAnEntity()
        const ItemRepository = givenAnRepositoryClass({
            entity: anEntity,
            table: 'aTable',
            ids: ['id'],
            dbDriver
        })
        const injection = {}
        const itemRepo = new ItemRepository(injection)

        //when
        const ret = await itemRepo.getByIDs([1])

        //then
        assert.deepStrictEqual(dbDriver.sql, "SELECT id, string_test, boolean_test FROM aTable WHERE id = ANY ($1)")
        assert.deepStrictEqual(dbDriver.values, [1])
        assert.deepStrictEqual(ret[0].toJSON(), {id: 1, stringTest: 'john', booleanTest: true})
        assert.deepStrictEqual(ret[1].toJSON(), {id: 2, stringTest: 'clare', booleanTest: false})
    })
})