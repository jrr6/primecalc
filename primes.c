#include <stdlib.h>
#include <math.h>
#include <inttypes.h>
#include <emscripten.h>
#include <stdbool.h>

unsigned long * listPrimes(int, unsigned long);
unsigned long nextPrime(unsigned long);
bool isPrime(unsigned long);

uintmax_t * listPrimes64(int, uintmax_t);
uintmax_t nextPrime64(uintmax_t);
bool isPrime64(uintmax_t);

/*** 32-bit ***/

EMSCRIPTEN_KEEPALIVE
unsigned long * listPrimes(int count, unsigned long start) {
  if (start > 0) {
    if (start % 2 == 0 && start != 2) ++start;
    while (!isPrime(start)) start += 2;
  }

  unsigned long *primes;
  primes = malloc(count * sizeof(unsigned long));
  unsigned long value = start;
  int i;
  for (i = 0; i < count; ++i) {
    value = nextPrime(value);
    primes[i] = value;
  }
  return &primes[0];
}

unsigned long nextPrime(unsigned long n) {
  if (n > 2) {
    unsigned long i, q;
    do {
      i = 3;
      n += 2;
      q = sqrt(n);
      while (i <= q && n % i != 0) {
        i += 2;
      }
    } while (i <= q);
    return n;
  }
  return n == 2ul ? 3ul : 2ul;
}

bool isPrime(unsigned long n) {
  if (n == 2) return true;
  if (n == 3) return true;
  if (n % 2 == 0) return false;
  if (n % 3 == 0) return false;
  int i = 5, w = 2;
  while (i * i <= n) {
    if (n % i == 0) return false;
    i += w;
    w = 6 - w;
  }
  return true;
}

/*** 64-bit ***/

EMSCRIPTEN_KEEPALIVE
uintmax_t * listPrimes64(int count, uintmax_t start) {
  if (start > 0) {
    if (start % 2 == 0 && start != 2) ++start;
    while (!isPrime64(start)) start += 2;
  }

  uintmax_t *primes;
  primes = malloc(count * sizeof(uintmax_t));
  uintmax_t value = start;
  int i;
  for (i = 0; i < count; ++i) {
    value = nextPrime64(value);
    primes[i] = value;
  }
  return &primes[0];
}

uintmax_t nextPrime64(uintmax_t n) {
  if (n > 2) {
    uintmax_t i, q;
    do {
      i = 3;
      n += 2;
      q = sqrt(n);
      while (i <= q && n % i != 0) {
        i += 2;
      }
    } while (i <= q);
    return n;
  }
  return n == 2ul ? 3ul : 2ul;
}

bool isPrime64(uintmax_t n) {
  if (n == 2) return true;
  if (n == 3) return true;
  if (n % 2 == 0) return false;
  if (n % 3 == 0) return false;
  int i = 5, w = 2;
  while (i * i <= n) {
    if (n % i == 0) return false;
    i += w;
    w = 6 - w;
  }
  return true;
}
