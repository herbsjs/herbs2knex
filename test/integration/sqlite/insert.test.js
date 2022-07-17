const { entity, field, id } = require('@herbsjs/gotu')
const Repository = require('../../../src/repository')
const connection = require('../connection')
const assert = require('assert')
let pool = {}

describe('Persist Entity', () => {

    const table = 'test_repository'
    const database = 'herbs2knex_testdb'

    before(async () => {
        pool = await connection

        sql = `
        CREATE TABLE ${table} (
            id INT,
            string_test VARCHAR(400),
            boolean_test BIT,
            PRIMARY KEY (id)
        )`

        await pool.raw(sql)
    })

    after(async () => {
        
        sql = `
        DROP TABLE ${table};
        `
        await pool.raw(sql)

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

        it('should insert a new item', async () => {

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
            const ret = await itemRepo.insert(aModifiedInstance)
         
            //then
            const retDB = await pool.raw(`SELECT string_test FROM ${table} WHERE id = ${aModifiedInstance.id}`)
            assert.deepStrictEqual(retDB[0].string_test, "test")
        })
    })
})