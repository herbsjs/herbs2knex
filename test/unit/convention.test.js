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
    
})