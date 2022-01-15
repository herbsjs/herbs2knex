const { entity, field, id } = require('@herbsjs/gotu')
const Repository = require('../../../src/repository')
const db = require('./db')
const connection = require('../connection')
const assert = require('assert')

describe('Query First', () => {

    const table = 'test_repository'
    const schema = 'herbs2knex_testdb'

    before(async () => {
        const sql = `
        DROP SCHEMA IF EXISTS ${schema} CASCADE;
        CREATE SCHEMA ${schema};
        DROP TABLE IF EXISTS ${schema}.${table} CASCADE; 
        CREATE TABLE ${schema}.${table} (
            id INT,
            string_test TEXT,
            boolean_test BOOL
        )`
        await db.query(sql)
    })

    after(async () => {
        const sql = `
            DROP SCHEMA IF EXISTS ${schema} CASCADE;
        `
        await db.query(sql)
    })

    const givenAnRepositoryClass = (options) => {
        return class ItemRepositoryBase extends Repository {
            constructor() {
                super(options)
            }
        }
    }

    const givenAnEntity = () => {
        return entity('A entity', {
            id: id(Number),
            stringTest: field(String),
            booleanTest: field(Boolean)
        })
    }

    it('should return entities', async () => {
        //given
        const anEntity = givenAnEntity()
        const ItemRepository = givenAnRepositoryClass({
            entity: anEntity,
            table,
            schema,
            knex: connection
        })
        const injection = {}
        await db.query(`INSERT INTO ${schema}.${table} (id, string_test, boolean_test) VALUES (10, 'marie', true),(20, 'amelia', false)`)
        const itemRepo = new ItemRepository(injection)

        //when
        const ret = await itemRepo.first({ where: { stringTest: ["marie"] } })

        //then
        assert.strictEqual(ret.length, 1)
        assert.deepStrictEqual(ret[0].toJSON(), { id: 10, stringTest: 'marie', booleanTest: true })
    })

    it('should return empty array if there is no match', async () => {
        //given
        const anEntity = givenAnEntity()
        const ItemRepository = givenAnRepositoryClass({
            entity: anEntity,
            table,
            schema,
            knex: connection
        })
        const injection = {}        
        const itemRepo = new ItemRepository(injection)


        //when
        const ret = await itemRepo.first({ where: { stringTest: ["jhon"] } })

        //then
        assert.strictEqual(ret.length, 0)
    })
})