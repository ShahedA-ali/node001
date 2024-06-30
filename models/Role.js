const db = require("../db");

// 1- find users roles by passing users id to function
exports.findMany = async ({ userId = 0 }) => {
	try {
		if (!Number.isInteger(parseInt(userId))) {
			return Error('id should be type Number and an Integer')
		}

		let roles;

        // to find users roles by userId parameter
		if (userId) {
			roles = await db.query(`SELECT roles.role_name FROM user_roles INNER JOIN roles ON user_roles.role_id = roles.id WHERE user_roles.user_id = '${userId}';`)
		}

		// to select all roles
		// there should be no parameter passed to findMany
		if (!userId) {
			roles = await db.query(`SELECT role_name FROM roles;`)
		}
		// if (user.rowCount > 1) {
		// 	return Error('findOne() is for returning only one record. \n More than one record found! \n ')
		// }
		return {count: roles.rowCount, roles: roles.rows}
	} catch (error) {
		return error
	}

}

exports.create = async ({roleName = null, roleDetail = null}) => {
	try {
		if (!roleName || !roleDetail) {
			return Error('Provide all credintials!')
		}
		const newRole = await db.query(`INSERT INTO roles(role_name, role_detail) VALUES('${roleName}','${roleDetail}')`);

		
		return newRole.rowCount
	} catch (error) {
		return error
	}
}

exports.deleteManyUserRole = async ({})