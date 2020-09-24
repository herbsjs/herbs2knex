const { entity, field } = require('gotu')
const Repository = require('../../src/repository')
const assert = require('assert')

describe('Delete an Entity', () => {

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
                this.values = values
                return true
            }
        }
    }

    it('should delete an entity', async () => {
        //given
        const rowsFromDb = [
            { id: 1, string_test: "john", boolean_test: true },
            { id: 2, string_test: "clare", boolean_test: false }
        ]
        
        const conditions = { id: 1 , string_test: "john" }

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
        const ret = await itemRepo.delete(itemRepo.table, conditions)

        //then
        assert.deepStrictEqual(dbDriver.sql, "DELETE FROM aTable WHERE id = $1 AND string_test = $2")
        assert.deepStrictEqual(dbDriver.values, [1, 'john'])
        assert.deepStrictEqual(ret, true)
    })

})