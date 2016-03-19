#include "../include/mydynamiclibrary.h"
extern int add(int, int);
DLLEXPORT int subtract(int a, int b) {
  return add(a, -b);
}
