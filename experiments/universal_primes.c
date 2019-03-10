/*
  This file can be compiled without any modification by both gcc and emscripten for a direct WASM/native comparison.
  Change prime_t to the desired numerical type for prime generation.
*/
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <time.h>

#define prime_t unsigned long

int main();
prime_t * listPrimes(int);
prime_t nextPrime(prime_t);

int main(int argc, char *argv[]) {
  int count;
  if (argc == 2) {
    count = (int) strtol(argv[1], (char **)NULL, 10);
  } else {
    printf("no argument passed; using 1000000\n");
    count = 1000000;
  }
  printf("starting timing\n");
  clock_t begin = clock();
  listPrimes(count);
  clock_t end = clock();
  printf("ending timing\n");
  double timeSpent = (double)(end - begin) / CLOCKS_PER_SEC;
  printf("%f seconds\n", timeSpent);
  return 0;
}

prime_t * listPrimes(int count) {
  prime_t *primes;
  primes = malloc(count * sizeof(prime_t));
  prime_t value = 1;
  int i;
  for (i = 0; i < count; ++i) {
    value = nextPrime(value);
    primes[i] = value;
  }
  return &primes[0];
}

prime_t nextPrime(prime_t val) {
  if (val > 2) {
    prime_t i, q;
    do {
      i = 3;
      val += 2;
      q = sqrt(val);
      while (i <= q && val % i != 0) {
        i += 2;
      }
    } while (i <= q);
    return val;
  }
  return val == 2ul ? 3ul : 2ul;
}
