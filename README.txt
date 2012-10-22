All files add methods to window.SortingDemo global object. All sorting methods return an integer representing the number of milliseconds the sort took.

SortingHelperMethods.js
- SortingDemo.nativeSort() wrapper around Array.prototype.sort()
- SortingDemo.isSorted() to check if an array is sorted
- SortingDemo.randomArray() to generate random arrays

MergeSortStack.js
- uses stack instead of recursion
- insertionSort cutoff for small arrays

MergeSortRecursive.js
- calls SortingDemo.comparator() for comparisons, similar to how you can pass a comparator to the native Array.prototype.sort

MergeSort.js
- most efficient variant
- uses recursion + insertionSort cutoff for small arrays

QuickSortRecursive.js
- Median of 3 pivot strategy
- Switches to insertionSort for small arrays

QuickSort.js
- Highly optimized version of the same quickSort algorithm
- Uses a stack instead of recursion to eliminate overhead
- All method calls inlined and loops tightened up