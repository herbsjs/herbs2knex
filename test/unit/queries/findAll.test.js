const { entity, field, id } = require('@herbsjs/gotu')
const Repository = require('../../../src/repository')
const assert = require('assert')

describe('Query Find All', () => {

    const givenAnEntity = () => {
        const ParentEntity = entity('A Parent Entity', {})

        return entity('A entity', {
            id: id(Number),
            stringTest: field(String),
            booleanTest: field(Boolean),
            entityTest: field(ParentEntity),
            entitiesTest: field([ParentEntity]),
        })
    }

    const givenAnRepositoryClass = (options) => {
        return class ItemRepositoryBase extends Repository {
            constructor(options) {
                super(options)
            }
        }
    }

    const knexNoFilter = (ret, spy = {}) => (
        () => ({
            select: (s) => {
                spy.select = s
                return ret
            }
        })
    )

    const knex = (ret, spy = {}) => (
        () => ({
            select: (s) => {
                spy.select = s
                return {
                    orderBy: (o) => {
                        spy.orderBy = o
                        return ret
                    },
                    limit: (o) => {
                        spy.limit = o
                        return ret.slice(0, o)
                    },
                    offset: (o) => {
                        spy.offset = o
                        return ret
                    }
                }
            }
        })
    )

    it('should return entities using table field', async () => {
        //given
        let spy = {}
        const retFromDeb = [
            { id: 1, string_test: "john", boolean_test: true },
            { id: 2, string_test: "clare", boolean_test: false }
        ]
        const anEntity = givenAnEntity()
        const ItemRepository = givenAnRepositoryClass()
        const itemRepo = new ItemRepository({
            entity: anEntity,
            table: 'aTable',
            knex: knexNoFilter(retFromDeb, spy)
        })

        //when
        const ret = await itemRepo.findAll()

        //then
        assert.strictEqual(ret.length, 2)
    })

    it('should return entities with collumn order by', async () => {
        //given
        let spy = {}
        const retFromDeb = [
            { id: 1, string_test: "john", boolean_test: true },
            { id: 2, string_test: "clare", boolean_test: false }
        ]
        const anEntity = givenAnEntity()
        const ItemRepository = givenAnRepositoryClass()
        const itemRepo = new ItemRepository({
            entity: anEntity,
            table: 'aTable',
            knex: knex(retFromDeb, spy)
        })

        //when
        const ret = await itemRepo.findAll({ orderBy: 'stringTest' })

        //then
        assert.strictEqual(ret.length, 2)
        assert.deepStrictEqual(spy.select, ['id', 'string_test', 'boolean_test'])
        assert.deepStrictEqual(spy.orderBy, 'stringTest')
    })

    it('should return entities with limit', async () => {
        //given
        let spy = {}
        const retFromDeb = [
            { id: 1, string_test: "john", boolean_test: true },
            { id: 2, string_test: "clare", boolean_test: false }
        ]
        const anEntity = givenAnEntity()
        const ItemRepository = givenAnRepositoryClass()
        const itemRepo = new ItemRepository({
            entity: anEntity,
            table: 'aTable',
            knex: knex(retFromDeb, spy)
        })

        //when
        const ret = await itemRepo.findAll({ limit: 1 })

        //then
        assert.strictEqual(ret.length, 1)
        assert.deepStrictEqual(spy.select, ['id', 'string_test', 'boolean_test'])
        assert.deepStrictEqual(spy.limit, 1)
    })

    it('should return all entities when limit is 0', async () => {
        //given
        let spy = {}
        const retFromDeb = [
            { id: 1, string_test: "john", boolean_test: true },
            { id: 2, string_test: "clare", boolean_test: false }
        ]
        const anEntity = givenAnEntity()
        const ItemRepository = givenAnRepositoryClass()
        const itemRepo = new ItemRepository({
            entity: anEntity,
            table: 'aTable',
            knex: knexNoFilter(retFromDeb, spy)
        })

        //when
        const ret = await itemRepo.findAll({ limit: 0 })

        //then
        assert.strictEqual(ret.length, 2)
        assert.deepStrictEqual(spy.select, ['id', 'string_test', 'boolean_test'])
    })

    it('should return data with offset', async () => {
        //given
        let spy = {}
        const retFromDeb = [
            { id: 1, string_test: "john", boolean_test: true },
            { id: 2, string_test: "clare", boolean_test: false }
        ]
        const anEntity = givenAnEntity()
        const ItemRepository = givenAnRepositoryClass()
        const itemRepo = new ItemRepository({
            entity: anEntity,
            table: 'aTable',
            knex: knex(retFromDeb, spy)
        })

        //when
        const ret = await itemRepo.findAll({ offset: 10 })

        //then
        assert.strictEqual(ret.length, 2)
        assert.deepStrictEqual(spy.select, ['id', 'string_test', 'boolean_test'])
        assert.deepStrictEqual(spy.offset, 10)
    })

    it('should return entities with complex order by', async () => {
        //given
        let spy = {}
        const retFromDeb = [
            { id: 1, string_test: "john", boolean_test: true },
            { id: 2, string_test: "clare", boolean_test: false }
        ]
        const anEntity = givenAnEntity()
        const ItemRepository = givenAnRepositoryClass()
        const itemRepo = new ItemRepository({
            entity: anEntity,
            table: 'aTable',
            knex: knex(retFromDeb, spy)
        })

        //when
        const ret = await itemRepo.findAll({ orderBy: [{ column: 'nome', order: 'desc' }, 'email'] })

        //then
        assert.strictEqual(ret.length, 2)
        assert.deepStrictEqual(spy.select, ['id', 'string_test', 'boolean_test'])
        assert.deepStrictEqual(spy.orderBy, [{ column: 'nome', order: 'desc' }, 'email'])
    })

    it('should return error when order by is a empty object', async () => {
        //given
        let spy = {}
        const retFromDeb = [
            { id: 1, string_test: "john", boolean_test: true },
            { id: 2, string_test: "clare", boolean_test: false }
        ]
        const anEntity = givenAnEntity()
        const ItemRepository = givenAnRepositoryClass()
        const itemRepo = new ItemRepository({
            entity: anEntity,
            table: 'aTable',
            knex: knex(retFromDeb, spy)
        })

        try {
            //when
            const ret = await itemRepo.findAll({ orderBy: {} })
        } catch (error) {
            //then
            assert.deepStrictEqual(error, 'order by is invalid')
        }
    })
})