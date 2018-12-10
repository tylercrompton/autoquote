'use strict';

(() => {
	const ready = function (fn) {
		if (document.readyState !== 'loading') {
			fn();
		} else {
			document.addEventListener('DOMContentLoaded', fn);
		}
	};

	ready(function () {
		const shouldIgnoreSingleQuotationMarksElement = document.getElementById('should_ignore_single_quotation_marks'),
		      shouldIgnoreDoubleQuotationMarksElement = document.getElementById('should_ignore_double_quotation_marks');

		const saveOptions = function () {
			const shouldIgnoreSingleQuotationMarks = shouldIgnoreSingleQuotationMarksElement.checked,
			      shouldIgnoreDoubleQuotationMarks = shouldIgnoreDoubleQuotationMarksElement.checked;

			chrome.storage.sync.set({
				'shouldIgnoreSingleQuotationMarks': shouldIgnoreSingleQuotationMarks,
				'shouldIgnoreDoubleQuotationMarks': shouldIgnoreDoubleQuotationMarks
			});
		};

		const restoreOptions = function () {
			chrome.storage.sync.get({
				'shouldIgnoreSingleQuotationMarks': false,
				'shouldIgnoreDoubleQuotationMarks': false
			}, function (items) {
				shouldIgnoreSingleQuotationMarksElement.checked = items.shouldIgnoreSingleQuotationMarks;
				shouldIgnoreDoubleQuotationMarksElement.checked = items.shouldIgnoreDoubleQuotationMarks;
			});
		};

		shouldIgnoreSingleQuotationMarksElement.addEventListener('change', saveOptions);
		shouldIgnoreDoubleQuotationMarksElement.addEventListener('change', saveOptions);

		restoreOptions();
	});
})();
