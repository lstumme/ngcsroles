const Role = require('../model/role');
const { id2Strings } = require('ngcshelpers');

const convertRole2Object = r => {
    return {
        roleId: r._id.toString(),
        name: r.name,
        label: r.label,
        subRoles: r.subRoles
    }
}

exports.createRole = async ({ name, label }) => {
    return Role.findOne({ name })
        .then(existingRole => {
            if (existingRole) {
                const error = new Error(`Role ${name} already exists`);
                error.statusCode = 409;
                throw error;
            }
            const role = new Role({ name, label });
            return role.save().then(r => {
                return convertRole2Object(r);
            }
            )
        })
}

exports.deleteRole = async ({ roleId }) => {
    return Role.findOne({ _id: roleId })
        .then(role => {
            if (!role) {
                const error = new Error('Could not find role.')
                error.statusCode = 404;
                throw error;
            }
            return role.remove()
                .then(result => {
                    return { roleId: role._id.toString() };
                })
        })
}

exports.getRole = async ({ roleId }) => {
    return Role.findOne({ _id: roleId })
        .then(role => {
            if (!role) {
                const error = new Error('Role not found.')
                error.statusCode = 404;
                throw error;
            }
            return convertRole2Object(role);
        })
}

exports.findRole = async ({ name }) => {
    return Role.findOne({ name: name })
        .then(role => {
            if (!role) {
                const error = new Error('Role not found.')
                error.statusCode = 404;
                throw error;
            }
            return convertRole2Object(role);
        })
}

exports.getRoles = async ({ page, perPage }) => {
    return Role.countDocuments()
        .then(count => {
            const pageCount = Math.trunc(count / perPage) + (count % perPage > 0 ? 1 : 0);
            if (count <= perPage * (page - 1) || (perPage * (page - 1) < 0)) {
                const error = new Error('Pagination out of bounds.');
                error.statusCode = 400;
                throw error;
            }
            return Role.find().skip((page - 1) * perPage).limit(perPage)
                .select('_id name label')
                .then(roles => {
                    return {
                        roles: roles.map(element => { return convertRole2Object(element) }),
                        pageCount: pageCount
                    };
                })
        });
};

exports.addSubRoleToRole = async ({ parentRoleId, subRoleId }) => {
    return Role.findOne({ _id: parentRoleId })
        .then(parentRole => {
            if (!parentRole) {
                const error = new Error('Could not find parent role.');
                error.statusCode = 404;
                throw error;
            }
            return Role.findOne({ _id: subRoleId })
                .then(subRole => {
                    if (!subRole) {
                        const error = new Error('Could not find subRole.');
                        error.statusCode = 404;
                        throw error;
                    }
                    if(parentRole.subRoles.includes(subRoleId)) {
                        const error = new Error('Role already in role.');
                        error.statusCode = 400;
                        throw error;
                    }
                    parentRole.subRoles.push(subRoleId);
                    return parentRole.save().then(newRole => {
                        return convertRole2Object(newRole);
                    })
                })
        })
}

exports.removeSubRoleFromRole = async ({ parentRoleId, subRoleId }) => {
    return Role.findOne({ _id: parentRoleId })
        .then(parentRole => {
            if (!parentRole) {
                const error = new Error('Could not find parent role.');
                error.statusCode = 404;
                throw error;
            }
            return Role.findOne({ _id: subRoleId })
                .then(subRole => {
                    if (!subRole) {
                        const error = new Error('Could not find sub role.');
                        error.statusCode = 404;
                        throw error;
                    }
                    if (!parentRole.subRoles.includes(subRoleId)) {
                        const error = new Error('Role not in role.');
                        error.statusCode = 400;
                        throw error;
                    }
                    const index = parentRole.subRoles.indexOf(subRoleId);
                    parentRole.subRoles.splice(index, 1);
                    return parentRole.save().then(newRole => {
                        return convertRole2Object(newRole);
                    })
                })
        })
};

exports.updateRoleInformations = async ({ roleId, name, label }) => {
    return Role.findOne({ _id: roleId })
        .then(role => {
            if (!role) {
                const error = new Error('Could not find role.');
                error.statusCode = 404;
                throw error;
            }
            if (name) role.name = name;
            if (label) role.label = label;
            return role.save().then(r => { return convertRole2Object(r) });
        });
}

