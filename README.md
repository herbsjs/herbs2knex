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

const injection = {}
const itemRepo = new ItemRepository(injection)
const ret = await itemRepo.getByIDs([1])
```