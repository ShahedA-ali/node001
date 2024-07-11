const db = require("../db");
const Role = require("./Role");

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

exports.findMany = async({id = 0, username = null, email = null}) => {
	try {
		const users = await db.query(`SELECT * FROM users;`)
		return users.rows
	} catch (error) {
		return error
	}
}

exports.create = async ({username = null, email = null, password = null}) => {
	try {
		if (!username || !email || !password) {
			return Error('Provide all credintials!')
		}
		const newUser = await db.query(`INSERT INTO users(username, password, email) VALUES('${username}','${password}','${email}')`);

		
		return newUser.rowCount
	} catch (error) {
		return error
	}
}

exports.findAndDelete = async ({id = 0, username = null, email = null}) => {
	try {
		if (!Number.isInteger(parseInt(id))) {
			return Error('id should be type Number and an Integer')
		}
		const user = await this.findOne({id, username, email})
		if (!user) {
			return Error('No user by this id')
		}
		await Role.deleteAllUserRoles({userId: user.id})
		const deleteUser = await db.query(`DELETE FROM users WHERE id = '${user.id}'`);

		return deleteUser.rowCount
	} catch (error) {
		return error
	}
}
