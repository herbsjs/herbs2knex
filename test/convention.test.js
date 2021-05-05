const Convetion = require('../src/convention')
const assert = require('assert')

describe('Convetion', () => {

    it('entity field name to database field name', () => {
        //given
        const entityField = "fieldName"
        //when
        const dbField = Convetion.toTableFieldName(entityField)
        //then
        assert.deepStrictEqual(dbField, "field_name")
    })
})