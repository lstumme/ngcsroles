const RoleServices = require('../services/roleservices');

exports.createRole = async (req, res, next) => {
	const name = req.body.name;	
	const label = req.body.label;	
	if (!name || !label) {        
		const error = new Error('Bad arguments');
        error.statusCode = 400;
        next(error);
		return null;
	};

	return RoleServices.createRole({ name, label})        
		.then(response => {
            res.status(201).json({ message: 'Role created', data: response });
            return null;
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
			return null;
        });
};


exports.deleteRole = async (req, res, next) => {
	const roleId = req.body.roleId;
	if (!roleId) {
        const error = new Error('Bad arguments');
        error.statusCode = 400;
        next(error);	
		return null;
	}

	return RoleServices.deleteRole({ roleId })
        .then(response => {
            res.status(200).json({ message: 'Role deleted', data: response });
            return null;
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
			return null;
        });
};

exports.getRoles = async (req, res, next) => {
	const page = req.query.page;
    const perPage = req.query.perPage;
    if (!page || !perPage) {
        const error = new Error('Bad arguments.');
        error.statusCode = 400;
        next(error);
		return null;
    }

    return RoleServices.getRoles({ page, perPage })
        .then(response => {
            res.status(200).json(response);
            return null;
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
			return null;
        });
};

exports.getRole = async (req, res, next) => {
	const roleId = req.body.roleId;
    if (!roleId) {
        const error = new Error('Bad arguments.');
        error.statusCode = 400;
        next(error);
		return null;
    }

    return RoleServices.getRole({ roleId })
        .then(response => {
            res.status(200).json(response);
            return null;
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
			return null;
        });
};

exports.addSubRoleToRole = async (req, res, next) => {
	const roleId = req.body.roleId;
	const subRoleId = req.body.subRoleId;
	if (!roleId || !subRoleId) {
		const error = new Error('Bad arguments.');
		error.statusCode = 400;
		next(error);
		return null;
	} 

	return RoleServices.addSubRoleToRole({ roleId: roleId, subRoleId: subRoleId })
		.then(response => {
			res.status(200).json({ message: 'subRole added', data: response });
			return null;
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
			return null;
		});
};

exports.removeSubRoleFromRole = async (req, res, next) => {
	const roleId = req.body.roleId;
	const subRoleId = req.body.subRoleId;
	if (!roleId || !subRoleId) {
		const error = new Error('Bad arguments.');
		error.statusCode = 400;
		next(error);
		return null;
	} 

	return RoleServices.removeSubRoleFromRole({ roleId: roleId, subRoleId: subRoleId })
		.then(response => {
			res.status(200).json({ message: 'subRole removed', data: response });
			return null;
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
			return null;
		});
};


exports.findRoleByName = async (req, res, next) => {
	const name = req.body.name
	if (!name) {
		const error = new Error('Bad arguments.');
		error.statusCode = 400;
		next(error);
		return null;
	}

	return RoleServices.findRoleByName({ name: name })
		.then(response => {
			res.status(200).json(response);
			return null;
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
			return null;
		});
};

exports.findRoleByLabel = async (req, res, next) => {
	const label = req.body.label
	if (!label) {
		const error = new Error('Bad arguments.');
		error.statusCode = 400;
		next(error);
		return null;
	}

	return RoleServices.findRoleByLabel({ label: label })
		.then(response => {
			res.status(200).json(response);
			return null;
		})
		.catch(err => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
			return null;
		});
};



