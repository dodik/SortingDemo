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