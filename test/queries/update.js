const { entity, field } = require('gotu')
const Repository = require('../../src/repository')
const assert = require('assert')

describe('Update an Entity', () => {

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

    it('should update entities', async () => {
        //given
        const rowsFromDb = [
            { id: 1, string_test: "john", boolean_test: true },
            { id: 2, string_test: "clare", boolean_test: false }
        ]
        
        const tableFields = {
            id: 1,
            string_test: 'mike',
            boolean_test: false
        }

        const conditions = { id: 1 }

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
        const ret = await itemRepo.update(itemRepo.table, conditions, tableFields)

        //then
        assert.deepStrictEqual(dbDriver.sql, "UPDATE aTable SET id = $1, string_test = $2, boolean_test = $3 WHERE id = $4 RETURNING *")
        assert.deepStrictEqual(dbDriver.values, [1, 'mike', false, 1])
        assert.deepStrictEqual(ret, true)
    })

})