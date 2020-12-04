const { expect, assert } = require('chai');
const sinon = require('sinon');
const RoleController = require('../controllers/rolecontroller');
const RoleServices = require('../services/roleservices');

describe('Role Controller', function () {
	describe('#createRole function', function () {
		beforeEach(function () {
			sinon.stub(RoleServices, 'createRole');
		});

		afterEach(function () {
			RoleServices.createRole.restore();
		});

		it('should call next(err) if name is not specified', function (done) {
			const req = {
				body: {
					label: 'defaultLabel', 
				}
			};
			let nextCalled = false;
			RoleController.createRole(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(result => {
					expect(nextCalled).to.be.true;
					expect(result).to.be.null;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});

		it('should call next(err) if label is not specified', function (done) {
			const req = {
				body: {
					name: 'defaultName', 
				}
			};
			let nextCalled = false;
			RoleController.createRole(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(result => {
					expect(nextCalled).to.be.true;
					expect(result).to.be.null;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
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

			RoleServices.createRole.returns(new Promise((resolve, reject) => {
				resolve({ 
					roleId: 'roleIdValue',
					name: req.body.name, 
					label: req.body.label, 
				});
			}));

			RoleController.createRole(req, res, () => { })
				.then(result => {
					expect(res).to.have.property('statusCode', 201);
					expect(res.jsonObject).to.have.property('message', 'Role created');
					expect(res.jsonObject.data).to.have.property('roleId', 'roleIdValue');
					expect(res.jsonObject.data).to.have.property('name', req.body.name); 
					expect(res.jsonObject.data).to.have.property('label', req.body.label); 
					done();				
				})
				.catch(err => {
					console.log(err);
				});		
		});
		
		it('should call next(err) adding default statusCode if not specified', function (done) {
			const req = {
				body: {
					name: 'defaultName', 
					label: 'defaultLabel', 
				}
			};

			RoleServices.createRole.returns(new Promise((resolve, reject) => {
				throw new Error('Undefined Error');
			}));
			
			let nextCalled = false;
			RoleController.createRole(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 500);
				nextCalled = true;
			})
				.then(result => {
					expect(nextCalled).to.be.true;
					expect(result).to.be.null;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});

		it('should call next(err) keeping specified statusCode', function (done) {
			const req = {
				body: {
					name: 'defaultName', 
					label: 'defaultLabel', 
				}
			};

			RoleServices.createRole.returns(new Promise((resolve, reject) => {
				const error = new Error('Undefined Error');
				error.statusCode = 400;
				throw error;
			}));

			let nextCalled = false;
			RoleController.createRole(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(result => {
					expect(nextCalled).to.be.true;
					expect(result).to.be.null;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});
	});

	describe('#deleteRole function', function () {
		beforeEach(function () {
			sinon.stub(RoleServices, 'deleteRole');
		});

		afterEach(function () {
			RoleServices.deleteRole.restore();
		});

		it('should call next(err) if role is not specified', function (done) {
			const req = {
				body: {
				}
			};

			let nextCalled = false;
		   	RoleController.deleteRole(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(result => {
					expect(nextCalled).to.be.true;
					expect(result).to.be.null;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});

	   it('should return a roleId if Role deletion succeed', function (done) {
			const req = {
				body: {
					roleId: 'roleId'
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

			RoleServices.deleteRole.returns(new Promise((resolve, reject) => {
				resolve({ roleId: req.body.roleId });
			}));

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

		it('should call next(err) adding default statusCode if not specified', function (done) {
			const req = {
				body: {
					roleId: 'roleId'
				}
			}

			RoleServices.deleteRole.returns(new Promise((resolve, reject) => {
				const error = new Error('Undefined Error');
				throw error;
			}));

			let nextCalled = false;
			RoleController.deleteRole(req, {}, (err) => { 
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 500);
				nextCalled = true;
			})
				.then(result => {
					expect(nextCalled).to.be.true;
					expect(result).to.be.null;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});

	   	it('should call next(err) keeping specified statusCode', function (done) {
			const req = {
				body: {
					roleId: 'roleId'
				}
			}

			RoleServices.deleteRole.returns(new Promise((resolve, reject) => {
				const error = new Error('Undefined Error');
				error.statusCode = 400;
				throw error;
			}));

			let nextCalled = false;
			RoleController.deleteRole(req, {}, (err) => { 
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(result => {
					expect(nextCalled).to.be.true;
					expect(result).to.be.null;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});
	});
	describe('#getRoles function', function () {
		beforeEach(function () {
			sinon.stub(RoleServices, 'getRoles');
		});

		afterEach(function () {
			RoleServices.getRoles.restore();
		});

		it('should call next(err) if no page specified', function (done) {
			const req = {
				query: {
					perPage: '20',
				}
			}
			let nextCalled = false;
			RoleController.getRoles(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

		it('should call next(err) if no perPage specified', function (done) {
			const req = {
				query: {
					page: '1',
				}
			}

			let nextCalled = false;
			RoleController.getRoles(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});


		it('should return an array if request succeed', function (done) {
			const req = {
				query: {
					page: '1',
					perPage: '10',
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
			RoleServices.getRoles.returns(new Promise((resolve, reject) => {
				resolve([
					{ roleId: 'role1' },
					{ roleId: 'role2' },
					{ roleId: 'role3' },
				]);
			}));

			RoleController.getRoles(req, res, () => { })
				.then(result => {
					expect(res).to.have.property('statusCode', 200);
					expect(res.jsonObject).to.have.lengthOf(3);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

		it('should call next(err) adding default statusCode if not specified', function (done) {
			const req = {
				query: {
					page: '1',
					perPage: '10',
				}
			}
			RoleServices.getRoles.returns(new Promise((resolve, reject) => {
				throw new Error('Undefined Error');
			}));

			let nextCalled = false;
			RoleController.getRoles(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 500);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
				});
		});

		it('should call next(err) keeping specified statusCode', function (done) {
			const req = {
				query: {
					page: '1',
					perPage: '10',
				}
			}
			RoleServices.getRoles.returns(new Promise((resolve, reject) => {
				const error = new Error('Udefined Error');
				error.statusCode = 400;
				throw error;
			}));

			let nextCalled = false;
			RoleController.getRoles(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
				});
		});		
	});
	describe('#getRole function', function () {
		beforeEach(function () {
			sinon.stub(RoleServices, 'getRole');
		});

		afterEach(function () {
			RoleServices.getRole.restore();
		});

		it('should call next(err) if no roleId specified', function (done) {
			const req = {
				query: {
				}
			}
			let nextCalled = false;
			RoleController.getRole(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});

		it('should return an object if request succeed', function (done) {
			const req = {
				query: {
					roleId: 'abc',
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
			RoleServices.getRole.returns(new Promise((resolve, reject) => {
				resolve({ roleId: 'abc' });
			}));

			RoleController.getRole(req, res, () => { })
				.then(result => {
					expect(res).to.have.property('statusCode', 200);
					expect(res.jsonObject).to.have.property('roleId', 'abc');
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

		it('should call next(err) adding default statusCode if not specified', function (done) {
			const req = {
				query: {
					roleId: 'abc',
				}
			}
			RoleServices.getRole.returns(new Promise((resolve, reject) => {
				throw new Error('Undefined Error');
			}));

			let nextCalled = false;
			RoleController.getRole(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 500);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});

		it('should call next(err) keeping specified statusCode', function (done) {
			const req = {
				query: {
					roleId: 'abc',
				}
			}
			RoleServices.getRole.returns(new Promise((resolve, reject) => {
				const error = new Error('Udefined Error');
				error.statusCode = 400;
				throw error;
			}));

			let nextCalled = false;
			RoleController.getRole(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});
	});
	describe('#findRoleByName function', function () {
		beforeEach(function () {
			sinon.stub(RoleServices, 'findRoleByName');
		});

		afterEach(function () {
			RoleServices.findRoleByName.restore();
		});

		it('should call next(err) if name is not specified', function (done) {
			const req = {
				query: {
				}
			}

			let nextCalled = false;
			RoleController.findRoleByName(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		
		});

		it('should return an object if request succeed', function (done) {
			const req = {
				query: {
					name: 'name1',
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
			RoleServices.findRoleByName.returns(new Promise((resolve, reject) => {
				resolve({ 
					roleId: 'abc',
					name: 'name1', 
				});
			}));

			RoleController.findRoleByName(req, res, () => { })
				.then(result => {
					expect(res).to.have.property('statusCode', 200);
					expect(res.jsonObject).to.have.property('roleId', 'abc');
					expect(res.jsonObject).to.have.property('name', 'name1');
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

		it('should call next(err) adding default statusCode if not specified', function (done) {
			const req = {
				query: {
					name: 'name1',
				}
			}
			RoleServices.findRoleByName.returns(new Promise((resolve, reject) => {
				throw new Error('Undefined Error');
			}));

			let nextCalled = false;
			RoleController.findRoleByName(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 500);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});

		it('should call next(err) keeping specified statusCode', function (done) {
			const req = {
				query: {
					name: 'name1',
				}
			}
			RoleServices.findRoleByName.returns(new Promise((resolve, reject) => {
				const error = new Error('Udefined Error');
				error.statusCode = 400;
				throw error;
			}));

			let nextCalled = false;
			RoleController.findRoleByName(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});
	});
	describe('#findRoleByLabel function', function () {
		beforeEach(function () {
			sinon.stub(RoleServices, 'findRoleByLabel');
		});

		afterEach(function () {
			RoleServices.findRoleByLabel.restore();
		});

		it('should call next(err) if label is not specified', function (done) {
			const req = {
				query: {
				}
			}

			let nextCalled = false;
			RoleController.findRoleByLabel(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		
		});

		it('should return an object if request succeed', function (done) {
			const req = {
				query: {
					label: 'label1',
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
			RoleServices.findRoleByLabel.returns(new Promise((resolve, reject) => {
				resolve({ 
					roleId: 'abc',
					label: 'label1', 
				});
			}));

			RoleController.findRoleByLabel(req, res, () => { })
				.then(result => {
					expect(res).to.have.property('statusCode', 200);
					expect(res.jsonObject).to.have.property('roleId', 'abc');
					expect(res.jsonObject).to.have.property('label', 'label1');
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

		it('should call next(err) adding default statusCode if not specified', function (done) {
			const req = {
				query: {
					label: 'label1',
				}
			}
			RoleServices.findRoleByLabel.returns(new Promise((resolve, reject) => {
				throw new Error('Undefined Error');
			}));

			let nextCalled = false;
			RoleController.findRoleByLabel(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 500);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});

		it('should call next(err) keeping specified statusCode', function (done) {
			const req = {
				query: {
					label: 'label1',
				}
			}
			RoleServices.findRoleByLabel.returns(new Promise((resolve, reject) => {
				const error = new Error('Udefined Error');
				error.statusCode = 400;
				throw error;
			}));

			let nextCalled = false;
			RoleController.findRoleByLabel(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});
	});

	describe('#addSubRoleToRole function', function () {
		beforeEach(function () {
			sinon.stub(RoleServices, 'addSubRoleToRole');
		});

		afterEach(function () {
			RoleServices.addSubRoleToRole.restore();
		});

		it('should call next(err) if RoleId is not specified', function (done) {
			const req = {
				body: {
					subRoleId: 'subRoleId', 
				}
			}

			let nextCalled = false;
			RoleController.addSubRoleToRole(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		
		});

		it('should call next(err) if subRoleId is not specified', function (done) {
			const req = {
				body: {
					roleId: 'roleId', 
				}
			}

			let nextCalled = false;
			RoleController.addSubRoleToRole(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		
		});

		it('should return an object if request succeed', function (done) {
			const req = {
				body: {
					roleId: 'roleId', 
					subRoleId: 'subRoleId1', 
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
			RoleServices.addSubRoleToRole.returns(new Promise((resolve, reject) => {
				resolve({ 
					roleId: 'abc',
					subRoles: ['subRoleId1'], 
				});
			}));

			RoleController.addSubRoleToRole(req, res, () => { })
				.then(result => {
					expect(res).to.have.property('statusCode', 200);
					expect(res.jsonObject).to.have.property('message', 'subRole added');
					expect(res.jsonObject.data).to.have.property('roleId', 'abc');
					expect(res.jsonObject.data.subRoles).to.have.length(1);
					expect(res.jsonObject.data.subRoles[0]).to.be.equal('subRoleId1');
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

		it('should call next(err) adding default statusCode if not specified', function (done) {
			const req = {
				body: {
					roleId: 'roleId', 
					subRoleId: 'subRoleId1', 
				}
			}
			RoleServices.addSubRoleToRole.returns(new Promise((resolve, reject) => {
				throw new Error('Undefined Error');
			}));

			let nextCalled = false;
			RoleController.addSubRoleToRole(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 500);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});

		it('should call next(err) keeping specified statusCode', function (done) {
			const req = {
				body: {
					roleId: 'roleId', 
					subRoleId: 'subRoleId1', 
				}
			}
			RoleServices.addSubRoleToRole.returns(new Promise((resolve, reject) => {
				const error = new Error('Udefined Error');
				error.statusCode = 400;
				throw error;
			}));

			let nextCalled = false;
			RoleController.addSubRoleToRole(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});
	});
	describe('#removeSubRoleFromRole function', function () {
		beforeEach(function () {
			sinon.stub(RoleServices, 'removeSubRoleFromRole');
		});

		afterEach(function () {
			RoleServices.removeSubRoleFromRole.restore();
		});

		it('should call next(err) if RoleId is not specified', function (done) {
			const req = {
				body: {
					subRoleId: 'subRoleId', 
				}
			}

			let nextCalled = false;
			RoleController.removeSubRoleFromRole(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		
		});

		it('should call next(err) if subRoleId is not specified', function (done) {
			const req = {
				body: {
					roleId: 'roleId', 
				}
			}

			let nextCalled = false;
			RoleController.removeSubRoleFromRole(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		
		});

		it('should return an object if request succeed', function (done) {
			const req = {
				body: {
					roleId: 'roleId', 
					subRoleId: 'subRoleId1', 
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
			RoleServices.removeSubRoleFromRole.returns(new Promise((resolve, reject) => {
				resolve({ 
					roleId: 'abc',
					subRoles: [], 
				});
			}));

			RoleController.removeSubRoleFromRole(req, res, () => { })
				.then(result => {
					expect(res).to.have.property('statusCode', 200);
					expect(res.jsonObject).to.have.property('message', 'subRole removed');
					expect(res.jsonObject.data).to.have.property('roleId', 'abc');
					expect(res.jsonObject.data.subRoles).to.have.length(0);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

		it('should call next(err) adding default statusCode if not specified', function (done) {
			const req = {
				body: {
					roleId: 'roleId', 
					subRoleId: 'subRoleId1', 
				}
			}
			RoleServices.removeSubRoleFromRole.returns(new Promise((resolve, reject) => {
				throw new Error('Undefined Error');
			}));

			let nextCalled = false;
			RoleController.removeSubRoleFromRole(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 500);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});

		it('should call next(err) keeping specified statusCode', function (done) {
			const req = {
				body: {
					roleId: 'roleId', 
					subRoleId: 'subRoleId1', 
				}
			}
			RoleServices.removeSubRoleFromRole.returns(new Promise((resolve, reject) => {
				const error = new Error('Udefined Error');
				error.statusCode = 400;
				throw error;
			}));

			let nextCalled = false;
			RoleController.removeSubRoleFromRole(req, {}, (err) => {
				expect(err).not.to.be.null;
				expect(err).to.have.property('statusCode', 400);
				nextCalled = true;
			})
				.then(response => {
					expect(response).to.be.null;
					expect(nextCalled).to.be.true;
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail('Error thrown');
					done();
				});
		});
	});


});
