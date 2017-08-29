const mysql = require('mysql');

let con;

export default () => {
	if (!con) {
		con = mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: '1234',
			database: 'wind'
		})
	}
	return con;
}

