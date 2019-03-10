# PrimeCalc

This is a simple tool for generating prime numbers using roughly equivalent (but not particularly fast) WASM and JavaScript methods.

## Compilation

* Install [emscripten](https://emscripten.org/).
* Run `emcc primes.c -o js/wasmprimes.js -s EXTRA_EXPORTED_RUNTIME_METHODS='[\"ccall\", \"cwrap\"]' -s ALLOW_MEMORY_GROWTH=1` in the root directory (it's also a VS Code task). (Sorry, there's no `make` task or anything of that nature…yet, at least.)
* Open `index.html` (note that Web Workers won't work if you're using the `file://` protocol).
