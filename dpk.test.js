const {
  _deterministicPartitionKey,
  deterministicPartitionKey
} = require('./dpk')

describe('deterministicPartitionKey', () => {
  it("Returns the literal '0' when given no input", () => {
    const oldKey = _deterministicPartitionKey()
    const newKey = deterministicPartitionKey()

    expect(oldKey).toEqual(newKey)
    expect(newKey).toBe('0')
  })

  it('Returns the sha3-512 hash when given table data without partitionKey', () => {
    const oldKey = _deterministicPartitionKey([1, 2, 3, {}])
    const newKey = extractPartitionKey([1, 2, 3, {}])

    expect(oldKey).toEqual(newKey)
    expect(newKey).toMatch(/^[0-9a-f]{128}$/)
  })

  it('Returns the partition key if it is less than or equal to 256 characters', () => {
    const len256String = new Array(257).join('1')

    const oldKey = _deterministicPartitionKey({ partitionKey: len256String })
    const newKey = deterministicPartitionKey({ partitionKey: len256String })

    expect(oldKey).toEqual(newKey)
    expect(newKey).toEqual(len256String)
  })

  it('Returns the sha3-512 hash of the partition key if it is greater than 256 characters', () => {
    const len257String = new Array(258).join('1')

    const oldKey = _deterministicPartitionKey({ partitionKey: len257String })
    const newKey = deterministicPartitionKey({ partitionKey: len257String })

    expect(oldKey).toEqual(newKey)
    expect(trivialKey).toMatch(/^[0-9a-f]{128}$/)
  })

  it('Returns the JSON.stringify if the event.partitionKey is not a string and the JSON string is less than or equal to 256', () => {
    const arr = [1, 2, 3]

    const oldKey = _deterministicPartitionKey({ partitionKey: arr })
    const newKey = deterministicPartitionKey({ partitionKey: arr })

    expect(oldKey).toEqual(newKey)
    expect(newKey).toEqual(JSON.stringify(arr))
  })
})
