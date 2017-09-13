'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.deleteTagFromContacts = exports.cleanContactTags = exports.addMessage = exports.tagChangeLog = exports.contactChangeLog = undefined;

require('babel-polyfill');

var _dataChangeLog = require('./src/dataChangeLog');

var _manageTags = require('./src/manageTags');

exports.contactChangeLog = _dataChangeLog.contactChangeLog;
exports.tagChangeLog = _dataChangeLog.tagChangeLog;
exports.addMessage = _manageTags.addMessage;
exports.cleanContactTags = _manageTags.cleanContactTags;
exports.deleteTagFromContacts = _manageTags.deleteTagFromContacts;