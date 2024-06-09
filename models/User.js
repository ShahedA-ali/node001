const db = require("../db");

exports.findOne = async ({ id = 0, username = null, email = null }) => {
	try {
		if (!Number.isInteger(parseInt(id))) {
			return Error('id should be type Number and an Integer')
		}
		const user = await db.query(`SELECT * FROM users WHERE id = '${id}' or email = '${email}' or username = '${username}'`);
		if (user.rowCount > 1) {
			return Error('findOne() is for returning only one record. \n More than one record found! \n ')
		}
		return user.rows[0]
	} catch (error) {
		return error
	}

}
