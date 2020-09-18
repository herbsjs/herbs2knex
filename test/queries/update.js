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

    const givenAnUpdatedEntity = () => {
        const anEntity = givenAnEntity()
        const anEntityInstance = new anEntity()
        anEntityInstance.id = 1
        anEntityInstance.stringTest = "Mike"
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
                this.values = values[0][0]
                return {row: ret}
            }
        }
    }

    it('should update entities', async () => {
        //given
        const rowsFromDb = [
            { id: 1, string_test: "john", boolean_test: true },
            { id: 2, string_test: "clare", boolean_test: false }
        ]

        const dbDriver = givenADbDriver(rowsFromDb)
        const anEntity = givenAnEntity()
        const ItemRepository = givenAnRepositoryClass({
            entity: anEntity,
            table: 'aTable',
            ids: ['id'],
            dbDriver
        })
        
        const anUpdatedInstance = givenAnUpdatedEntity()

        const injection = {}
        const itemRepo = new ItemRepository(injection)

        //when
        const ret = await itemRepo.update(anUpdatedInstance)
        console.log(ret)

        //then
        assert.deepStrictEqual(dbDriver.sql, "UPDATE aTable SET id = $1, string_test = $2, boolean_test = $3 WHERE id = $1, string_test = $2, boolean_test = $3")
        assert.deepStrictEqual(dbDriver.values, [1, 'Mike', true])
        assert.deepStrictEqual(ret[0].toJSON(), { id: 1, stringTest: 'Mike', booleanTest: true })
        assert.deepStrictEqual(ret[1].toJSON(), { id: 1, stringTest: 'clare', booleanTest: false })
    })

})