# PrimeCalc

This is a simple tool for generating prime numbers using roughly equivalent (but not particularly fast) WASM and JavaScript methods.

## Compilation

* Run `emcc primes.c -o js/wasmprimes.js -s EXTRA_EXPORTED_RUNTIME_METHODS='[\"ccall\", \"cwrap\"]' -s ALLOW_MEMORY_GROWTH=1` in the root directory (it's also a VS Code task).
* Open `index.html` (note that Web Workers won't work if you're using the `file://` protocol).
