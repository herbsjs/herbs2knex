const { entity, field, id } = require('@herbsjs/gotu')
const Repository = require('../../../src/repository')

const connection = require('../connection')
const assert = require('assert')
let pool = {}

describe('Query First', () => {

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
            database,
            knex: connection
        })
        const injection = {}
        await pool.raw(`INSERT INTO ${table} (id, string_test, boolean_test) VALUES (10, 'marie', 1),(20, 'amelia', 1)`)
        const itemRepo = new ItemRepository(injection)


        //when
        const ret = await itemRepo.first({ orderBy: 'string_test' })

        //then
        assert.strictEqual(ret.length, 1)
        assert.deepStrictEqual(ret[0].toJSON(), { id: 20, stringTest: 'amelia', booleanTest: true })
    })

    it('should return empty array if there is no match', async () => {
        //given
        const anEntity = givenAnEntity()
        const ItemRepository = givenAnRepositoryClass({
            entity: anEntity,
            table,
            database,
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