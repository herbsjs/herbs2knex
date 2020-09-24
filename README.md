<p align="center"><img src="https://raw.githubusercontent.com/herbsjs/herbs2pg/master/docs/logo.png" height="220"></p>

![Node.js CI](https://github.com/herbsjs/herbs2pg/workflows/Node.js%20CI/badge.svg?branch=master)[![codecov](https://codecov.io/gh/herbsjs/herbs2pg/branch/master/graph/badge.svg)](https://codecov.io/gh/herbsjs/herbs2pg)

# herbs2pg

herbs2pg creates postgresql repositories based on herbs entities (gotu)

### Installing
    $ npm install herbs2pg

### Using

```javascript
const { Repository } = require('herbs2pg')

class ItemRepository extends Repository {
    constructor() {
        super({
            entity: anEntity,
            table: 'aTable',
            ids: ['id'],
            dbDriver
        })
    }
}

const itemRepo = new ItemRepository()
const ret = await itemRepo.findByID(1)
```
Repository config:

`entity` - A Herbs entity reference

`table` - A Postgres table name

`ids` - The primary keys of the table

`dbDriver` - A object that respondes to `.query(sql, values)`. Usually `pg.Pool`.

### Repository vs ORM

The idea is to create a repositories with common methods needed for an application.

It is not the intention of this lib to create a ORM. For more complex scenarios it is recommended to extend the repository by use raw queries (just be careful with sql injection) or use favorite ORM, encapsulating inside a method the necessary queries or database operations.

For instance:
```javascript
class ItemRepository extends Repository {
    constructor() {
        super({
            entity: anEntity,
            table: 'aTable',
            ids: ['id'],
            dbDriver
        })
    }

    getExcludedItemFromLastWeek() {
        ...
    }
}

const itemRepo = new ItemRepository()
const ret = await itemRepo.getExcludedItemFromLastWeek()
```

## Retrieving and Persisting Data

### `findByID`
Find by ID

TODO: Example

### `persist`
An `upsert`.

TODO: Example

### `update`
Update record accordingly to conditions and passing in new data.

Example:
```javascript
const { Repository } = require('herbs2pg')

class ItemRepository extends Repository {
    constructor() {
        super({
            entity: anEntity,
            table: 'aTable',
            ids: ['id'],
            dbDriver
        })
    }
}

const tableFields = {
            id: 1,
            string_test: 'mike',
            boolean_test: false
        }

const conditions = { id: 1 }

const itemRepo = new ItemRepository()
const ret = await itemRepo.update(itemRepo.table, conditions, tableFields )
```


## TODO

- [ ] Allow only scalar types for queries (don't allow entity / object types)
- [ ] Allow to ommit schema's name

Features:
- [ ] Be able to change the conventions (injection)
- [ ] Exclude / ignore fields on a sql statement
- [ ] Awareness of created/updated at/by fields

Retrieving and Persist:
- [X] persist (upsert)
- [ ] insert
- [X] update
- [X] find (ID)
    - [ ] deal with entities / tables with multiples IDs
- [ ] find by (any field)
- [ ] find with a iterator for batchs
- [ ] find with pages
- [ ] first
- [ ] last

