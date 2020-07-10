const { entity, field } = require('gotu')
const Repository = require('../src/repository')
const db = require('./db')
const assert = require('assert')

describe('Repository', () => {

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
            boolean_test BOOL
        )`
        await db.query(sql)
        console.log(sql)
    })

    after(async () => {
        const sql = `
        DROP SCHEMA IF EXISTS ${schema} CASCADE;
        `
        await db.query(sql)
        console.log(sql)
    })

    const givenAnRepositoryClass = (options) => {
        return class ItemRepositoryBase extends Repository {
            constructor() {
                super(options)
            }
        }
    }


    describe('Entity field to Table field converter', () => {

        const givenAnEntity = () => {
            return entity('A entity', {
                id: field(Number),
                stringTest: field(String),
                booleanTest: field(Boolean)
            })
        }

        it('should convert the fields to the table string convetion', async () => {
            //given
            const anEntity = givenAnEntity()
            const ItemRepository = givenAnRepositoryClass({
                entity: anEntity,
                table,
                schema,
                ids: ['id'],
                dbDriver: db
            })
            const injection = {}
            await db.query(`
                INSERT INTO ${schema}.${table} 
                    (id, string_test, boolean_test)
                VALUES
                    (10, 'marie', true)
            `)
            const itemRepo = new ItemRepository(injection)

            //when
            const ret = await itemRepo.getByIDs([10])

            //then
            assert.deepStrictEqual(ret[0].toJSON(), { id: 10, stringTest: 'marie', booleanTest: true })
        })
    })
})