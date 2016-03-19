#include <mydynamiclibrary.h>
#include <stdio.h>
int main(int argc, char** argv) {
  printf("%d", subtract(111, 69));
  return (subtract(111, 69) == 42) ? 0 : -1;
}
