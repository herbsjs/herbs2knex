const { entity, field } = require('@herbsjs/gotu')
const Repository = require('../../src/repository')
const assert = require('assert')

describe('Repository', () => {

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
                field1: field(Boolean),
                fieldName: field(Boolean)
            })
        }
    })
})