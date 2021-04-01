const { entity, field } = require('gotu')
const Repository = require('../../src/repository')
const assert = require('assert')

describe('Query Find All', () => {

    const givenAnEntity = () => {
        const ParentEntity = entity('A Parent Entity', {})

        return entity('A entity', {
            id: field(Number),
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

    const knex = (ret, spy = {}) => (
        () => ({
            select: (s) => {
                spy.select = s
                return {
                    orderBy: (o) => {
                        spy.orderBy = o
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
            ids: ['id'],
            knex: knex(retFromDeb, spy)
        })

        //when
        const ret = await itemRepo.findAll()

        //then
        assert.strictEqual(ret.length, 2)
        assert.deepStrictEqual(spy.select, ['id', 'string_test', 'boolean_test'])
        assert.deepStrictEqual(spy.orderBy, [])
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
            ids: ['id'],
            knex: knex(retFromDeb, spy)
        })

        //when
        const ret = await itemRepo.findAll('stringTest')

        //then
        assert.strictEqual(ret.length, 2)
        assert.deepStrictEqual(spy.select, ['id', 'string_test', 'boolean_test'])
        assert.deepStrictEqual(spy.orderBy, 'stringTest')
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
            ids: ['id'],
            knex: knex(retFromDeb, spy)
        })

        //when
        const ret = await itemRepo.findAll([{ column: 'nome', order: 'desc' }, 'email'])

        //then
        assert.strictEqual(ret.length, 2)
        assert.deepStrictEqual(spy.select, ['id', 'string_test', 'boolean_test'])
        assert.deepStrictEqual(spy.orderBy, [{ column: 'nome', order: 'desc' }, 'email'])
    })

    it('should return error when order by is invalid', async () => {
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
            ids: ['id'],
            knex: knex(retFromDeb, spy)
        })

        try {
            //when
            const ret = await itemRepo.findAll(null)
        } catch (error) {
            //then
            assert.deepStrictEqual(error, "order by is invalid")
        }
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
            ids: ['id'],
            knex: knex(retFromDeb, spy)
        })

        try {
            //when
            const ret = await itemRepo.findAll({})
        } catch (error) {
            //then
            assert.deepStrictEqual(error, "order by is invalid")
        }
    })
})