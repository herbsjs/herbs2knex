const { entity, field } = require('gotu')
const Repository = require('../../src/repository')
const db = require('./db')
const connection = require('../connection')
const assert = require('assert')
let pool = {}

describe('Query Find By', () => {

    const table = 'test_repository'
    const database = 'herbs2knex_testdb'

    before(async () => {
        pool = await db

        sql = `
        DROP DATABASE IF EXISTS ${database}`

        await pool.query(sql)

        sql = `CREATE DATABASE ${database}`
        
        await pool.query(sql)

        sql = `
        CREATE TABLE ${database}..${table} (
            id INT,
            string_test VARCHAR(400),
            boolean_test BIT,
            PRIMARY KEY (id)
        )`

        await pool.query(sql)
    })

    after(async () => {
        
        let sql = `alter database ${database} set single_user with rollback immediate`
        await pool.query(sql)

        sql = `
        DROP DATABASE IF EXISTS ${database};
        `
        await pool.query(sql)

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
            database,
            ids: ['id'],
            knex: connection
        })
        const injection = {}
        await pool.query(`INSERT INTO ${database}..${table} (id, string_test, boolean_test) VALUES (10, 'marie', 1)`)
        const itemRepo = new ItemRepository(injection)


        //when
        const ret = await itemRepo.findBy({ stringTest: ["marie"] })

        //then
        assert.deepStrictEqual(ret[0].toJSON(), { id: 10, stringTest: 'marie', booleanTest: true })
    })
})