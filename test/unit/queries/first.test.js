const { entity, field, id } = require('@herbsjs/gotu')
const Repository = require('../../../src/repository')
const assert = require('assert')

describe('Query First', () => {

    context('Find first data', () => {

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
                first: (s) => {
                    spy.first = s
                    return ret
                }
            })
        )

        const knex = (ret, spy = {}) => (() => ({
            first: (s) => {
                spy.first = s
                return {
                    orderBy: (o) => {
                        spy.orderBy = o
                        return ret.slice(0, 1)
                    }
                }
            }
        }))

        it('should return entity using table field', async () => {
            //given
            let spy = {}
            const retFromDeb =
                { id: 1, string_test: "john", boolean_test: true }

            const anEntity = givenAnEntity()
            const ItemRepository = givenAnRepositoryClass()
            const itemRepo = new ItemRepository({
                entity: anEntity,
                table: 'aTable',
                knex: knexNoFilter(retFromDeb, spy)
            })

            //when
            const ret = await itemRepo.first()

            //then
            assert.strictEqual(ret.length, 1)
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
            const ret = await itemRepo.first({ orderBy: 'stringTest' })

            //then
            assert.strictEqual(ret.length, 1)
            assert.deepStrictEqual(spy.first, ['id', 'string_test', 'boolean_test'])
            assert.deepStrictEqual(spy.orderBy, 'stringTest')
        })

        it('should return when order by is complex', async () => {
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
            const ret = await itemRepo.first({ orderBy: [{ column: 'string_test', order: 'desc' }, 'id'] })

            //then
            assert.strictEqual(ret.length, 1)
            assert.deepStrictEqual(spy.first, ['id', 'string_test', 'boolean_test'])
            assert.deepStrictEqual(spy.orderBy[0], { column: 'string_test', order: 'desc' })
            assert.deepStrictEqual(spy.orderBy[1], 'id')

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
                const ret = await itemRepo.first({ orderBy: {} })
            } catch (error) {
                //then
                assert.deepStrictEqual(error, 'order by is invalid')
            }
        })


    })

    context('Find with conditions', () => {
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

        const knex = (ret, spy = {}) => (
            () => ({
                first: (s) => {
                    spy.first = s
                    return {
                        whereIn: (w, v) => {
                            spy.where = w
                            spy.value = v
                            return ret.slice(0, 1)
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
            const ret = await itemRepo.first({ where: { stringTest: ["john"] } })

            //then
            assert.deepStrictEqual(ret[0].toJSON(), { id: 1, stringTest: 'john', booleanTest: true, entityTest: undefined, entitiesTest: undefined })
            assert.deepStrictEqual(spy.first, ['id', 'string_test', 'boolean_test'])
            assert.deepStrictEqual(spy.value, ["john"])
        })

    })


})