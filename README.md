# HVTree
HV Trees project for [Information Visualization Course](http://www.dia.uniroma3.it/~infovis/) of Roma Tre University.

## Algorithms
The implemented algorithms are:

* **Right Heavy**
  It performs only horizontal combinations, placing the largest subtree to the right
  of the smallest subtree, filling an O(n log(n)) area.

* **Alternated Heavy**
  It performs both horizontal and vertical combinations, placing the largest
  subtree to the right at even depth or to the bottom at odd depth, respectively.
  The resulting drawing occupies an O(n) area.

* **Random Heavy**
  It performs both horizontal and vertical combinations, placing the largest
  subtree to the bottom of the smallest subtree, with a probability setted by
  the user.

* **Area Heuristic**
  It places the subtrees in such a way that the occupied area is smaller.

* **Ratio Heuristic**
  It places the subtrees in such a way that the ratio of the resulting
  drawing is about 1.

* **Labeled Ratio Heuristic**
  Same of Ratio Heuristic, but each node has a width and height
  setted by the user.

## Demo
[Click here](https://screamingapes.github.io/HVTree) to see the demo.

## Credits

All credits goes to [Gianmaria Del Monte](https://github.com/gmgigi96) and [Omar Elsayed](https://github.com/ramorimo).
