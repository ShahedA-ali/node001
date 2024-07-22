const db = require("../db");
const User = require('./User')

// 1- find users roles by passing users id to function
exports.findMany = async ({ userId = 0, roleName}) => {
	try {
		if (!Number.isInteger(parseInt(userId))) {
			return Error('id should be type Number and an Integer')
		}

		let roles;

        // to find users roles by userId parameter
		if (userId) {
			roles = await db.query(`SELECT roles.role_name, roles.id FROM user_roles INNER JOIN roles ON user_roles.role_id = roles.id WHERE user_roles.user_id = '${userId}';`)
		}

		// to select all roles
		// there should be no parameter passed to findMany
		if (!userId && !roleName) {
			roles = await db.query(`SELECT role_name FROM roles;`)
		}

		if (!userId && roleName.length > 0){
			const query = `SELECT * FROM roles WHERE role_name = ANY($1)`;
			roles = await db.query(query, [roleName]);
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
		const newRole = await db.query(`INSERT INTO roles(role_name, role_detail) VALUES('${roleName}','${roleDetail}');`);

		
		return newRole.rowCount
	} catch (error) {
		return error
	}
}

exports.get = async ({roleName = null, id = 0}) => {
	try {

		const roles = await db.query(`SELECT * FROM roles ${!roleName && !id ? ';': `WHERE role_name = '${roleName}' or id = ${id};`}`);

		return {count: roles.rowCount, roles: roles.rows}
	} catch (error) {
		return error
	}
}

exports.deleteManyUserRoles = async ({userId = 0, roleId = []}) => {
	console.log(userId, roleId)
	try {
		if (!userId || !roleId.length > 0) {
			return Error('Provide all credintials!');
		}
		const query = `DELETE FROM user_roles WHERE user_id = ${userId} AND role_id = ANY($1)`;
		const deleteRoles = await db.query(query, [roleId])

		return deleteRoles.rowCount
	} catch (error) {
		console.log(error)
		return error
	}
}

exports.addManyUserRoles = async ({userId = 0, roleId = []}) => {
	console.log(userId, roleId)
	try {
		if (!userId || !roleId.length > 0) {
			return Error('Provide all credintials!');
		}
		const addRoles = await db.query(`INSERT INTO user_roles(user_id, role_id) VALUES${roleId.map(id => (` ('${userId}', '${id}')`))};`);

		return addRoles.rowCount
	} catch (error) {
		console.log(error)
		return error
	}
}

exports.deleteAllUserRoles = async ({userId = 0}) => {
	try {
		if (!userId) {
			return Error('Provide a user id!');
		}
		const deleteRoles = await db.query(`DELETE FROM user_roles WHERE user_id ='${userId}'`);
		return deleteRoles.rowCount
	} catch (error) {
		return error
	}
}

exports.userRoles = async ({user, roles}) => {
	try {
		if (!user || !roles.length > 0) {
			return Error('Please provide roles for the user.')
		}

		const query = `SELECT * FROM roles WHERE role_name = ANY($1)`;
		const rolesId = await db.query(query, [roles]);

		return rolesId.rows
		
	} catch (error) {
		
	}
};

exports.updateUserRoles = async ({user, newRoles}) => {

	try {
	
		/* newRoles should be in this format
		"roles": [
					{
						"id": 1,
						"role_name": "ADMIN",
						"role_detail": "Can perform every role"
					},
					{
						"id": 2,
						"role_name": "DEC_REF_YER",
						"role_detail": ""
					}, */
	
		if (!username || !newRoles) {
			return Error('Please provide a username and roles array for the username.')
		}
	
		// const user = await User.findOne({ username });
		// console.log(user)
		// if (!user || !Array.isArray(roles)) {
		// 	return Error('Provide valid credintials!')
		// }
	
	
		const allRoles = await this.findMany({}).then(res => res.roles.map(role => role.role_name));
		for (let index = 0; index < newRoles.length; index++) {
			if (!allRoles.includes(newRoles[index].role_name)) {
				return Error(`<<${newRoles[index].role_name}>> is not a valid role!`)
			}
		}
	
		const userRoles = await this.findMany({ userId: user.id }).then(res => res.roles.map(role => role.id));
		const userRolesSet = new Set(userRoles);
		const newRolesSet = new Set(newRoles.map(role => role.id));
	
		console.log(userRolesSet, newRolesSet)
	
		const rolesToDelete = userRolesSet.difference(newRolesSet)
		const rolesToAdd = newRolesSet.difference(userRolesSet)
		console.log(user.id, [...rolesToDelete])
		const deleteRolesFromUser = await this.deleteManyUserRoles({userId: user.id, roleId: [...rolesToDelete]});
		const addRolesToUser = await this.addManyUserRoles({userId: user.id, roleId: [...rolesToAdd]});
	
		// res.json({ success: true, result: {update: {delete: deleteRolesFromUser, add: addRolesToUser}} })
		return {delete: deleteRolesFromUser, add: addRolesToUser}
		
	} catch (error) {
		return error
	}

}