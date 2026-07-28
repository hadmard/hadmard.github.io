# CS106B workspace

## Where things go

- `src/` or `practice/`: put new C++ programs here (one `.cpp` file per executable).
- `notes/`: personal course notes.
- `reference/`: course reader and other reference material.
- `third_party/CS106/`: the downloaded Stanford C++ Library; do not edit it for ordinary assignments.

## Use the Stanford library

The command-line collection utilities are ready to use.  For example, in `src/practice.cpp`:

```cpp
#include "grid.h"
#include "strlib.h"
#include "vector.h"

int main() {
    Vector<int> values{1, 2, 3};
    Grid<int> board(2, 2);
}
```

Run `make` to build every `.cpp` file in `src/` and `practice/`.  The executable for `practice/houzhui.cpp`, for example, is `build/practice/houzhui`; run it with `./build/practice/houzhui`.  Run `make clean` to remove generated build files.

The included setup covers the non-GUI CS106B library pieces such as `Vector`, `Grid`, `Map`, `Set`, `Stack`, `Queue`, `PriorityQueue`, graphs, and string utilities.  Stanford GUI headers (for example `gwindow.h`) need an additional Qt build setup and are not part of this command-line Makefile.
