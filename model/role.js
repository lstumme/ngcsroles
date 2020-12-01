const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	label: { type: String, required: true, unique: true },
	subRoles: [{ type: mongoose.ObjectId, ref: 'Role' }],
});

module.exports = mongoose.model('Role', RoleSchema);

