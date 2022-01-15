const { entity, field, id } = require('@herbsjs/gotu')
const Repository = require('../../../src/repository')
const db = require('./db')
const connection = require('../connection')
const assert = require('assert')

describe('Persist Entity', () => {

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
            boolean_test BOOL,
            PRIMARY KEY (id)
        );
        INSERT INTO ${schema}.${table} values (1, 'created', true)`
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
                id: id(Number),
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

        it('should update an existing item', async () => {

            //given
            const anEntity = givenAnEntity()
            const ItemRepository = givenAnRepositoryClass({
                entity: anEntity,
                table,
                schema,
                knex: connection
            })
            const aModifiedInstance = givenAnModifiedEntity()

            const injection = {}
            const itemRepo = new ItemRepository(injection)

            //when
            aModifiedInstance.stringTest = "updated"
            const ret = await itemRepo.update(aModifiedInstance)

            //then
            const retDB = await db.query(`SELECT string_test FROM ${schema}.${table} WHERE id = ${aModifiedInstance.id}`)
            assert.deepStrictEqual(retDB.rows[0].string_test, "updated")
        })
    })
})