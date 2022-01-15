const { entity, field, id } = require('@herbsjs/gotu')
const Repository = require('../../../src/repository')
const db = require('./db')
const connection = require('../connection')
const assert = require('assert')
let pool = {}

describe('Delete an Entity', () => {

    const table = 'test_repository'
    const database = 'herbs2knex'

    before(async () => {
        pool = await db

        sql = `
        DROP DATABASE IF EXISTS ${database}`

        await pool.query(sql)

        sql = `CREATE DATABASE ${database}`
        
        await pool.query(sql)

        sql = `
        USE ${database}`

        await pool.query(sql)

        sql = `
        CREATE TABLE ${table} (
            id INT,
            string_test VARCHAR(400),
            boolean_test BIT,
            PRIMARY KEY (id)
        )`

        await pool.query(sql)

        sql = `
        INSERT INTO ${table} values (1, 'created', 1)`
        await pool.query(sql)
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

        it('should delete an existing item', async () => {

            //given
            const anEntity = givenAnEntity()
            const ItemRepository = givenAnRepositoryClass({
                entity: anEntity,
                table,
                database,
                knex: connection
            })
            const aModifiedInstance = givenAnModifiedEntity()

            const injection = {}
            const itemRepo = new ItemRepository(injection)

            //when
            const ret = await itemRepo.delete(aModifiedInstance)

            //then
            const retDB = await pool.execute(`SELECT string_test FROM ${table} WHERE id = ${aModifiedInstance.id}`)
            assert.deepStrictEqual(retDB[0].length, 0)
        })
    })
})