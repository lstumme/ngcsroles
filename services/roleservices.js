const Role = require('../model/role');

const convertRole2Object = r => {
	return {
		roleId: r._id.toString(),
		name: r.name,
		label: r.label,
		subRoles: r.subRoles.map(el => { return el.toString() }),
	};
};

exports.createRole = async ({ name, label }) => {
	const role = new Role({
		name: name,
		label: label,
	});
	return role.save().then(r => {
		return convertRole2Object(r);
	});
};


exports.deleteRole = async ({ roleId }) => {
	return Role.exists({ _id: roleId })
		.then(result => {
			if (!result) {
				const error = new Error('Role to delete was not found');
				error.statusCode = 404;
				throw error;
			}
			return result;
		})
		.then(() => {
			return Role.deleteOne({ _id: roleId })
				.then(() => {
					return { roleId };
				})
		});
};

exports.getRoles = async ({ page, perPage }) => {
	return Role.countDocuments()
		.then(count => {
			const pageCount = Math.trunc(count / perPage) + (count % perPage > 0 ? 1 : 0);
			if (count <= perPage * (page - 1) || (perPage * (page - 1) < 0)) {
				const error = new Error('Pagination out of bounds.');
				error.statusCode = 400;
				throw error;
			}
			return Role.find().skip((page - 1) * perPage).limit(Number.parseInt(perPage))
				.then(result => {
					return {
						roles: result.map(r => { return convertRole2Object(r); }),
						pageCount: pageCount
					};
				})
		});
};

exports.getRole = async ({ roleId }) => {
	return Role.findOne({ _id: roleId })
		.then(role => {
			if (!role) {
				const error = new Error('Role not found');
				error.statusCode = 404;
				throw error;
			}
			return convertRole2Object(role);
		})
};

exports.addSubRoleToRole = async ({ roleId, subRoleId }) => {
	return Role.findOne({ _id: roleId })
		.then(role => {
			if (!role) {
				const error = new Error('Role not found');
				error.statusCode = 404;
				throw error;
			}
			return role;
		})
		.then(role => {
			return Role.findOne({ _id: subRoleId })
				.then(subRoleToAdd => {
					if (!subRoleToAdd) {
						const error = new Error('Role to add not found');
						error.statusCode = 404;
						throw error;
					}
					const roleObject = convertRole2Object(role);
					const index = roleObject.subRoles.indexOf(subRoleId);
					if (index >= 0) {
						const error = new Error('Role already in subRoles');
						error.statusCode = 400;
						throw error;
					}
					role.subRoles.push(subRoleId);
					return role.save()
						.then((finalRole) => {
							return convertRole2Object(finalRole);
						})
				})
		})
};

exports.removeSubRoleFromRole = async ({ roleId, subRoleId }) => {
	return Role.findOne({ _id: roleId })
		.then(role => {
			if (!role) {
				const error = new Error('Role not found');
				error.statusCode = 404;
				throw error;
			}
			return role;
		})
		.then(role => {
			return Role.findOne({ _id: subRoleId })
				.then(roleToRemove => {
					if (!roleToRemove) {
						const error = new Error('Role to remove not found');
						error.statusCode = 404;
						throw error;
					}
					const roleObject = convertRole2Object(role);
					const index = roleObject.subRoles.indexOf(subRoleId);
					if (index < 0) {
						const error = new Error('Role not in subRoles');
						error.statusCode = 400;
						throw error;
					}
					role.subRoles.splice(index, 1);
					return role.save()
						.then((finalRole) => {
							return convertRole2Object(finalRole);
						})
				})
		})
};


exports.findRoleByName = async ({ name }) => {
	return Role.findOne({ name: name })
		.then(role => {
			if (!role) {
				const error = new Error('Could not find Role');
				error.statusCode = 404;
				throw error;
			}
			return convertRole2Object(role);
		});
};

exports.findRoleByLabel = async ({ label }) => {
	return Role.findOne({ label: label })
		.then(role => {
			if (!role) {
				const error = new Error('Could not find Role');
				error.statusCode = 404;
				throw error;
			}
			return convertRole2Object(role);
		});
};



