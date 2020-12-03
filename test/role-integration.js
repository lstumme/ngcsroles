const { expect, assert } = require('chai');
const { dbHandler } = require('ngcstesthelpers');

const RoleController = require('../controllers/rolecontroller');
const Role = require('../model/role');

describe('Role Integration', function () {
	describe('#createRole function', function () {
		let defaultRole;

		before(async () => {
			await dbHandler.connect();
			await Role.createIndexes();
		});

		after(async () => {
			await dbHandler.closeDatabase();
		});

		afterEach(async () => {
			await dbHandler.clearDatabase();
		});
		beforeEach(async () => {

		});

		it('should return an object if Role creation succeed', function (done) {
			const req = {
				body: {
					name: 'defaultName',
					label: 'defaultLabel',
				}
			};

			const res = {
				statusCode: 0,
				jsonObject: {},
				status: function (code) {
					this.statusCode = code;
					return this;
				},
				json: function (value) {
					this.jsonObject = value;
					return this;
				}
			};

			RoleController.createRole(req, res, () => { })
				.then(() => {
					expect(res).to.have.property('statusCode', 201);
					expect(res.jsonObject).to.have.property('message', 'Role created');
					expect(res.jsonObject.data).to.have.ownProperty('roleId');
					expect(res.jsonObject.data).to.have.property('name', req.body.name);
					expect(res.jsonObject.data).to.have.property('label', req.body.label);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});
	});

	describe('#deleteRole function', function () {
		let defaultRole;

		before(async () => {
			await dbHandler.connect();
			await Role.createIndexes();
		});

		after(async () => {
			await dbHandler.closeDatabase();
		});

		afterEach(async () => {
			await dbHandler.clearDatabase();
		});

		beforeEach(async () => {
			defaultRole = Role({
				name: 'defaultName',
				label: 'defaultLabel',
			});
			defaultRole = await defaultRole.save();

		});

		it('should return a roleId if Role deletion succeed', function (done) {
			const req = {
				body: {
					roleId: defaultRole._id.toString(),
				}
			}
			const res = {
				statusCode: 0,
				jsonObject: {},
				status: function (code) {
					this.statusCode = code;
					return this;
				},
				json: function (value) {
					this.jsonObject = value;
					return this;
				}
			};

			RoleController.deleteRole(req, res, () => { })
				.then(result => {
					expect(res).to.have.property('statusCode', 200);
					expect(res.jsonObject).to.have.property('message', 'Role deleted');
					expect(res.jsonObject.data).to.have.property('roleId', req.body.roleId)
					done();
				})
				.catch(err => {
					console.log(err);
					done();
				});
		});


	});

	describe('#getRoles function', function () {
		let defaultRole;

		before(async () => {
			await dbHandler.connect();
			await Role.createIndexes();
		});

		after(async () => {
			await dbHandler.closeDatabase();
		});

		afterEach(async () => {
			await dbHandler.clearDatabase();
		});

		beforeEach(async () => {

			for (let i = 0; i < 20; i++) {
				const role = new Role({
					name: 'Name_' + i,
					label: 'Label_' + i,
				});
				await role.save();
			}
		});

		it('should return an array if request succeed', function (done) {
			const req = {
				query: {
					page: '1',
					perPage: '10'
				}
			}
			const res = {
				statusCode: 0,
				jsonObject: {},
				status: function (code) {
					this.statusCode = code;
					return this;
				},
				json: function (value) {
					this.jsonObject = value;
					return this;
				}
			};

			RoleController.getRoles(req, res, () => { })
				.then(result => {
					expect(res).to.have.property('statusCode', 200);
					expect(res.jsonObject.roles).to.have.lengthOf(10);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});
	});

	describe('#getRole function', function () {
		let defaultRole;

		before(async () => {
			await dbHandler.connect();
			await Role.createIndexes();
		});

		after(async () => {
			await dbHandler.closeDatabase();
		});

		afterEach(async () => {
			await dbHandler.clearDatabase();
		});

		beforeEach(async () => {
			defaultRole = Role({
				name: 'defaultName',
				label: 'defaultLabel',
			});
			defaultRole = await defaultRole.save();

		});

		it('should return an object if request succeed', function (done) {
			const req = {
				query: {
					roleId: defaultRole._id.toString(),
				}
			}
			const res = {
				statusCode: 0,
				jsonObject: {},
				status: function (code) {
					this.statusCode = code;
					return this;
				},
				json: function (value) {
					this.jsonObject = value;
					return this;
				}
			};

			RoleController.getRole(req, res, () => { })
				.then(result => {
					expect(res).to.have.property('statusCode', 200);
					expect(res.jsonObject).to.have.property('roleId', defaultRole._id.toString());
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

	});

	describe('#findRoleByName function', function () {
		let defaultRole;

		before(async () => {
			await dbHandler.connect();
			await Role.createIndexes();
		});

		after(async () => {
			await dbHandler.closeDatabase();
		});

		afterEach(async () => {
			await dbHandler.clearDatabase();
		});

		beforeEach(async () => {
			defaultRole = Role({
				name: 'defaultName',
				label: 'defaultLabel',
			});
			defaultRole = await defaultRole.save();

		});

		it('should return an object if request succeed', function (done) {
			const req = {
				query: {
					name: 'defaultName',
				}
			}
			const res = {
				statusCode: 0,
				jsonObject: {},
				status: function (code) {
					this.statusCode = code;
					return this;
				},
				json: function (value) {
					this.jsonObject = value;
					return this;
				}
			};

			RoleController.findRoleByName(req, res, () => { })
				.then(result => {
					expect(res).to.have.property('statusCode', 200);
					expect(res.jsonObject).to.have.property('roleId', defaultRole._id.toString());
					expect(res.jsonObject).to.have.property('name', 'defaultName');
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});
	});

	describe('#findRoleByLabel function', function () {
		let defaultRole;

		before(async () => {
			await dbHandler.connect();
			await Role.createIndexes();
		});

		after(async () => {
			await dbHandler.closeDatabase();
		});

		afterEach(async () => {
			await dbHandler.clearDatabase();
		});

		beforeEach(async () => {
			defaultRole = Role({
				name: 'defaultName',
				label: 'defaultLabel',
			});
			defaultRole = await defaultRole.save();

		});

		it('should return an object if request succeed', function (done) {
			const req = {
				query: {
					label: 'defaultLabel',
				}
			}
			const res = {
				statusCode: 0,
				jsonObject: {},
				status: function (code) {
					this.statusCode = code;
					return this;
				},
				json: function (value) {
					this.jsonObject = value;
					return this;
				}
			};

			RoleController.findRoleByLabel(req, res, () => { })
				.then(result => {
					expect(res).to.have.property('statusCode', 200);
					expect(res.jsonObject).to.have.property('roleId', defaultRole._id.toString());
					expect(res.jsonObject).to.have.property('label', 'defaultLabel');
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});
	});


	describe('#addSubRoleToRole function', function () {
		let defaultRole;

		let innerRole;
		before(async () => {
			await dbHandler.connect();
			await Role.createIndexes();
		});

		after(async () => {
			await dbHandler.closeDatabase();
		});

		afterEach(async () => {
			await dbHandler.clearDatabase();
		});

		beforeEach(async () => {
			defaultRole = Role({
				name: 'defaultName',
				label: 'defaultLabel',
			});
			defaultRole = await defaultRole.save();

			innerRole = Role({
				name: 'innerName',
				label: 'innerLabel',
			});
			innerRole = await innerRole.save();

		});

		it('should return an object if request succeed', function (done) {
			const req = {
				body: {
					roleId: defaultRole._id.toString(),
					subRoleId: innerRole._id.toString(),
				}
			}
			const res = {
				statusCode: 0,
				jsonObject: {},
				status: function (code) {
					this.statusCode = code;
					return this;
				},
				json: function (value) {
					this.jsonObject = value;
					return this;
				}
			};

			RoleController.addSubRoleToRole(req, res, () => { })
				.then(() => {
					expect(res).to.have.property('statusCode', 200);
					expect(res.jsonObject).to.have.property('message', 'subRole added');
					expect(res.jsonObject.data).to.have.property('roleId', defaultRole._id.toString());
					expect(res.jsonObject.data).to.have.ownProperty('subRoles');
					expect(res.jsonObject.data.subRoles.length).to.be.equal(1);
					expect(res.jsonObject.data.subRoles.includes(innerRole._id.toString())).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});
	});
	describe('#removeSubRoleFromRole function', function () {
		let defaultRole;

		let innerRole;
		before(async () => {
			await dbHandler.connect();
			await Role.createIndexes();
		});

		after(async () => {
			await dbHandler.closeDatabase();
		});

		afterEach(async () => {
			await dbHandler.clearDatabase();
		});

		beforeEach(async () => {
			defaultRole = Role({
				name: 'defaultName',
				label: 'defaultLabel',
			});
			defaultRole = await defaultRole.save();

			innerRole = Role({
				name: 'innerName',
				label: 'innerLabel',
			});
			innerRole = await innerRole.save();


			defaultRole.subRoles.push(innerRole._id);
			defaultRole = await defaultRole.save();
		});

		it('should return an object if request succeed', function (done) {
			const req = {
				body: {
					roleId: defaultRole._id.toString(),
					subRoleId: innerRole._id.toString(),
				}
			}
			const res = {
				statusCode: 0,
				jsonObject: {},
				status: function (code) {
					this.statusCode = code;
					return this;
				},
				json: function (value) {
					this.jsonObject = value;
					return this;
				}
			};

			RoleController.removeSubRoleFromRole(req, res, () => { })
				.then(result => {
					expect(res).to.have.property('statusCode', 200);
					expect(res.jsonObject).to.have.property('message', 'subRole removed');
					expect(res.jsonObject.data).to.have.property('roleId', defaultRole._id.toString());
					expect(res.jsonObject.data).to.have.ownProperty('subRoles');
					expect(res.jsonObject.data.subRoles.length).to.be.equal(0);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

	});


});
