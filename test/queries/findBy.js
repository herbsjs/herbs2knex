const { entity, field } = require('gotu')
const Repository = require('../../src/repository')
const assert = require('assert')

describe('Query Find By', () => {

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
                    whereIn: (w, v) => {
                        spy.where = w
                        spy.value = v
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
        const ret = await itemRepo.findBy({ stringTest: ["john"] })

        //then
        assert.deepStrictEqual(ret[0].toJSON(), { id: 1, stringTest: 'john', booleanTest: true, entityTest: undefined, entitiesTest: undefined })
        assert.deepStrictEqual(ret[1].toJSON(), { id: 2, stringTest: 'clare', booleanTest: false, entityTest: undefined, entitiesTest: undefined })
        assert.deepStrictEqual(spy.select, ['id', 'string_test', 'boolean_test'])
        assert.deepStrictEqual(spy.value, ["john"])
    })

    it('should return entities using foreing key', async () => {
        //given
        let spy = {}
        const retFromDeb = [
            { id: 1, string_test: "john", boolean_test: true, fk_field: 21 },
            { id: 2, string_test: "clare", boolean_test: false, fk_field: null }
        ]
        const anEntity = givenAnEntity()
        const ItemRepository = givenAnRepositoryClass()
        const itemRepo = new ItemRepository({
            entity: anEntity,
            table: 'aTable',
            ids: ['id'],
            foreignKeys: [{ fkField: String }],
            knex: knex(retFromDeb, spy)
        })

        //when
        const ret = await itemRepo.findBy({ fkField: 1 })

        //then
        assert.deepStrictEqual(ret[0].toJSON({ allowExtraKeys: true }), { id: 1, stringTest: 'john', booleanTest: true, entityTest: undefined, entitiesTest: undefined, fkField: "21" })
        assert.deepStrictEqual(ret[1].toJSON({ allowExtraKeys: true }), { id: 2, stringTest: 'clare', booleanTest: false, entityTest: undefined, entitiesTest: undefined, fkField: null })
        assert.deepStrictEqual(spy.select, ['id', 'string_test', 'boolean_test', 'fk_field'])
        assert.deepStrictEqual(spy.where, 'fk_field')
        assert.deepStrictEqual(spy.value, [1])
    })


    it('should return error because a wrong search', async () => {
        //given
        const anEntity = givenAnEntity()
        const ItemRepository = givenAnRepositoryClass()
        const itemRepo = new ItemRepository({
            entity: anEntity,
            table: 'aTable',
            ids: ['id'],
            knex
        })

        try {
            //when
            const ret = await itemRepo.findBy("wrong")
        } catch (error) {
            //then
            assert.deepStrictEqual(error, "search term is invalid")
        }
    })

    it('should return error because a type search', async () => {
        //given
        const anEntity = givenAnEntity()
        const ItemRepository = givenAnRepositoryClass()
        const itemRepo = new ItemRepository({
            entity: anEntity,
            table: 'aTable',
            ids: ['id'],
            knex
        })

        try {
            //when
            const ret = await itemRepo.findBy({ wrong: { wrong: "wrong" } })
        } catch (error) {
            //then
            assert.deepStrictEqual(error, "search value is invalid")
        }
    })
})