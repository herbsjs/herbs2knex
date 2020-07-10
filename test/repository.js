const { entity, field } = require('gotu')
const Repository = require('../src/repository')
const assert = require('assert')

describe('Repository', () => {

    const givenAnRepositoryClass = (options) => {
        return class ItemRepositoryBase extends Repository {
            constructor() {
                super(options)
            }
        }
    }


    describe('Entity field to Table field converter', () => {

        const givenAnEntity = () => {
            return entity('A entity', {
                id: field(Number),
                field1: field(Boolean),
                fieldName: field(Boolean)
            })
        }

        it('should convert the fields to the table string convetion', () => {
            //given
            const anEntity = givenAnEntity()
            const ItemRepository = givenAnRepositoryClass({
                entity: anEntity,
                table: 'aTable',
                ids: ['id']
            })
            const injection = {}
            //when
            const itemRepo = new ItemRepository(injection)
            //then
            assert.deepStrictEqual(itemRepo.tableIDs, ['id'])
            assert.deepStrictEqual(itemRepo.tableFields, ['id', 'field1', 'field_name'])
        })
    })
})