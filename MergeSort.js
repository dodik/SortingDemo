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