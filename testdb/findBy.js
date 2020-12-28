const { entity, field } = require('gotu')
const Repository = require('../src/repository')
const db = require('./db')
const config = require('./config')
const assert = require('assert')

describe('Query Find By', () => {

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
            id: field(Number),
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
            ids: ['id'],
            dbConfig: config
        })
        const injection = {}
        await db.query(`INSERT INTO ${schema}.${table} (id, string_test, boolean_test) VALUES (10, 'marie', true)`)
        const itemRepo = new ItemRepository(injection)


        //when
        const ret = await itemRepo.findBy({ string_test: ["marie"] })

        //then
        assert.deepStrictEqual(ret[0].toJSON(), { id: 10, stringTest: 'marie', booleanTest: true })
    })
})