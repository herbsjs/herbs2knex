const { entity, field } = require('gotu')
const Repository = require('../../src/repository')
const assert = require('assert')

describe('Query Find by ID', () => {

    const givenAnEntity = () => {
        return entity('A entity', {
            id: field(Number),
            stringTest: field(String),
            booleanTest: field(Boolean)
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
        { id: 2, string_test: "clare", boolean_test: false }
    ]

    const knex = () => {
        return  () => ({
            select: (columns) => ({
                    whereIn: (column, values) => {
                        return returnData
                    }
            })
        })
    }

    it('should return entities', async () => {
        //given
        const anEntity = givenAnEntity()
        const injection = { knex }
        const ItemRepository = givenAnRepositoryClass()
        const itemRepo = new ItemRepository({ 
            entity: anEntity,
            table: 'aTable',
            ids: ['id'],
            dbConfig: {},
            injection
        })

        //when
        const ret = await itemRepo.findByID(1)
        
        //then
        assert.deepStrictEqual(ret[0].toJSON(), { id: 1, stringTest: 'john', booleanTest: true })
        assert.deepStrictEqual(ret[1].toJSON(), { id: 2, stringTest: 'clare', booleanTest: false })
    })
})