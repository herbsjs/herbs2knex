const { entity, field } = require('gotu')
const Repository = require('../src/repository')
const db = require('./db')
const assert = require('assert')

describe('Persist Entity', () => {

    const table = 'test_repository'
    const schema = 'herbs2pg_testdb'

    before(async () => {
        const sql = `
        DROP SCHEMA IF EXISTS ${schema} CASCADE;
        CREATE SCHEMA ${schema};
        DROP TABLE IF EXISTS ${schema}.${table} CASCADE; 
        CREATE TABLE ${schema}.${table} (
            id INT,
            string_test TEXT,
            boolean_test BOOL,
            PRIMARY KEY (id)
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

    describe('Simple entity', () => {

        const givenAnEntity = () => {
            return entity('A entity', {
                id: field(Number),
                stringTest: field(String),
                booleanTest: field(Boolean)
            })
        }

        const givenAnModifiedEntity = () => {
            const anEntity = givenAnEntity()
            const anEntityInstance = new anEntity()
            anEntityInstance.id = 1
            anEntityInstance.stringTest = "test"
            anEntityInstance.booleanTest = true
            return anEntityInstance
        }

        it('should insert a new item', async () => {

            //given
            const anEntity = givenAnEntity()
            const ItemRepository = givenAnRepositoryClass({
                entity: anEntity,
                table,
                schema,
                ids: ['id'],
                dbDriver: db
            })
            const aModifiedInstance = givenAnModifiedEntity()
            /* clean table for this ID */
            await db.query(`DELETE FROM ${schema}.${table} WHERE id = ${aModifiedInstance.id}`)

            const injection = {}
            const itemRepo = new ItemRepository(injection)

            //when
            const ret = await itemRepo.persist(aModifiedInstance)

            //then
            const retDB = await db.query(`SELECT id FROM ${schema}.${table} WHERE id = ${aModifiedInstance.id}`)
            assert.deepStrictEqual(ret, true)
            assert.deepStrictEqual(retDB.rows[0].id, 1)
        })

        it('should update an existing item', async () => {

            //given
            const anEntity = givenAnEntity()
            const ItemRepository = givenAnRepositoryClass({
                entity: anEntity,
                table,
                schema,
                ids: ['id'],
                dbDriver: db
            })
            const aModifiedInstance = givenAnModifiedEntity()
            /* clean table for this ID */
            await db.query(`DELETE FROM ${schema}.${table} WHERE id = ${aModifiedInstance.id}`)

            const injection = {}
            const itemRepo = new ItemRepository(injection)

            //when
            await itemRepo.persist(aModifiedInstance)
            aModifiedInstance.stringTest = "updated"
            const ret = await itemRepo.persist(aModifiedInstance)

            //then
            const retDB = await db.query(`SELECT string_test FROM ${schema}.${table} WHERE id = ${aModifiedInstance.id}`)
            assert.deepStrictEqual(ret, true)
            assert.deepStrictEqual(retDB.rows[0].string_test, "updated")
        })
    })
})