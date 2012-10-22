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