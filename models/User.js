const db = require("../db");
const Role = require("./Role");
const crypto = require('crypto')

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

exports.findMany = async ({ id = 0, username = null, email = null }) => {
	try {
		const users = await db.query(`SELECT * FROM users;`)
		return users.rows
	} catch (error) {
		return error
	}
}

exports.create = async ({ username = null, email = null, password = null }) => {
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

exports.findAndDelete = async ({ id = 0, username = null, email = null }) => {
	try {
		if (!Number.isInteger(parseInt(id))) {
			return Error('id should be type Number and an Integer')
		}
		const user = await this.findOne({ id, username, email })
		if (!user) {
			return Error('No user by this id')
		}
		await Role.deleteAllUserRoles({ userId: user.id })
		const deleteUser = await db.query(`DELETE FROM users WHERE id = '${user.id}'`);

		return deleteUser.rowCount
	} catch (error) {
		return error
	}
}

exports.findAndUpdate = async ({ id = 0, username = null, email = null, data = {} }) => {
	if (!Number.isInteger(parseInt(id))) {
		throw new Error('id should be type Number and an Integer')
	}
	console.log(data)
	const user = await this.findOne({ id, username, email })
	if (!user) {
		throw new Error('No user by this id');
	}
	const roles = await Role.findMany({ roleName: data.roles })
	delete data.roles
	// console.log(data[password], 'alsidjfisjdfijdi')
	let updateUserQuery = []
	for (const key in data) {
		if (key === 'password' && data[key]) {
			const cryptPassword = crypto.createHash('sha256').update(data[key] + process.env.SECRET_KEY).digest('hex')
			updateUserQuery.push(` ${[key]} = '${cryptPassword}'`)
		}
		else if (data[key]) {
			updateUserQuery.push(` ${[key]} = '${data[key]}'`)
		}
	}
	const updateRoles = await Role.updateUserRoles({ user, newRoles: roles })
	console.log(updateRoles)
	if (updateUserQuery) {
		const updateUser = await db.query(`UPDATE users SET${updateUserQuery} WHERE id = ${user.id}`)
		return updateUser.rowCount
	}
	return updateRoles
	// const updateUser = await db.query(`UPDATE users SET ${data.username ? `username = ${data.username},`: ``} ${data.email ? `email = ${data.email},`: ``} ${data.password ? `username = ${data.password}`: ``} WHERE id = ${user.id}`)

}
