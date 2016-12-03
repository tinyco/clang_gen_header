# how to use

- write `#include "abc.h"//PUBLIC` in sample.c -> generate `include "abc.h"` in sample.gen.h
- write `int hoge(int arg)//PUBLIC;` in sample.c -> generate `int hoge(int arg);` in sample.gen.h
- write `/*EXPORT #define DDD 1*/` in sample.c -> generate `#define DDD 1` in sample.gen.h
- generate with include-guard

# generate

- ex. $node generate_header.js hello.c
- ex. $find ./src | xargs node generate_header.js

These codes are licensed under CC0.
