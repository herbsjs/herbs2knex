const { entity, field, id } = require('@herbsjs/gotu')
const Repository = require('../../../src/repository')
const assert = require('assert').strict

describe('Query Find', () => {

    context('Find all data', () => {

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

        const knex = (ret, spy = {}) => (() => ({
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
                    },
                }
            }
        }))

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
            const ret = await itemRepo.find()

            //then
            assert.equal(ret.length, 2)
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
            const ret = await itemRepo.find({ orderBy: 'stringTest' })

            //then
            assert.equal(ret.length, 2)
            assert.deepEqual(spy.select, ['id', 'string_test', 'boolean_test'])
            assert.deepEqual(spy.orderBy, 'stringTest')
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
            const ret = await itemRepo.find({ limit: 1 })

            //then
            assert.equal(ret.length, 1)
            assert.deepEqual(spy.select, ['id', 'string_test', 'boolean_test'])
            assert.deepEqual(spy.limit, 1)
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
            const ret = await itemRepo.find({ limit: 0 })

            //then
            assert.equal(ret.length, 2)
            assert.deepEqual(spy.select, ['id', 'string_test', 'boolean_test'])
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
            const ret = await itemRepo.find({ offset: 10 })

            //then
            assert.equal(ret.length, 2)
            assert.deepEqual(spy.select, ['id', 'string_test', 'boolean_test'])
            assert.deepEqual(spy.offset, 10)
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
            const ret = await itemRepo.find({ orderBy: [{ column: 'nome', order: 'desc' }, 'email'] })

            //then
            assert.equal(ret.length, 2)
            assert.deepEqual(spy.select, ['id', 'string_test', 'boolean_test'])
            assert.deepEqual(spy.orderBy, [{ column: 'nome', order: 'desc' }, 'email'])
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
                const ret = await itemRepo.find({ orderBy: {} })
            } catch (error) {
                //then
                assert.deepEqual(error, 'order by is invalid')
            }
        })
    })

    context('Find with conditions', () => {
        const givenAnEntity = () => {
            const ParentEntity = entity('A Parent Entity', {
                id: id(Number),
                stringTest: field(String),
            })

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
                knex: knex(retFromDeb, spy)
            })

            //when
            const ret = await itemRepo.find({ where: { stringTest: ["john"] } })

            //then
            assert.deepEqual(ret[0].toJSON(), { id: 1, stringTest: 'john', booleanTest: true, entityTest: undefined, entitiesTest: undefined })
            assert.deepEqual(ret[1].toJSON(), { id: 2, stringTest: 'clare', booleanTest: false, entityTest: undefined, entitiesTest: undefined })
            assert.deepEqual(spy.select, ['id', 'string_test', 'boolean_test'])
            assert.deepEqual(spy.value, ["john"])
        })

        it('should return entities using foreign keys', async () => {
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
                foreignKeys: [{ fkField: String }],
                knex: knex(retFromDeb, spy)
            })

            //when
            const ret = await itemRepo.find({ where: { fkField: 1 } })

            //then
            assert.deepEqual(ret[0].toJSON({ allowExtraKeys: true }), { id: 1, stringTest: 'john', booleanTest: true, entityTest: undefined, entitiesTest: undefined, fkField: "21" })
            assert.deepEqual(ret[1].toJSON({ allowExtraKeys: true }), { id: 2, stringTest: 'clare', booleanTest: false, entityTest: undefined, entitiesTest: undefined, fkField: null })
            assert.deepEqual(spy.select, ['id', 'string_test', 'boolean_test', 'fk_field'])
            assert.deepEqual(spy.where, 'fk_field')
            assert.deepEqual(spy.value, [1])
        })


        it('should return error because a wrong search', async () => {
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
                knex: knex(retFromDeb, spy)
            })

            try {
                //when
                const ret = await itemRepo.find({ where: "wrong" })
            } catch (error) {
                //then
                assert.deepEqual(error, "condition term is invalid")
            }
        })

        it('should return error because a type search', async () => {
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
                knex: knex(retFromDeb, spy)

            })

            try {
                //when
                const ret = await itemRepo.find({ where: { wrong: { wrong: "wrong" } } })
            } catch (error) {
                //then
                assert.deepEqual(error, "condition value is invalid")
            }
        })
    })

})