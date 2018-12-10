'use strict';

(function () {
	const replaceSingleQuotationMarks = function (value, offset, string) {
		const leftBoundaryTester  = /^(?:\s|\(|\[|<|{)$/,
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

	const replaceDoubleQuotationMarks = function (value, offset, string) {
		const leftBoundaryTester  = /^(?:\s|\(|\[|<|{)$/,
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

	const singleQuotationMarkEventListener = function () {
		/*
		 * Changing the value of an input element causes the selection to
		 * be the end of the input, so we need to store these values and
		 * reset them after changing the value of the input element.
		 */
		const selectionStart = this.selectionStart,
		      selectionEnd   = this.selectionEnd;

		this.value = this.value.replace(/['‘’]/g, replaceSingleQuotationMarks);

		this.selectionStart = selectionStart;
		this.selectionEnd = selectionEnd;
	};

	const doubleQuotationMarkEventListener = function () {
		/*
		 * Changing the value of an input element causes the selection to
		 * be at the end of the input, so we need to store these values and
		 * reset them after changing the value of the input element.
		 */
		const selectionStart = this.selectionStart,
		      selectionEnd   = this.selectionEnd;

		this.value = this.value.replace(/["“”]/g, replaceDoubleQuotationMarks);

		this.selectionStart = selectionStart;
		this.selectionEnd   = selectionEnd;
	};

	const addEventListeners = function (element) {
		const tagName = element.tagName.toUpperCase();

		if (tagName === 'INPUT' && element.type === 'text' || tagName === 'TEXTAREA') {
			chrome.storage.local.get({
				'isEnabled': true
			}, function (items) {
				/*
				 * Don't add any event listeners if Autoquote has been disabled
				 * through the browser action.
				 */
				if (!items.isEnabled) {
					return;
				}

				chrome.storage.sync.get({
					'shouldIgnoreSingleQuotationMarks': false,
					'shouldIgnoreDoubleQuotationMarks': false
				}, function (items) {
					/*
					 * Add an event listener if single quotation marks should
					 * be replaced.
					 */
					if (!items.shouldIgnoreSingleQuotationMarks) {
						element.addEventListener(
							'input',
							singleQuotationMarkEventListener,
							{'passive': true}
						);
					}

					/*
					 * Add an event listener if double quotation marks should
					 * be replaced.
					 */
					if (!items.shouldIgnoreDoubleQuotationMarks) {
						element.addEventListener(
							'input',
							doubleQuotationMarkEventListener,
							{'passive': true}
						);
					}
				});
			});
		}
	};

	const removeEventListeners = function (element) {
		/*
		 * Note: If an event listener wasn't added, removeEventListener
		 * silently does nothing. That is, we don't need to add logic tests
		 * before attempting to remove an event listener.
		 */
		element.removeEventListener(
			'input',
			singleQuotationMarkEventListener,
			{'passive': true}
		);
		element.removeEventListener(
			'input',
			doubleQuotationMarkEventListener,
			{'passive': true}
		);
	};

	// When an element gains focus, add the event listeners to it.
	document.addEventListener('focusin', function (event) {
		addEventListeners(event.target);
	}, {'passive': true});

	// When an element loses focus, remove the event listeners from it.
	document.addEventListener('focusout', function (event) {
		removeEventListeners(event.target);
	}, {'passive': true});

	// Listen for messages sent from the browser action.
	chrome.runtime.onMessage.addListener(function (request) {
		// Don't make any changes if there is no active element.
		if (document.activeElement === null || document.activeElement === document.body) {
			return;
		}

		if (request === 'disabled') {
			removeEventListeners(document.activeElement);
		} else if (request === 'enabled') {
			addEventListeners(document.activeElement);
		}
	});
}());
