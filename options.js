'use strict';

(function () {
	var ready = function (fn) {
		if (document.readyState !== 'loading') {
			fn();
		} else {
			document.addEventListener('DOMContentLoaded', fn);
		}
	};

	ready(function () {
		var shouldIgnoreSingleQuotesElement = document.getElementById('should_ignore_single_quotes'),
			shouldIgnoreDoubleQuotesElement = document.getElementById('should_ignore_double_quotes');

		var saveOptions = function () {
			var shouldIgnoreSingleQuotes = shouldIgnoreSingleQuotesElement.checked,
				shouldIgnoreDoubleQuotes = shouldIgnoreDoubleQuotesElement.checked;

			chrome.storage.sync.set({
				'shouldIgnoreSingleQuotes': shouldIgnoreSingleQuotes,
				'shouldIgnoreDoubleQuotes': shouldIgnoreDoubleQuotes
			});
		};

		var restoreOptions = function () {
			chrome.storage.sync.get({
				'shouldIgnoreSingleQuotes': false,
				'shouldIgnoreDoubleQuotes': false
			}, function (items) {
				shouldIgnoreSingleQuotesElement.checked = items.shouldIgnoreSingleQuotes;
				shouldIgnoreDoubleQuotesElement.checked = items.shouldIgnoreDoubleQuotes;
			});
		};

		shouldIgnoreSingleQuotesElement.addEventListener('change', saveOptions);
		shouldIgnoreDoubleQuotesElement.addEventListener('change', saveOptions);

		restoreOptions();
	});
}());
