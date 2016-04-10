'use strict';

(function () {
	var setIcon = function (statusText) {
		chrome.browserAction.setIcon({
			'path': {
				'19': `images/icon19-${statusText}.png`,
				'38': `images/icon38-${statusText}.png`
			}
		});
	};

	// Toggles the enablement of Autoquote.
	var toggle = function () {
		chrome.storage.local.get({
			'isEnabled': true
		}, function (items) {
			chrome.storage.local.set({
				'isEnabled': !items.isEnabled
			});

			var statusText = items.isEnabled ? 'disabled' : 'enabled';

			setIcon(statusText);

			chrome.tabs.query({'active': true}, function (tabs) {
				if (tabs.length > 0) {
					chrome.tabs.sendMessage(tabs[0].id, statusText);
				}
			});
		});
	};

	chrome.browserAction.onClicked.addListener(toggle);

	chrome.runtime.onInstalled.addListener(function () {
		chrome.storage.local.get({
			'isEnabled': true
		}, function (items) {
			setIcon(items.isEnabled ? 'enabled' : 'disabled');
		});
	});
}());
