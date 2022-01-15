const { entity, field, id } = require('@herbsjs/gotu')
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
        );
        INSERT INTO ${schema}.${table} (id, string_test, boolean_test)
        VALUES (10, 'marie', true), (11, 'marie', false);`
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
            dbConfig: config
        })
        const injection = {}
        const itemRepo = new ItemRepository(injection)

        //when
        const ret = await itemRepo.where({ stringTest: "marie" })

        //then
        assert.deepStrictEqual(ret.length, 2)
        assert.deepStrictEqual(ret[0].toJSON(), { id: 10, stringTest: 'marie', booleanTest: true })
        assert.deepStrictEqual(ret[1].toJSON(), { id: 11, stringTest: 'marie', booleanTest: false })
    })

    it('should return just the first entity', async () => {
        //given
        const anEntity = givenAnEntity()
        const ItemRepository = givenAnRepositoryClass({
            entity: anEntity,
            table,
            schema,
            dbConfig: config
        })
        const injection = {}
        const itemRepo = new ItemRepository(injection)

        //when
        const ret = await itemRepo.where({ stringTest: "marie" }, { first: true })

        //then
        assert.deepStrictEqual(ret.length, 1)
        assert.deepStrictEqual(ret[0].toJSON(), { id: 10, stringTest: 'marie', booleanTest: true })
    })
})