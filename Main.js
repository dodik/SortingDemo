/**
 * @fileOverview SortingHelperMethods.js
 * 
 * Copyright (c) Jeff Bradford, 2012
 * 
 * Usage:    var data = SortingDemo.randomArray(10000, 100000);
 *           console.log(SortingDemo.isSorted(data));
 */
(function (ns, Math) {
	/**
	 * Compares two items (typically int) to see which one is smaller or larger
	 * @param {int} a An item to be compared
	 * @param {int} b An item to be compared
	 * @returns {int} -1 if a < b, 0 if a === b, 1 if a > b
	 */
	function comparator(a, b) {
		if (a < b) {
			return -1;
		} else if (a === b) {
			return 0;
		} else {
			return 1;
		}
	}
	
	/**
	 * Returns true if the array is sorted, false otherwise
	 * @param {Array} data An array of data
	 * @returns true if the array is sorted, a string warning otherwise
	 */
	function isSorted(data) {
		if (!(data instanceof Array)) {
			return "This is not an Array...";
		}
		var i = 0, len = data.length;
		while (++i < len) {
			if (data[i - 1] > data[i]) {
				return "Array is not sorted near index: " + i;
			}
		}
		return true;
	}
	
	/**
	 * Creates and returns a pseudo-randomly generated array of integers
	 * @param {int} size The desired size of the array
	 * @param {int} range Range of the data, numbers will be in the interval 1 - range
	 * @param {boolean} str Whether to generate an array of strings or integers
	 * @returns {Array} An array of integers or strings
	 */
	function randomArray(size, range, str) {
		var data = [];
		if (typeof size !== "number" || size < 1) {
			size = 1000;
		}
		if (typeof range !== "number" || range < 1) {
			range = 10000;
		}
		var i = -1;
		while (++i < size) {
			data[i] = Math.floor(Math.random() * range + 1);
		}
		if (str) {
			i = -1;
			while (++i < size) {
				data[i] = "" + data[i];
			}
		}
		return data;
	}
	
	/**
	 * Wrapper around the browser's native sort method
	 * @param {Array} data An array of data
	 * @returns The number of milliseconds required for sorting
	 */
	function nativeSort(data, compare) {
		if (typeof compare !== "function") {
			compare = comparator;
		};
		var t = (new Date()).getTime();
		data.sort(compare);
		return (new Date()).getTime() - t;
	}
	
	/**
	 * Returns a string representation of the array
	 * @param {Array} data An array of data
	 * @returns {string} String representation of the array
	 */
	function toString(data) {
		var result, i, len;
		if (!(data instanceof Array)) {
			return "data is not an Array";
		} else if (data === null){
			return "data is null";
		} else if (data.length === 0) {
			return "[]";
		} else {
			result = "[" + data[0];
			for (i = 1, len = data.length; i < len; i++) {
				result += "," + data[i];
			}
			result += "]";
			return result;
		}
	}
	
	// expose public members
	ns.comparator = comparator;
	ns.isSorted = isSorted;
	ns.nativeSort = nativeSort;
	ns.randomArray = randomArray;
	ns.toString = toString;
}(window.SortingDemo = window.SortingDemo || {}, window.Math));

/**
 * @fileOverview MergeSort.js
 * 
 * Copyright (c) Jeff Bradford, 2012
 * 
 * Recursive top-down mergesort
 * - Switches to insertion sort for small arrays (INSERTION_SORT_CUTOFF)
 * 
 * Usage:    var time = SortingDemo.mergeSort(integerArray);
 */
(function (ns, Math) {
	// Arrays of this size and smaller will be sorted with insertion sort
	var INSERTION_SORT_CUTOFF = 10,
		insertionSortCutoff = INSERTION_SORT_CUTOFF;
	
	/**
	 * Driver for mergeSort
	 * @param {Array} data An array of data
	 * @param {int} cutoff The cutoff limit for switching to insertionSort for small arrays
	 * @returns {int} How many milliseconds the sorting took
	 */
	function mergeSort(data, cutoff) {
		if (typeof cutoff === "number" && 4 < cutoff && cutoff < 21) {
			insertionSortCutoff = Math.floor(cutoff);
		} else {
			insertionSortCutoff = INSERTION_SORT_CUTOFF;
		}
		if (data instanceof Array) {
			var start = (new Date()).getTime();
			var tempArray = [];
			mergeSortHelper(data, tempArray, 0, data.length - 1);
			return (new Date()).getTime() - start;
		}
		return 0;
	}
	
	/**
	 * Internal method for mergeSort
	 * @param {Array} data An array of data
	 * @param {int} left The left endpoint of the interval (inclusive)
	 * @param {int} right The right endpoint of the interval (inclusive)
	 */
	function mergeSortHelper(data, tempArray, left, right) {
		if (right - left < insertionSortCutoff) {
			insertionSortHelper(data, left, right);
		} else {
			var center = Math.floor(left + (right - left) / 2);
			mergeSortHelper(data, tempArray, left, center);
			mergeSortHelper(data, tempArray, center + 1, right);
			merge(data, tempArray, left, center, center + 1, right);
		}
	}
	
	/**
	 * Merges two sorted subarrays
	 * @param {Array} data An array of data
	 * @param {Array} tempArray An array used for temporary storage
	 * @param {int} leftPos The start of the left half (inclusive)
	 * @param {int} leftEnd The end of the left half (inclusive)
	 * @param {int} rightPos The start of the right half (inclusive)
	 * @param {int} rightEnd The end of the right half (inclusive)
	 */
	function merge(data, tempArray, leftPos, leftEnd, rightPos, rightEnd) {
		var tempPos = leftPos,
			arraySize = rightEnd - leftPos + 1,
			i = 0;
		
		// compare and copy smaller item into temporary array
		while (leftPos <= leftEnd && rightPos <= rightEnd) {
			if (data[leftPos] <= data[rightPos]) {
				tempArray[tempPos++] = data[leftPos++];
			} else {
				tempArray[tempPos++] = data[rightPos++];
			}
		}
		
		// copy left half if any remaining
		while (leftPos <= leftEnd) {
			tempArray[tempPos++] = data[leftPos++];
		}
		
		// copy right half if any remaining
		while (rightPos <= rightEnd) {
			tempArray[tempPos++] = data[rightPos++];
		}
		
		// copy temporary array over the main array
		while (i++ < arraySize) {
			data[rightEnd] = tempArray[rightEnd];
			rightEnd--;
		}
	}
	
	/**
	 * Helper function: Insertion sort for small intervals
	 * @param {Array} data An array of data
	 * @param {int} left The left endpoint of the interval (inclusive)
	 * @param {int} right The right endpoint of the interval (inclusive)
	 */
	function insertionSortHelper(data, left, right) {
		var i = left, j, temp;
		while (++i <= right) {
			temp = data[i];
			j = i;
			while (--j >= left && temp < data[j]) {
				data[j + 1] = data[j];
			}
			data[j + 1] = temp;
		}
	}
	
	// expose public members
	ns.mergeSort = mergeSort;
}(window.SortingDemo = window.SortingDemo || {}, window.Math));

/**
 * @fileOverview MergeSortRecursive.js
 * 
 * Copyright (c) Jeff Bradford, 2012
 * 
 * Recursive top-down mergesort
 * - Calls SortingDemo.comparator() for comparisons instead of inline less than / greater than
 * 
 * Usage:    var time = SortingDemo.mergeSortRecursive(integerArray);
 */
(function (ns, Math) {
	/**
	 * Driver for mergeSort
	 * @param {Array} data An array of data
	 * @param {int} cutoff The cutoff limit for switching to insertionSort for small arrays
	 * @returns {int} How many milliseconds the sorting took
	 */
	function mergeSort(data, cutoff) {
		if (typeof cutoff === "number" && 4 < cutoff && cutoff < 21) {
			INSERTION_SORT_CUTOFF = Math.floor(cutoff);
		}
		if (data instanceof Array) {
			var start = (new Date()).getTime();
			var tempArray = [];
			mergeSortHelper(data, tempArray, 0, data.length - 1);
			return (new Date()).getTime() - start;
		}
		return 0;
	}
	
	/**
	 * Internal method for mergeSort
	 * @param {Array} data An array of data
	 * @param {int} left The left endpoint of the interval (inclusive)
	 * @param {int} right The right endpoint of the interval (inclusive)
	 */
	function mergeSortHelper(data, tempArray, left, right) {
		if (left < right) {
			var center = Math.floor(left + (right - left) / 2);
			mergeSortHelper(data, tempArray, left, center);
			mergeSortHelper(data, tempArray, center + 1, right);
			merge(data, tempArray, left, center, center + 1, right);
		}
	}
	
	/**
	 * Merges two sorted subarrays
	 * @param {Array} data An array of data
	 * @param {Array} tempArray An array used for temporary storage
	 * @param {int} leftPos The start of the left half (inclusive)
	 * @param {int} leftEnd The end of the left half (inclusive)
	 * @param {int} rightPos The start of the right half (inclusive)
	 * @param {int} rightEnd The end of the right half (inclusive)
	 */
	function merge(data, tempArray, leftPos, leftEnd, rightPos, rightEnd) {
		var tempPos = leftPos,
			arraySize = rightEnd - leftPos + 1,
			i = 0;
		
		// compare and copy smaller item into temporary array
		while (leftPos <= leftEnd && rightPos <= rightEnd) {
			if (ns.comparator(data[leftPos], data[rightPos]) <= 0) {
				tempArray[tempPos++] = data[leftPos++];
			} else {
				tempArray[tempPos++] = data[rightPos++];
			}
		}
		
		// copy left half if any remaining
		while (leftPos <= leftEnd) {
			tempArray[tempPos++] = data[leftPos++];
		}
		
		// copy right half if any remaining
		while (rightPos <= rightEnd) {
			tempArray[tempPos++] = data[rightPos++];
		}
		
		// copy temporary array over the main array
		while (i++ < arraySize) {
			data[rightEnd] = tempArray[rightEnd];
			rightEnd--;
		}
	}
	
	// expose public members
	ns.mergeSortRecursive = mergeSort;
}(window.SortingDemo = window.SortingDemo || {}, window.Math));

/**
 * @fileOverview MergeSortStack.js
 * 
 * Copyright (c) Jeff Bradford, 2012
 * 
 * Top-down merge sort using a stack instead of recursion
 * - Switches to insertion sort for small arrays (INSERTION_SORT_CUTOFF)
 * 
 * Usage:    var time = SortingDemo.mergeSort(integerArray);
 */
(function (ns, Math) {
	// Arrays of this size and smaller will be sorted with insertion sort
	var INSERTION_SORT_CUTOFF = 10,
		insertionSortCutoff = INSERTION_SORT_CUTOFF;
	
	/**
	 * Driver for mergeSort
	 * @param {Array} data An array of data
	 * @param {int} cutoff The cutoff limit for switching to insertionSort for small arrays
	 * @returns {int} How many milliseconds the sorting took
	 */
	function mergeSort(data, cutoff) {
		if (typeof cutoff === "number" && 4 < cutoff && cutoff < 21) {
			insertionSortCutoff = Math.floor(cutoff);
		} else {
			insertionSortCutoff = INSERTION_SORT_CUTOFF;
		}
		if (data instanceof Array) {
			var start = (new Date()).getTime();
			var tempArray = [];
			mergeSortHelper(data, tempArray, 0, data.length - 1);
			return (new Date()).getTime() - start;
		}
		return 0;
	}
	
	/**
	 * Internal method for mergeSort
	 * @param {Array} data An array of data
	 * @param {int} left The left endpoint of the interval (inclusive)
	 * @param {int} right The right endpoint of the interval (inclusive)
	 */
	function mergeSortHelper(data, tempArray, left, right) {
		/**
		 *  Stacks used for non-recursive, top-down implementation of mergesort
		 * - push/pop are inlined in the actual mergesort routine,
		 *   calling them as methods would create overhead and slow things down
		 * - sL "stackLeft" , sC "stackCenter" , sR "stackRight"
		 * - could use object literals for stacks, but array access time is faster
		 * - sC[size] === -1 if the current task is "sort", else
		 *   sC[size] >= 0 and the current task is "merge"
		 */
		var sL = [], sC = [], sR = [], size = 0,
			i, j, temp, center, rightPos, arraySize;
		sL[size] = left; // inline push "sort"
		sC[size] = -1;
		sR[size++] = right;
		while (size !== 0) {
			left = sL[--size]; // inline pop, get current task
			center = sC[size];
			right = sR[size];
			if (center === -1) {
				// current task we just popped off top of stack is "sort"
				if (right - left < insertionSortCutoff) {
					// ----- Inline Insertion Sort Helper
					i = left;
					while (++i <= right) {
						temp = data[i];
						j = i;
						while (--j >= left && temp < data[j]) {
							data[j + 1] = data[j];
						}
						data[j + 1] = temp;
					}
					// ----- END Inline Insertion Sort Helper
				} else {
					// want to recursively sort left, sort right, then merge
					// so push these commands onto stack in reverse order
					center = Math.floor(left + (right - left) / 2)
					sL[size] = left; // inline push "merge"
					sC[size] = center;
					sR[size++] = right;
					sL[size] = left; // inline push "sort"
					sC[size] = -1;
					sR[size++] = center;
					sL[size] = center + 1; // inline push "sort"
					sC[size] = -1;
					sR[size++] = right;
				}
			} else {
				// current task we just popped off top of stack is "merge"
				// ----- Inline Merge
				i = 0;
				rightPos = center + 1;
				temp = left;
				arraySize = right - left + 1;
				// compare and copy smaller item into temporary array
				while (left <= center && rightPos <= right) {
					if (data[left] <= data[rightPos]) {
						tempArray[temp++] = data[left++];
					} else {
						tempArray[temp++] = data[rightPos++];
					}
				}
				// copy left half if any remaining
				while (left <= center) {
					tempArray[temp++] = data[left++];
				}
				// copy right half if any remaining
				while (rightPos <= right) {
					tempArray[temp++] = data[rightPos++];
				}
				// copy temporary array over the main array
				while (i++ < arraySize) {
					data[right] = tempArray[right];
					right--;
				}
				// ----- END Inline Merge
			}
		}
	}
	
	// expose public members
	ns.mergeSortStack = mergeSort;
}(window.SortingDemo = window.SortingDemo || {}, window.Math));

/**
 * @fileOverview QuickSort.js
 * 
 * Copyright (c) Jeff Bradford, 2012
 * 
 * Non-recursive quicksort, highly optimized:
 * - Uses Median of 3 pivot strategy which works well on many real-world data sets
 * - Switches to insertion sort for small arrays (INSERTION_SORT_CUTOFF)
 * - Stack implementation with inline push/pop (eliminates recursive overhead)
 * - All helper methods have been inlined (eliminates function call overhead)
 * - Changed insertion sort loop/increment structure to make it execute slightly faster
 * 
 * Usage:    var time = SortingDemo.quickSort(integerArray);
 */
(function (ns, Math) {
	// Arrays of this size and smaller will be sorted with insertion sort
	var INSERTION_SORT_CUTOFF = 10,
		insertionSortCutoff = INSERTION_SORT_CUTOFF;
	
	/**
	 * Driver for quickSort
	 * @param {Array} data An array of data
	 * @param {int} cutoff The cutoff limit for switching to insertionSort for small arrays
	 * @returns {int} How many milliseconds the sorting took
	 */
	function quickSort(data, cutoff) {
		if (typeof cutoff === "number" && 4 < cutoff && cutoff < 21) {
			insertionSortCutoff = Math.floor(cutoff);
		} else {
			insertionSortCutoff = INSERTION_SORT_CUTOFF;
		}
		if (data instanceof Array) {
			var start = (new Date()).getTime();
			quickSortHelper(data, 0, data.length - 1);
			return (new Date()).getTime() - start;
		}
		return 0;
	}
	
	/**
	 * Internal method for quickSort
	 * @param {Array} data An array of data
	 * @param {int} left The left endpoint of the interval (inclusive)
	 * @param {int} right The right endpoint of the interval (inclusive)
	 */
	function quickSortHelper(data, left, right) {
		/**
		 *  Stacks used for non-recursive implementation of quicksort
		 * - push/pop are inlined in the actual quicksort routine,
		 *   calling them as methods would create overhead and slow things down
		 * - could also use object literal here
		 */
		var s1 = [], s2 = [], size = 0, i, j, temp, center, pivotValue;
		s1[size] = left; // inline push
		s2[size++] = right;
		while (size !== 0) {
			left = s1[--size]; // inline pop
			right = s2[size];
			if (right - left < insertionSortCutoff) {
				// ----- Insertion Sort Helper
				i = left;
				while (++i <= right) {
					temp = data[i];
					j = i;
					while (--j >= left && temp < data[j]) {
						data[j + 1] = data[j];
					}
					data[j + 1] = temp;
				}
				// ----- END Insertion Sort Helper
			} else {
				// ----- Median of 3 pivot
				center = Math.floor(left + (right - left) / 2);
				if (data[left] > data[center]) {
					temp = data[left];
					data[left] = data[center];
					data[center] = temp;
				}
				// place largest of 3 at far right
				if (data[center] > data[right]) {
					temp = data[center];
					data[center] = data[right];
					data[right] = temp;
				}
				// place smallest of 3 at far left
				if (data[left] > data[center]) {
					temp = data[left];
					data[left] = data[center];
					data[center] = temp;
				}
				// place pivot at right - 1
				temp = data[center];
				data[center] = data[right - 1];
				data[right - 1] = temp;
				pivotValue = data[right - 1];
				// ----- END Median of 3 pivot
				
				// ----- Partition
				i = left;
				j = right - 1;
				for (;;) {
					// advance pointer i until we find an element >= pivotValue
					// can't run out of array bounds because data[right] is sentinel provided by median3Pivot()
					// increment at least once to prevent infinite loop if data[i] = data[j] = pivot
					while (data[++i] < pivotValue) {}
					
					// advance pointer j until we find an element <= pivotValue
					// can't run out of array bounds because data[left] is sentinel provided by median3Pivot()
					// decrement at least once to prevent infinite loop if data[i] = data[j] = pivot
					while (data[--j] > pivotValue) {}
					
					if (i < j) {
						// swap two out of place elements
						temp = data[i];
						data[i] = data[j];
						data[j] = temp;
					} else {
						// exit loop when i and j pointers have crossed
						break;
					}
				}
				// swap pivot with element pointed to by i
				temp = data[i];
				data[i] = data[right - 1];
				data[right - 1] = temp;
				// ----- END Partition
				
				s1[size] = i + 1; // inline push, command to sort right half
				s2[size++] = right;
				s1[size] = left; // inline push, command to sort left half
				s2[size++] = i - 1;
			}
		}
	}
	
	// expose public members
	ns.quickSort = quickSort;
}(window.SortingDemo = window.SortingDemo || {}, window.Math));

/**
 * @fileOverview QuickSortRecursive.js
 * 
 * Copyright (c) Jeff Bradford, 2012
 * 
 * Recursive quicksort
 * - Uses Median of 3 pivot strategy which works well on many real-world data sets
 * - Switches to insertion sort for small arrays (INSERTION_SORT_CUTOFF)
 * 
 * Note: This file also exposes the public method SortingDemo.insertionSort
 * 
 * Usage:    var time = SortingDemo.quickSortRecursive(integerArray);
 */
(function (ns, Math) {
	// Arrays of this size and smaller will be sorted with insertion sort
	var INSERTION_SORT_CUTOFF = 10,
		insertionSortCutoff = INSERTION_SORT_CUTOFF;
	
	/**
	 * Driver for quickSort
	 * Uses Median of 3 pivot strategy and switches to insertionSort for small arrays
	 * Further optimization is possible by inlining some methods and
	 * writing a non-recursive implementation
	 * @param {Array} data An array of data
	 * @param {int} cutoff The cutoff limit for switching to insertionSort for small arrays
	 * @returns {int} How many milliseconds the sorting took
	 */
	function quickSort(data, cutoff) {
		if (typeof cutoff === "number" && 4 < cutoff && cutoff < 21) {
			insertionSortCutoff = Math.floor(cutoff);
		} else {
			insertionSortCutoff = INSERTION_SORT_CUTOFF;
		}
		if (data instanceof Array) {
			var start = (new Date()).getTime();
			quickSortHelper(data, 0, data.length - 1);
			return (new Date()).getTime() - start;
		}
		return 0;
	}
	
	/**
	 * Recursively sorts the array
	 * @param {Array} data An array of data
	 * @param {int} left The left endpoint of the interval (inclusive)
	 * @param {int} right The right endpoint of the interval (inclusive)
	 */
	function quickSortHelper(data, left, right) {
		if (right - left < insertionSortCutoff) {
			insertionSortHelper(data, left, right);
		} else {
			var pivotIndex = partition(data, left, right);
			quickSortHelper(data, left, pivotIndex - 1);
			quickSortHelper(data, pivotIndex + 1, right);
		}
	}
	
	/**
	 * @param {Array} data An array of data
	 * @param {int} left The left endpoint of the interval (inclusive)
	 * @param {int} right The right endpoint of the interval (inclusive)
	 * @returns the pivot index
	 */
	function partition(data, left, right) {
		var pivotValue = median3Pivot(data, left, right);
		var i = left;
		var j = right - 1;
		
		for (;;) {
			// advance pointer i until we find an element >= pivotValue
			// can't run out of array bounds because data[right] is sentinel provided by median3Pivot()
			// increment at least once to prevent infinite loop if data[i] = data[j] = pivot
			do {
				i++;
			} while (data[i] < pivotValue);
			
			// advance pointer j until we find an element <= pivotValue
			// can't run out of array bounds because data[left] is sentinel provided by median3Pivot()
			// decrement at least once to prevent infinite loop if data[i] = data[j] = pivot
			do {
				j--;
			} while (data[j] > pivotValue);
			
			if (i < j) {
				swap(data, i, j); // swap two out of place elements
			} else {
				break; // exit loop when i and j pointers have crossed
			}
		}
		
		// swap pivot with element pointed to by i
		swap(data, i, right - 1);
		return i;
	}
	
	/**
	 * @param {Array} data An array of data
	 * @param {int} left The left endpoint of the interval (inclusive)
	 * @param {int} right The right endpoint of the interval (inclusive)
	 * @returns the pivot value
	 */
	function median3Pivot(data, left, right) {
		var center = Math.floor(left + (right - left) / 2);
		if (data[left] > data[center]) {
			swap(data, left, center);
		}
		// place largest of 3 at far right
		if (data[center] > data[right]) {
			swap(data, center, right);
		}
		// place smallest of 3 at far left
		if (data[left] > data[center]) {
			swap(data, left, center);
		}
		// place pivot at right - 1
		swap(data, center, right - 1);
		return data[right - 1];
	}
	
	/**
	 * @param {Array} data An array of data
	 * @param {int} i An index for an element in the array
	 * @param {int} j An index for an element in the array
	 */
	function swap(data, i, j) {
		var temp = data[i];
		data[i] = data[j];
		data[j] = temp;
	}
	
	/**
	 * Driver for insertionSort
	 * @param {Array} data An array of data
	 * @returns {int} How many milliseconds the sorting took
	 */
	function insertionSort(data) {
		if (data instanceof Array) {
			var start = (new Date()).getTime();
			insertionSortHelper(data, 0, data.length - 1);
			return (new Date()).getTime() - start;
		}
		return 0;
	}
	
	/**
	 * Helper function: Insertion sort for small intervals
	 * @param {Array} data An array of data
	 * @param {int} left The left endpoint of the interval (inclusive)
	 * @param {int} right The right endpoint of the interval (inclusive)
	 */
	function insertionSortHelper(data, left, right) {
		var i, j, temp;
		for (i = left + 1; i <= right; i++) {
			temp = data[i];
			j = i - 1;
			while (j >= left && temp < data[j]) {
				data[j + 1] = data[j];
				j--;
			}
			data[j + 1] = temp;
		}
	}
	
	// expose public members
	ns.insertionSort = insertionSort;
	ns.quickSortRecursive = quickSort;
}(window.SortingDemo = window.SortingDemo || {}, window.Math));

/**
 * @fileOverview QuickSortStack1.js
 * 
 * Copyright (c) Jeff Bradford, 2012
 * 
 * Non-recursive quicksort, optimization #1
 * - Uses Median of 3 pivot strategy which works well on many real-world data sets
 * - Switches to insertion sort for small arrays (INSERTION_SORT_CUTOFF)
 * - Stack implementation with inline push/pop (eliminates recursive overhead)
 * 
 * Usage:    var time = SortingDemo.quickSortOptimization1(integerArray);
 */
(function (ns, Math) {
	// Arrays of this size and smaller will be sorted with insertion sort
	var INSERTION_SORT_CUTOFF = 10,
		insertionSortCutoff = INSERTION_SORT_CUTOFF;
	
	/**
	 * Driver for quickSort
	 * @param {Array} data An array of data
	 * @param {int} cutoff The cutoff limit for switching to insertionSort for small arrays
	 * @returns {int} How many milliseconds the sorting took
	 */
	function quickSort(data, cutoff) {
		if (typeof cutoff === "number" && 4 < cutoff && cutoff < 21) {
			insertionSortCutoff = Math.floor(cutoff);
		} else {
			insertionSortCutoff = INSERTION_SORT_CUTOFF;
		}
		if (data instanceof Array) {
			var start = (new Date()).getTime();
			quickSortHelper(data, 0, data.length - 1);
			return (new Date()).getTime() - start;
		}
		return 0;
	}
	
	/**
	 * Internal method for quickSort
	 * @param {Array} data An array of data
	 * @param {int} left The left endpoint of the interval (inclusive)
	 * @param {int} right The right endpoint of the interval (inclusive)
	 */
	function quickSortHelper(data, left, right) {
		/**
		 *  Stacks used for non-recursive implementation of quicksort
		 * - push/pop are inlined in the actual quicksort routine,
		 *   calling them as methods would create overhead and slow things down
		 * - could also use object literal here
		 */
		var pivotIndex, s1 = [], s2 = [], size = 0;
		s1[size] = left; // inline push
		s2[size++] = right;
		while (size !== 0) {
			left = s1[--size]; // inline pop
			right = s2[size];
			if (right - left < insertionSortCutoff) {
				insertionSortHelper(data, left, right);
			} else {
				pivotIndex = partition(data, left, right);
				s1[size] = pivotIndex + 1; // inline push, command to sort right half
				s2[size++] = right;
				s1[size] = left; // inline push, command to sort left half
				s2[size++] = pivotIndex - 1;
			}
		}
	}
	
	/**
	 * @param {Array} data An array of data
	 * @param {int} left The left endpoint of the interval (inclusive)
	 * @param {int} right The right endpoint of the interval (inclusive)
	 * @returns the pivot index
	 */
	function partition(data, left, right) {
		var i = left,
			j = right - 1,
			pivotValue = median3Pivot(data, left, right);
		
		for (;;) {
			// advance pointer i until we find an element >= pivotValue
			// can't run out of array bounds because data[right] is sentinel provided by median3Pivot()
			// increment at least once to prevent infinite loop if data[i] = data[j] = pivot
			while (data[++i] < pivotValue) {}
			
			// advance pointer j until we find an element <= pivotValue
			// can't run out of array bounds because data[left] is sentinel provided by median3Pivot()
			// decrement at least once to prevent infinite loop if data[i] = data[j] = pivot
			while (data[--j] > pivotValue) {}
			
			if (i < j) {
				// swap two out of place elements
				swap(data, i, j);
			} else {
				// exit loop when i and j pointers have crossed
				break;
			}
		}
		
		// swap pivot with element pointed to by i
		swap(data, i, right - 1);
		return i;
	}
	
	/**
	 * @param {Array} data An array of data
	 * @param {int} left The left endpoint of the interval (inclusive)
	 * @param {int} right The right endpoint of the interval (inclusive)
	 * @returns the pivot value
	 */
	function median3Pivot(data, left, right) {
		var center = Math.floor(left + (right - left) / 2);
		if (data[left] > data[center]) {
			swap(data, left, center);
		}
		// place largest of 3 at far right
		if (data[center] > data[right]) {
			swap(data, center, right);
		}
		// place smallest of 3 at far left
		if (data[left] > data[center]) {
			swap(data, left, center);
		}
		// place pivot at right - 1
		swap(data, center, right - 1);
		return data[right - 1];
	}
	
	/**
	 * @param {Array} data An array of data
	 * @param {int} i An index for an element in the array
	 * @param {int} j An index for an element in the array
	 */
	function swap(data, i, j) {
		var temp = data[i];
		data[i] = data[j];
		data[j] = temp;
	}
	
	/**
	 * Helper function: Insertion sort for small intervals
	 * @param {Array} data An array of data
	 * @param {int} left The left endpoint of the interval (inclusive)
	 * @param {int} right The right endpoint of the interval (inclusive)
	 */
	function insertionSortHelper(data, left, right) {
		var i, j, temp;
		for (i = left + 1; i <= right; i++) {
			temp = data[i];
			j = i - 1;
			while (j >= left && temp < data[j]) {
				data[j + 1] = data[j];
				j--;
			}
			data[j + 1] = temp;
		}
	}
	
	// expose public members
	ns.quickSortStack1 = quickSort;
}(window.SortingDemo = window.SortingDemo || {}, window.Math));

/**
 * @fileOverview QuickSortStack2.js
 * 
 * Copyright (c) Jeff Bradford, 2012
 * 
 * Non-recursive quicksort, optimization #2
 * - Uses Median of 3 pivot strategy which works well on many real-world data sets
 * - Switches to insertion sort for small arrays (INSERTION_SORT_CUTOFF)
 * - Stack implementation with inline push/pop (eliminates recursive overhead)
 * - swap() inside the inner loop has been inlined (eliminates some function call overhead)
 * 
 * Usage:    var time = SortingDemo.quickSortOptimization2(integerArray);
 */
(function (ns, Math) {
	// Arrays of this size and smaller will be sorted with insertion sort
	var INSERTION_SORT_CUTOFF = 10,
		insertionSortCutoff = INSERTION_SORT_CUTOFF;
	
	/**
	 * Driver for quickSort
	 * @param {Array} data An array of data
	 * @param {int} cutoff The cutoff limit for switching to insertionSort for small arrays
	 * @returns {int} How many milliseconds the sorting took
	 */
	function quickSort(data, cutoff) {
		if (typeof cutoff === "number" && 4 < cutoff && cutoff < 21) {
			insertionSortCutoff = Math.floor(cutoff);
		} else {
			insertionSortCutoff = INSERTION_SORT_CUTOFF;
		}
		if (data instanceof Array) {
			var start = (new Date()).getTime();
			quickSortHelper(data, 0, data.length - 1);
			return (new Date()).getTime() - start;
		}
		return 0;
	}
	
	/**
	 * Internal method for quickSort
	 * @param {Array} data An array of data
	 * @param {int} left The left endpoint of the interval (inclusive)
	 * @param {int} right The right endpoint of the interval (inclusive)
	 */
	function quickSortHelper(data, left, right) {
		/**
		 *  Stacks used for non-recursive implementation of quicksort
		 * - push/pop are inlined in the actual quicksort routine,
		 *   calling them as methods would create overhead and slow things down
		 * - could also use object literal here
		 */
		var pivotIndex, s1 = [], s2 = [], size = 0;
		s1[size] = left; // inline push
		s2[size++] = right;
		while (size !== 0) {
			left = s1[--size]; // inline pop
			right = s2[size];
			if (right - left < insertionSortCutoff) {
				insertionSortHelper(data, left, right);
			} else {
				pivotIndex = partition(data, left, right);
				s1[size] = pivotIndex + 1; // inline push, command to sort right half
				s2[size++] = right;
				s1[size] = left; // inline push, command to sort left half
				s2[size++] = pivotIndex - 1;
			}
		}
	}
	
	/**
	 * @param {Array} data An array of data
	 * @param {int} left The left endpoint of the interval (inclusive)
	 * @param {int} right The right endpoint of the interval (inclusive)
	 * @returns the pivot index
	 */
	function partition(data, left, right) {
		var i = left,
			j = right - 1,
			temp,
			pivotValue = median3Pivot(data, left, right);
		
		for (;;) {
			// advance pointer i until we find an element >= pivotValue
			// can't run out of array bounds because data[right] is sentinel provided by median3Pivot()
			// increment at least once to prevent infinite loop if data[i] = data[j] = pivot
			while (data[++i] < pivotValue) {}
			
			// advance pointer j until we find an element <= pivotValue
			// can't run out of array bounds because data[left] is sentinel provided by median3Pivot()
			// decrement at least once to prevent infinite loop if data[i] = data[j] = pivot
			while (data[--j] > pivotValue) {}
			
			if (i < j) {
				// swap two out of place elements
				temp = data[i];
				data[i] = data[j];
				data[j] = temp;
			} else {
				// exit loop when i and j pointers have crossed
				break;
			}
		}
		
		// swap pivot with element pointed to by i
		swap(data, i, right - 1);
		return i;
	}
	
	/**
	 * @param {Array} data An array of data
	 * @param {int} left The left endpoint of the interval (inclusive)
	 * @param {int} right The right endpoint of the interval (inclusive)
	 * @returns the pivot value
	 */
	function median3Pivot(data, left, right) {
		var center = Math.floor(left + (right - left) / 2);
		if (data[left] > data[center]) {
			swap(data, left, center);
		}
		// place largest of 3 at far right
		if (data[center] > data[right]) {
			swap(data, center, right);
		}
		// place smallest of 3 at far left
		if (data[left] > data[center]) {
			swap(data, left, center);
		}
		// place pivot at right - 1
		swap(data, center, right - 1);
		return data[right - 1];
	}
	
	/**
	 * @param {Array} data An array of data
	 * @param {int} i An index for an element in the array
	 * @param {int} j An index for an element in the array
	 */
	function swap(data, i, j) {
		var temp = data[i];
		data[i] = data[j];
		data[j] = temp;
	}
	
	/**
	 * Helper function: Insertion sort for small intervals
	 * @param {Array} data An array of data
	 * @param {int} left The left endpoint of the interval (inclusive)
	 * @param {int} right The right endpoint of the interval (inclusive)
	 */
	function insertionSortHelper(data, left, right) {
		var i, j, temp;
		for (i = left + 1; i <= right; i++) {
			temp = data[i];
			j = i - 1;
			while (j >= left && temp < data[j]) {
				data[j + 1] = data[j];
				j--;
			}
			data[j + 1] = temp;
		}
	}
	
	// expose public members
	ns.quickSortStack2 = quickSort;
}(window.SortingDemo = window.SortingDemo || {}, window.Math));

/**
 * @fileOverview QuickSortStack3.js
 * 
 * Copyright (c) Jeff Bradford, 2012
 * 
 * Non-recursive quicksort, optimization #3
 * - Uses Median of 3 pivot strategy which works well on many real-world data sets
 * - Switches to insertion sort for small arrays (INSERTION_SORT_CUTOFF)
 * - Stack implementation with inline push/pop (eliminates recursive overhead)
 * - All swap()'s have been inlined (eliminates some more function call overhead)
 * 
 * Usage:    var time = SortingDemo.quickSortOptimization3(integerArray);
 */
(function (ns, Math) {
	// Arrays of this size and smaller will be sorted with insertion sort
	var INSERTION_SORT_CUTOFF = 10,
		insertionSortCutoff = INSERTION_SORT_CUTOFF;
	
	/**
	 * Driver for quickSort
	 * @param {Array} data An array of data
	 * @param {int} cutoff The cutoff limit for switching to insertionSort for small arrays
	 * @returns {int} How many milliseconds the sorting took
	 */
	function quickSort(data, cutoff) {
		if (typeof cutoff === "number" && 4 < cutoff && cutoff < 21) {
			insertionSortCutoff = Math.floor(cutoff);
		} else {
			insertionSortCutoff = INSERTION_SORT_CUTOFF;
		}
		if (data instanceof Array) {
			var start = (new Date()).getTime();
			quickSortHelper(data, 0, data.length - 1);
			return (new Date()).getTime() - start;
		}
		return 0;
	}
	
	/**
	 * Internal method for quickSort
	 * @param {Array} data An array of data
	 * @param {int} left The left endpoint of the interval (inclusive)
	 * @param {int} right The right endpoint of the interval (inclusive)
	 */
	function quickSortHelper(data, left, right) {
		/**
		 *  Stacks used for non-recursive implementation of quicksort
		 * - push/pop are inlined in the actual quicksort routine,
		 *   calling them as methods would create overhead and slow things down
		 * - could also use object literal here
		 */
		var pivotIndex, s1 = [], s2 = [], size = 0;
		s1[size] = left; // inline push
		s2[size++] = right;
		while (size !== 0) {
			left = s1[--size]; // inline pop
			right = s2[size];
			if (right - left < insertionSortCutoff) {
				insertionSortHelper(data, left, right);
			} else {
				pivotIndex = partition(data, left, right);
				s1[size] = pivotIndex + 1; // inline push, command to sort right half
				s2[size++] = right;
				s1[size] = left; // inline push, command to sort left half
				s2[size++] = pivotIndex - 1;
			}
		}
	}
	
	/**
	 * @param {Array} data An array of data
	 * @param {int} left The left endpoint of the interval (inclusive)
	 * @param {int} right The right endpoint of the interval (inclusive)
	 * @returns the pivot index
	 */
	function partition(data, left, right) {
		var i = left,
			j = right - 1,
			temp,
			pivotValue = median3Pivot(data, left, right);
		
		for (;;) {
			// advance pointer i until we find an element >= pivotValue
			// can't run out of array bounds because data[right] is sentinel provided by median3Pivot()
			// increment at least once to prevent infinite loop if data[i] = data[j] = pivot
			while (data[++i] < pivotValue) {}
			
			// advance pointer j until we find an element <= pivotValue
			// can't run out of array bounds because data[left] is sentinel provided by median3Pivot()
			// decrement at least once to prevent infinite loop if data[i] = data[j] = pivot
			while (data[--j] > pivotValue) {}
			
			if (i < j) {
				// swap two out of place elements
				temp = data[i];
				data[i] = data[j];
				data[j] = temp;
			} else {
				// exit loop when i and j pointers have crossed
				break;
			}
		}
		
		// swap pivot with element pointed to by i
		temp = data[i];
		data[i] = data[right - 1];
		data[right - 1] = temp;
		return i;
	}
	
	/**
	 * @param {Array} data An array of data
	 * @param {int} left The left endpoint of the interval (inclusive)
	 * @param {int} right The right endpoint of the interval (inclusive)
	 * @returns the pivot value
	 */
	function median3Pivot(data, left, right) {
		var temp,
			center = Math.floor(left + (right - left) / 2);
		if (data[left] > data[center]) {
			temp = data[left];
			data[left] = data[center];
			data[center] = temp;
		}
		// place largest of 3 at far right
		if (data[center] > data[right]) {
			temp = data[center];
			data[center] = data[right];
			data[right] = temp;
		}
		// place smallest of 3 at far left
		if (data[left] > data[center]) {
			temp = data[left];
			data[left] = data[center];
			data[center] = temp;
		}
		// place pivot at right - 1
		temp = data[center];
		data[center] = data[right - 1];
		data[right - 1] = temp;
		return data[right - 1];
	}
	
	/**
	 * Helper function: Insertion sort for small intervals
	 * @param {Array} data An array of data
	 * @param {int} left The left endpoint of the interval (inclusive)
	 * @param {int} right The right endpoint of the interval (inclusive)
	 */
	function insertionSortHelper(data, left, right) {
		var i, j, temp;
		for (i = left + 1; i <= right; i++) {
			temp = data[i];
			j = i - 1;
			while (j >= left && temp < data[j]) {
				data[j + 1] = data[j];
				j--;
			}
			data[j + 1] = temp;
		}
	}
	
	// expose public members
	ns.quickSortStack3 = quickSort;
}(window.SortingDemo = window.SortingDemo || {}, window.Math));

/**
 * @fileOverview QuickSortStack4.js
 * 
 * Copyright (c) Jeff Bradford, 2012
 * 
 * Non-recursive quicksort, optimization #4
 * - Uses Median of 3 pivot strategy which works well on many real-world data sets
 * - Switches to insertion sort for small arrays (INSERTION_SORT_CUTOFF)
 * - Stack implementation with inline push/pop (eliminates recursive overhead)
 * - All helper methods have been inlined (eliminates function call overhead)
 * 
 * Usage:    var time = SortingDemo.quickSortOptimization4(integerArray);
 */
(function (ns, Math) {
	// Arrays of this size and smaller will be sorted with insertion sort
	var INSERTION_SORT_CUTOFF = 10,
		insertionSortCutoff = INSERTION_SORT_CUTOFF;
	
	/**
	 * Driver for quickSort
	 * @param {Array} data An array of data
	 * @param {int} cutoff The cutoff limit for switching to insertionSort for small arrays
	 * @returns {int} How many milliseconds the sorting took
	 */
	function quickSort(data, cutoff) {
		if (typeof cutoff === "number" && 4 < cutoff && cutoff < 21) {
			insertionSortCutoff = Math.floor(cutoff);
		} else {
			insertionSortCutoff = INSERTION_SORT_CUTOFF;
		}
		if (data instanceof Array) {
			var start = (new Date()).getTime();
			quickSortHelper(data, 0, data.length - 1);
			return (new Date()).getTime() - start;
		}
		return 0;
	}
	
	/**
	 * Internal method for quickSort
	 * @param {Array} data An array of data
	 * @param {int} left The left endpoint of the interval (inclusive)
	 * @param {int} right The right endpoint of the interval (inclusive)
	 */
	function quickSortHelper(data, left, right) {
		/**
		 *  Stacks used for non-recursive implementation of quicksort
		 * - push/pop are inlined in the actual quicksort routine,
		 *   calling them as methods would create overhead and slow things down
		 * - could also use object literal here
		 */
		var s1 = [], s2 = [], size = 0, i, j, temp, center, pivotValue;
		s1[size] = left; // inline push
		s2[size++] = right;
		while (size !== 0) {
			left = s1[--size]; // inline pop
			right = s2[size];
			if (right - left < insertionSortCutoff) {
				// ----- Insertion Sort Helper
				for (i = left + 1; i <= right; i++) {
					temp = data[i];
					j = i - 1;
					while (j >= left && temp < data[j]) {
						data[j + 1] = data[j];
						j--;
					}
					data[j + 1] = temp;
				}
				// ----- END Insertion Sort Helper
			} else {
				// ----- Median of 3 pivot
				center = Math.floor(left + (right - left) / 2);
				if (data[left] > data[center]) {
					temp = data[left];
					data[left] = data[center];
					data[center] = temp;
				}
				// place largest of 3 at far right
				if (data[center] > data[right]) {
					temp = data[center];
					data[center] = data[right];
					data[right] = temp;
				}
				// place smallest of 3 at far left
				if (data[left] > data[center]) {
					temp = data[left];
					data[left] = data[center];
					data[center] = temp;
				}
				// place pivot at right - 1
				temp = data[center];
				data[center] = data[right - 1];
				data[right - 1] = temp;
				pivotValue = data[right - 1];
				// ----- END Median of 3 pivot
				
				// ----- Partition
				i = left;
				j = right - 1;
				for (;;) {
					// advance pointer i until we find an element >= pivotValue
					// can't run out of array bounds because data[right] is sentinel provided by median3Pivot()
					// increment at least once to prevent infinite loop if data[i] = data[j] = pivot
					while (data[++i] < pivotValue) {}
					
					// advance pointer j until we find an element <= pivotValue
					// can't run out of array bounds because data[left] is sentinel provided by median3Pivot()
					// decrement at least once to prevent infinite loop if data[i] = data[j] = pivot
					while (data[--j] > pivotValue) {}
					
					if (i < j) {
						// swap two out of place elements
						temp = data[i];
						data[i] = data[j];
						data[j] = temp;
					} else {
						// exit loop when i and j pointers have crossed
						break;
					}
				}
				// swap pivot with element pointed to by i
				temp = data[i];
				data[i] = data[right - 1];
				data[right - 1] = temp;
				// ----- END Partition
				
				s1[size] = i + 1; // inline push, command to sort right half
				s2[size++] = right;
				s1[size] = left; // inline push, command to sort left half
				s2[size++] = i - 1;
			}
		}
	}
	
	// expose public members
	ns.quickSortStack4 = quickSort;
}(window.SortingDemo = window.SortingDemo || {}, window.Math));