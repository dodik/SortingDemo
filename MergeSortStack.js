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