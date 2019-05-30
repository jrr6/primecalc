/* global performance self */

function listPrimes (count, start) {
  if (start > 0) {
    if (start % 2 === 0 && start !== 2) ++start
    while (!isPrime(start)) start += 2
  }
  function nextPrime (value) {
    if (value > 2) {
      let i, q
      do {
        i = 3
        value += 2
        q = Math.floor(Math.sqrt(value))
        while (i <= q && value % i) {
          i += 2
        }
      } while (i <= q)
      return value
    }
    return value === 2 ? 3 : 2
  }

  function isPrime (value) {
    if (value === 2) return true
    if (value === 3) return true
    if (value % 2 === 0) return false
    if (value % 3 === 0) return false
    let i = 5
    let w = 2
    while (i * i <= value) {
      if (value % i === 0) return false
      i += w
      w = 6 - w
    }
    return true
  }

  let value = start
  let result = []
  for (let i = 0; i < count; i++) {
    value = nextPrime(value)
    result.push(value)
  }
  return result
}

self.addEventListener('message', function (e) {
  let startTime = performance.now()
  let primes = listPrimes(e.data.count, e.data.start)
  let endTime = performance.now()
  let totalTime = endTime - startTime
  primes = primes.join(', ')
  if (!e.data.returnString) primes = [primes]
  self.postMessage({
    primes: primes,
    time: totalTime
  })
})
