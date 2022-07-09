import crypto from 'crypto'

const TRIVIAL_PARTITION_KEY = '0'
const MAX_PARTITION_KEY_LENGTH = 256

export const _deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = '0'
  const MAX_PARTITION_KEY_LENGTH = 256
  let candidate

  if (event) {
    if (event.partitionKey) {
      candidate = event.partitionKey
    } else {
      const data = JSON.stringify(event)
      candidate = crypto.createHash('sha3-512').update(data).digest('hex')
    }
  }

  if (candidate) {
    if (typeof candidate !== 'string') {
      candidate = JSON.stringify(candidate)
    }
  } else {
    candidate = TRIVIAL_PARTITION_KEY
  }
  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = crypto.createHash('sha3-512').update(candidate).digest('hex')
  }
  return candidate
}

export const deterministicPartitionKey = (event) => {
  // If the event object is null or undefined, return the trivial key.
  if (!event) {
    return TRIVIAL_PARTITION_KEY
  }

  // If the event object has a partition key, and it is not a string, stringify it using JSON.stringify.
  if (event.partitionKey && typeof event.partitionKey !== 'string') {
    event.partitionKey = JSON.stringify(event.partitionKey)
  }

  // If the event object has a partition key that is the candidate,
  // else JSON.stringify the event object and make it the candidate.
  let candidate = event?.partitionKey || JSON.stringify(event)

  // If the candidate is longer than the maximum partition key length,
  // hash it and make it the candidate.
  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = crypto.createHash('sha3-512').update(candidate).digest('hex')
  }

  return candidate
}
