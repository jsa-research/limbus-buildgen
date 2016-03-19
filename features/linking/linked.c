#include <mylibrary.h>
#include <stdio.h>
int main(int argc, char** argv) {
  printf("%d", add(23, 88) - 69);
  return (add(23, 88) == 111) ? 0 : -1;
}
