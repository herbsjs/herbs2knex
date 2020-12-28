const { entity, field } = require('gotu')
const Repository = require('../../src/repository')
const assert = require('assert')

describe('Query Find By', () => {

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

    it('should return entities using table field', async () => {
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
        const ret = await itemRepo.findBy({ string_test: ["john"] })

        //then
        assert.deepStrictEqual(ret[0].toJSON(), { id: 1, stringTest: 'john', booleanTest: true })
        assert.deepStrictEqual(ret[1].toJSON(), { id: 2, stringTest: 'clare', booleanTest: false })
    })

    it('should return entities using entity field', async () => {
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
        const ret = await itemRepo.findBy({ stringTest: ["john"] })

        //then
        assert.deepStrictEqual(ret[0].toJSON(), { id: 1, stringTest: 'john', booleanTest: true })
        assert.deepStrictEqual(ret[1].toJSON(), { id: 2, stringTest: 'clare', booleanTest: false })
    })

    
    it('should return error because a wrong search', async () => {
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

        try{
            //when
            const ret = await itemRepo.findBy("wrong")
            throw "wrong value"
        }catch(error){
            //then
            assert.deepStrictEqual(error, "search term is invalid")
        }
    })
    
    it('should return error because a type search', async () => {
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

        try{
            //when
            const ret = await itemRepo.findBy({ wrong : { wrong: "wrong" }})
            throw "wrong value"
        }catch(error){
            //then
            assert.deepStrictEqual(error, "search value is invalid")
        }
    })
})