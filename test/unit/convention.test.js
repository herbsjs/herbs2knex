const Convetion = require('../../src/convention')
const assert = require('assert')

describe('Convetion', () => {

    it('entity field name to database field name', () => {
        //given
        const entityField = "fieldName"
        const convention = new Convetion()
        //when
        const dbField = convention.toTableFieldName(entityField)
        //then
        assert.deepStrictEqual(dbField, "field_name")
    })

    it('entity field name (ID) to database field name', () => {
        //given
        const entityField = "fieldID"
        const convention = new Convetion()
        //when
        const dbField = convention.toTableFieldName(entityField)
        //then
        assert.deepStrictEqual(dbField, "field_id")
    })
    
    it('entity field name (Id) to database field name', () => {
        //given
        const entityField = "fieldId"
        const convention = new Convetion()
        //when
        const dbField = convention.toTableFieldName(entityField)
        //then
        assert.deepStrictEqual(dbField, "field_id")
    })

    it('entity complex field name (Id) to database field name', () => {
        //given
        const entityField = "ThisIsAnFieldId"
        const convention = new Convetion()
        //when
        const dbField = convention.toTableFieldName(entityField)
        //then
        assert.deepStrictEqual(dbField, "this_is_an_field_id")
    })

})