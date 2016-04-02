'use strict';

(function () {
	var replaceSingleQuotationMarks = function (value, offset, string) {
		var leftBoundaryTester = /^(?:\s|\.|,|;|:|!|\?|\(|\[|<|{)$/,
			rightBoundaryTester = /^(?:\s|\.|,|;|:|!|\?|\)|]|>|})$/;

		/*
		 * If there is no preceding character or the preceding character is a
		 * space character, replace the apostrophe with a left single
		 * quotation mark.
		 */
		if (offset === 0 || leftBoundaryTester.test(string[offset - 1])) {
			return '‘';
		}

		/*
		 * If there is no following character or the following character is a
		 * space character, replace the apostrophe with a right single
		 * quotation mark.
		 */
		if (offset === string.length - 1 || rightBoundaryTester.test(string[offset + 1])) {
			return '’';
		}

		/*
		 * If there are two neighboring characters and neither of them are a
		 * space, replace the character in question with an apostrophe.
		 */
		return '\'';
	};

	var replaceDoubleQuotationMarks = function (value, offset, string) {
		var leftBoundaryTester = /^(?:\s|\.|,|;|:|!|\?|\(|\[|<|{)$/,
			rightBoundaryTester = /^(?:\s|\.|,|;|:|!|\?|\)|]|>|})$/;

		/*
		 * If there is no preceding character or the preceding character is a
		 * space character, replace the quotation mark with a left double
		 * quotation mark.
		 */
		if (offset === 0 || leftBoundaryTester.test(string[offset - 1])) {
			return '“';
		}

		/*
		 * If there is no following character or the following character is a
		 * space character, replace the quotation mark with a right double
		 * quotation mark.
		 */
		if (offset === string.length - 1 || rightBoundaryTester.test(string[offset + 1])) {
			return '”';
		}

		/*
		 * If there are two neighboring characters and neither of them are a
		 * space, replace the character in question with an quotation mark.
		 */
		return '"';
	};

	var singleQuotationMarkEventListener = function (event) {
		/*
		 * Changing the value of an input element causes the selection to
		 * be the end of the input, so we need to store these values and
		 * reset them after changing the value of the input element.
		 */
		var selectionStart = this.selectionStart,
			selectionEnd = this.selectionEnd;

		this.value = this.value.replace(/['‘’]/g, replaceSingleQuotationMarks);

		this.selectionStart = selectionStart;
		this.selectionEnd = selectionEnd;
	};

	var doubleQuotationMarkEventListener = function (event) {
		/*
		 * Changing the value of an input element causes the selection to
		 * be at the end of the input, so we need to store these values and
		 * reset them after changing the value of the input element.
		 */
		var selectionStart = this.selectionStart,
			selectionEnd = this.selectionEnd;

		this.value = this.value.replace(/["“”]/g, replaceDoubleQuotationMarks);

		this.selectionStart = selectionStart;
		this.selectionEnd = selectionEnd;
	};

	// When an element gains focus, add the event listeners to it.
	document.addEventListener('focusin', function (event) {
		var tagName = event.target.tagName.toUpperCase();

		if (tagName === 'INPUT' && event.target.type === 'text' || tagName === 'TEXTAREA') {
			chrome.storage.sync.get({
				'shouldIgnoreSingleQuotes': false,
				'shouldIgnoreDoubleQuotes': false
			}, function (items) {
				if (!items.shouldIgnoreSingleQuotes) {
					event.target.addEventListener(
						'input',
						singleQuotationMarkEventListener,
						{'passive': true}
					);
				}
				if (!items.shouldIgnoreDoubleQuotes) {
					event.target.addEventListener(
						'input',
						doubleQuotationMarkEventListener,
						{'passive': true}
					);
				}
			});
		}
	}, {'passive': true});

	// When an element loses focus, remove the event listeners from it.
	document.addEventListener('focusout', function (event) {
		var tagName = event.target.tagName.toUpperCase();

		if (tagName === 'INPUT' && event.target.type === 'text' || tagName === 'TEXTAREA') {
			event.target.removeEventListener(
				'input',
				singleQuotationMarkEventListener,
				{'passive': true}
			);
			event.target.removeEventListener(
				'input',
				doubleQuotationMarkEventListener,
				{'passive': true}
			);
		}
	}, {'passive': true});
}());
