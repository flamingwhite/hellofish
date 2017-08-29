const express = require('express');
const {tableQuery} = require('littlefish')
const getConnection = require('../database/connection');

const contactsQuery = tableQuery(getConnection(), 'contacts');

const route = express.Router();

route.get('/', (req, res) => {
	contactsQuery.select().then(contacts => {
		console.log('received contacts', contacts);
		res.send(contacts);
	})
});

route.post('/', (req, res) => {
	
	
})