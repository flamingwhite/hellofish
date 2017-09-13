'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.tagChangeLog = exports.contactChangeLog = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _fireConfig = require('./fireConfig');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logDateChange = function logDateChange(params) {
	if (!params.scheme) {
		console.warn('LOG DATE CHANGE FAILED, no scheme or no data');
		return;
	}
	var now = new Date();
	return _fireConfig.admin.database().ref('/eventLogs').push((0, _extends3.default)({}, params, {
		time: now.getTime(),
		timeStr: now.toString()
	}));
};

var contactChangeLog = exports.contactChangeLog = _fireConfig.functions.database.ref('/contacts/{cid}').onWrite(function (event) {

	var data = event.data.val();
	var prev = event.data.previous.val();
	console.log('current contact', data, 'prev,', prev);

	return logDateChange({
		scheme: 'contacts',
		data: data,
		prev: prev
	});
});

var tagChangeLog = exports.tagChangeLog = _fireConfig.functions.database.ref('/contactTags/{tid}').onWrite(function (event) {

	var data = event.data.val();
	var prev = event.data.previous.val();
	console.log('current tag', data, 'prev,', prev);

	return logDateChange({
		scheme: 'contactTags',
		data: data,
		prev: prev
	});
});