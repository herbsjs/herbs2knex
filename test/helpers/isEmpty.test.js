const assert = require('assert')
const { isEmpty } = require('../../src/helpers/isEmpty')

describe('IsEmpty', () => {

    it('sholud return true for empty values', () => {
        //given
        const emptyValues = [
            '',
            [],
            {},
            null,
            undefined
        ]
        //when & then
        emptyValues.map(value => {
            const isEmptyObject = isEmpty(value)
            assert.deepStrictEqual(isEmptyObject, true)
        })

    })

    it('sholud return false for valid values', () => {
        //given
        const emptyValues = [
            'Text',
            123,
            0
        ]
        //when & then
        emptyValues.map(value => {
            const isEmptyObject = isEmpty(value)
            assert.deepStrictEqual(isEmptyObject, false)
        })

    })
})