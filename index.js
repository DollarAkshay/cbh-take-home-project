const { deterministicPartitionKey } = require('./dpk')

console.log(deterministicPartitionKey([1, 2, 3, {}]))
