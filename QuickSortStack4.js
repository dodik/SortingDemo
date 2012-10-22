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