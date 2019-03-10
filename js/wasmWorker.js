/* global importScripts Module performance self */
importScripts('wasmprimes.js')
let safe = false
let input = null

Module['onRuntimeInitialized'] = function () {
  safe = true
  if (input !== null) {
    wasmListPrimes()
  }
}
Module['print'] = function (text) {
  if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ')
  console.log(text)
}

Module['printErr'] = function (text) {
  if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ')
  console.error(text)
}

self.addEventListener('message', function (e) {
  input = e.data
  if (safe) {
    wasmListPrimes()
  }
})

function wasmListPrimes () {
  safe = false // in case there's a competing request

  let methodName = input.mode64Bit ? 'listPrimes64' : 'listPrimes'

  let startTime = performance.now()
  let pointer = Module.ccall(methodName, null, ['number', 'number'], [input.count, input.start])
  let result = []
  // article about memory access: https://becominghuman.ai/passing-and-returning-webassembly-array-parameters-a0f572c65d97
  if (input.mode64Bit) {
    // first index contains the number/addend, the second index is a boolean determining whether it's beyond 32-bit range
    for (let i = 0; i < input.count * 2; i += 2) {
      let numIdx = pointer / Uint32Array.BYTES_PER_ELEMENT + i
      let bitIdx = numIdx + 1
      let prime = Module.HEAPU32[numIdx]
      if (Module.HEAPU32[bitIdx] === 1) prime += 4294967296
      result.push(prime)
    }
  } else {
    for (let i = 0; i < input.count; ++i) {
      let prime = Module.HEAPU32[pointer / Uint32Array.BYTES_PER_ELEMENT + i]
      result.push(prime)
    }
  }
  let endTime = performance.now()
  let totalTime = endTime - startTime
  let res = result.join(', ')
  if (!input.returnString) res = [res]
  self.postMessage({
    primes: res,
    time: totalTime
  })

  // prepare for next time
  input = null
  safe = true
}
