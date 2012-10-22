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