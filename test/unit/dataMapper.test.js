const DataMapper = require('../../src/dataMapper')
const { entity, field } = require('@herbsjs/gotu')
const assert = require('assert')

describe('Data Mapper', () => {

    describe('Simple Entity', () => {

        const givenAnEntity = () => {
            return entity('A entity', {
                idField: field(Number),
                field1: field(Boolean),
                fieldName: field(Boolean)
            })
        }

        it('should create a data mapper', () => {
            //given
            const Entity = givenAnEntity()

            //when
            const dataMapper = new DataMapper(Entity)

            //then
            assert.deepStrictEqual(dataMapper.entity, Entity)
        })

        it('should convert data from table to entity', () => {
            //given
            const Entity = givenAnEntity()
            const entityIDs = ['idField']
            const dataMapper = new DataMapper(Entity, entityIDs)

            //when
            const toEntity = dataMapper.toEntity({ id_field: 1, field1: true, field_name: false })

            //then
            assert.deepStrictEqual(toEntity.idField, 1)
            assert.deepStrictEqual(toEntity.field1, true)
            assert.deepStrictEqual(toEntity.fieldName, false)

        })

        it('should convert an entity field to the table string convetion', () => {
            //given
            const Entity = givenAnEntity()
            const entityIDs = ['idField']
            const dataMapper = new DataMapper(Entity, entityIDs)

            //when
            const toEntity = dataMapper.toTableFieldName('fieldName')

            //then
            assert.deepStrictEqual(toEntity, 'field_name')
        })

        it('should retrieve table ID from entity', () => {
            //given
            const Entity = givenAnEntity()
            const entityIDs = ['idField']
            const dataMapper = new DataMapper(Entity, entityIDs)

            //when
            const toEntity = dataMapper.tableIDs()

            //then
            assert.deepStrictEqual(toEntity, ['id_field'])
        })

        it('should retrieve table fields', () => {
            //given
            const Entity = givenAnEntity()
            const entityIDs = ['idField']
            const dataMapper = new DataMapper(Entity, entityIDs)

            //when
            const toEntity = dataMapper.tableFields()

            //then
            assert.deepStrictEqual(toEntity, ['id_field', 'field1', 'field_name'])
        })

        it('should retrieve table fields with values', () => {
            //given
            const Entity = givenAnEntity()
            const entityInstance = new Entity()
            entityInstance.idField = 1
            entityInstance.field1 = true
            entityInstance.fieldName = false
            const entityIDs = ['idField']
            const dataMapper = new DataMapper(Entity, entityIDs)

            //when
            const toEntity = dataMapper.tableFieldsWithValue(entityInstance)

            //then
            assert.deepStrictEqual(toEntity, { id_field: 1, field1: true, field_name: false })
        })
    })

    describe('Complex Entity - Multiple Types', () => {

        const givenAnComplexEntity = () => {
            const ParentEntity = entity('A parent entity', {})

            return entity('A entity', {
                id: field(Number),
                name: field(String, {
                    validation: { presence: true, length: { minimum: 3 } }
                }),
                numberTest: field(Number),
                stringTest: field(String),
                booleanTest: field(Boolean),
                dateTest: field(Date),
                objectTest: field(Object),
                entityTest: field(ParentEntity),
                // TODO
                // arrayTest: field(Array),
                numbersTest: field([Number]),
                stringsTest: field([String]),
                booleansTest: field([Boolean]),
                datesTest: field([Date]),
                objectsTest: field([Object]),
                // arraysTest:field([Array]),
                entitiesTest: field([ParentEntity]),
                functionTest() { return 1 }
            })
        }

        it('should convert data from table to entity', () => {
            //given
            const Entity = givenAnComplexEntity()
            const samples = [
                ['id', 'id', 1],
                ['name', 'name', "clare"],
                ['number_test', 'numberTest', 1],
                ['string_test', 'stringTest', "s1"],
                ['boolean_test', 'booleanTest', true],
                ['date_test', 'dateTest', new Date()],
                ['object_test', 'objectTest', { x: 1 }],
                // TODO
                // ['array_test', 'arrayTest', [1]] 
                ['numbers_test', 'numbersTest', [1, 2]],
                ['strings_test', 'stringsTest', ["s1", "s2"]],
                ['booleans_test', 'booleansTest', [true, false]],
                ['dates_test', 'datesTest', [new Date(), new Date()]],
                ['objects_test', 'objectsTest', [{ x: 1 }, { y: 2 }]],
                // ['arrays_test', 'arraysTest', [[1]]] 
            ]

            //when
            const dataMapper = new DataMapper(Entity)
            const data = samples.map(i => { return { [i[0]]: i[2] } }).reduce((obj, i) => Object.assign(obj, i))
            const toEntity = dataMapper.toEntity(data)

            //then
            samples.map(i => {
                assert.deepStrictEqual(toEntity[i[1]], i[2])
            })

        })

        it('should return null from table to entity', () => {
            //given
            const Entity = givenAnComplexEntity()
            const samples = [
                ['id', 'id', null],
                ['name', 'name', null],
                ['number_test', 'numberTest', null],
                ['string_test', 'stringTest', null],
                ['boolean_test', 'booleanTest', null],
                ['date_test', 'dateTest', null],
                ['object_test', 'objectTest', null],
                // TODO
                // ['array_test', 'arrayTest', [null]] 
                ['numbers_test', 'numbersTest', null],
                ['strings_test', 'stringsTest', [null, null]],
                ['booleans_test', 'booleansTest', [null, null]],
                ['dates_test', 'datesTest', [null, null]],
                ['objects_test', 'objectsTest', [null, null]],
                // ['arrays_test', 'arraysTest', [[null]]] 
            ]

            //when
            const dataMapper = new DataMapper(Entity)
            const data = samples.map(i => { return { [i[0]]: i[2] } }).reduce((obj, i) => Object.assign(obj, i))
            const toEntity = dataMapper.toEntity(data)

            //then
            samples.map(i => {
                assert.deepStrictEqual(toEntity[i[1]], i[2])
            })

        })
    })
})