const { expect, should, assert } = require('chai');
const { dbHandler } = require('ngcstesthelpers');
const { ObjectId } = require('mongodb');

const RoleServices = require('../services/roleservices');
const Role = require('../model/role');

describe('RoleServices', function () {
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
			defaultRole = Role({
				name: 'defaultName',
				label: 'defaultLabel',
			});
			defaultRole = await defaultRole.save();
		});

		it('should throw an error if Role with given name already exists', function (done) {
			const params = {
				name: 'defaultName',
				label: 'otherLabel',
			};

            RoleServices.createRole(params)
                .then(result => {
                    assert.fail('Error');
                })
                .catch(err => {
                    expect(err).to.have.property('message', `E11000 duplicate key error dup key: { : "${params.name}" }`);
                    done();
                })
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				})
		});

		it('should throw an error if Role with given label already exists', function (done) {
			const params = {
				label: 'defaultLabel',
				name: 'otherName',
			};

            RoleServices.createRole(params)
                .then(result => {
                    assert.fail('Error');
                })
                .catch(err => {
                    expect(err).to.have.property('message', `E11000 duplicate key error dup key: { : "${params.label}" }`);
                    done();
                })
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				})
		});

		it('should create a Role', function (done) {
			const params = {
				name: 'otherName',
				label: 'otherLabel',
			};
            RoleServices.createRole(params)
                .then(result => {
                    Role.findOne({ 'name': params.name })
                        .then(newRole => {
                            if (!newRole) {
                                assert.fail('User not created');
                            }
							expect(result).to.have.property('roleId', newRole._id.toString());

							expect(result).to.have.property('name', params.name);
							expect(newRole).to.have.property('name', params.name);

							expect(result).to.have.property('label', params.label);
							expect(newRole).to.have.property('label', params.label);

                            done();
                        })
                })
                .catch(err => {
                    console.log(err);
                    assert.fail('UserService Error');
					done();
                })

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

		it('should throw an error if Role to delete is not found', function (done) {
			const params = {
				roleId: ObjectId().toString(),
			};
			RoleServices.deleteRole(params)
				.then(result => {
					assert.fail('deleteRole error');
					done();
				})
				.catch(err => {
					expect(err).to.have.property('message', 'Role to delete was not found');
					expect(err).to.have.property('statusCode', 404);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

		it('should delete Role if Role exists', function (done) {
			const params = {
				roleId: defaultRole._id.toString(),
			};
			RoleServices.deleteRole(params)
				.then(result => {
					expect(result).to.have.property('roleId', params.roleId);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});		
	});

	describe('#getRoles function', function () {
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

		it('should throw an error if range out of bounds', function (done) {
            RoleServices.getRoles({ page: '3', perPage: '10' })
                .then(result => {
                    assert.fail('Error');
                })
                .catch(err => {
                    expect(err).to.have.property('message', 'Pagination out of bounds.');
                    expect(err).to.have.property('statusCode', 400);
                    done();
                })
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

		it('should return an object containing the required data and the number if pages', function (done) {
            const perPage = '10';
            RoleServices.getRoles({ page: 1, perPage: perPage })
                .then(result => {
                    expect(result).to.have.property('pageCount', 2);
                    expect(result).to.have.property('roles').to.have.lengthOf(perPage);
                    done();
                })
                .catch(err => {
                    console.log(err);
                    assert.fail(err);
                    done();
                })			
		});

        it('should return an object containing the required data and the number of pages 2', function (done) {
            const perPage = '7';
            RoleServices.getRoles({ page: '1', perPage: perPage })
                .then(result => {
                    expect(result).to.have.property('pageCount', 3);
                    expect(result).to.have.property('roles').to.have.lengthOf(perPage);
                    done();
                })
                .catch(err => {
                    console.log(err);
                    assert.fail(err);
                    done();
                })
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
	
		it('should throw an error if Role not found', function (done) {
			RoleServices.getRole({ roleId: ObjectId().toString() })
				.then(result => {
					assert.fail('Error');
				})
				.catch(err => {
					expect(err).to.have.property('statusCode', 404);
					expect(err).to.have.property('message', 'Role not found');
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				})
		});

		it('should return an object if Role found', function (done) {
			RoleServices.getRole({ roleId: defaultRole._id.toString() })
				.then(result => {
					expect(result).to.have.property('roleId', defaultRole._id.toString());
					expect(result).to.have.property('name', defaultRole.name);
					expect(result).to.have.property('label', defaultRole.label);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				})
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

		it('should throw an error if Role is not found', function (done) {
			const params = {
				name: 'otherRoleName',
			};
			RoleServices.findRoleByName(params)
				.then(role => {
					assert.fail('Error');
				})
				.catch(err => {
					expect(err).to.have.property('message', 'Could not find Role');
					expect(err).to.have.property('statusCode', 404);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

		it('should return an object if Role is found', function (done) {
			const params = {
				name: defaultRole.name,
			};
			RoleServices.findRoleByName(params)
				.then(role => {
					expect(role).not.to.be.null;
					expect(role).to.have.property('roleId', defaultRole._id.toString());
					expect(role).to.have.property('name', defaultRole.name);
					expect(role).to.have.property('label', defaultRole.label);
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

		it('should throw an error if Role is not found', function (done) {
			const params = {
				label: 'otherRoleLabel',
			};
			RoleServices.findRoleByLabel(params)
				.then(role => {
					assert.fail('Error');
				})
				.catch(err => {
					expect(err).to.have.property('message', 'Could not find Role');
					expect(err).to.have.property('statusCode', 404);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

		it('should return an object if Role is found', function (done) {
			const params = {
				label: defaultRole.label,
			};
			RoleServices.findRoleByLabel(params)
				.then(role => {
					expect(role).not.to.be.null;
					expect(role).to.have.property('roleId', defaultRole._id.toString());
					expect(role).to.have.property('name', defaultRole.name);
					expect(role).to.have.property('label', defaultRole.label);
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
		
		let defaultSubRole;
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
			
			defaultSubRole = new Role ({
				name: 'defaultSubRoleName',
				label: 'defaultSubRoleLabel',
			});
			defaultSubRole = await defaultSubRole.save();
		});

		it('should throw an error if Role is not found', function(done) {
			const params = {
				roleId: new ObjectId().toString(),
				subRoleId: defaultSubRole._id.toString(), 
			};

			RoleServices.addSubRoleToRole(params)
				.then(() => {
					assert.fail(err);
				})
				.catch(err => {
					expect(err).to.have.property('message', 'Role not found');
					expect(err).to.have.property('statusCode', 404);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

		it('should throw an error if subRole is not found', function(done) {
			const params = {
				roleId: defaultRole._id.toString(),
				subRoleId: new ObjectId().toString(), 
			};

			RoleServices.addSubRoleToRole(params)
				.then(() => {
					assert.fail(err);
				})
				.catch(err => {
					expect(err).to.have.property('message', 'Role to add not found');
					expect(err).to.have.property('statusCode', 404);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

		it('should throw an error if subRole is already in subRoles', function(done) {
			const params = {
				roleId: defaultRole._id.toString(),
				subRoleId: defaultSubRole._id.toString(), 
			};

			defaultRole.subRoles.push(defaultSubRole._id.toString());
			defaultRole.save()
				.then(() => {
					RoleServices.addSubRoleToRole(params)
						.then(() => {
							assert.fail(err);
						})
						.catch(err => {
							expect(err).to.have.property('message', 'Role already in subRoles');
							expect(err).to.have.property('statusCode', 400);
							done();
						})
						.catch(err => {
							console.log(err);
							assert.fail(err);
							done();
						});
				})
		});
		
		it('should add Role to Role subRoles', function(done) {
			const params = {
				roleId: defaultRole._id.toString(),
				subRoleId: defaultSubRole._id.toString(), 
			};

			RoleServices.addSubRoleToRole(params)
				.then(() => {
					Role.findOne({_id: defaultRole._id.toString()})
						.then(newRole => {
							expect(newRole).not.to.be.null;
							expect(newRole.subRoles.length).to.be.equal(1);
							expect(newRole.subRoles.includes(defaultSubRole._id.toString())).to.be.true;							
							done();
						})
					.catch(err => {
						console.log(err);
						assert.fail(err);
						done();
					})
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
		
		let defaultSubRole;
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
			
			defaultSubRole = new Role ({
				name: 'defaultSubRoleName',
				label: 'defaultSubRoleLabel',
			});
			defaultSubRole = await defaultSubRole.save();
			
			defaultRole.subRoles.push(defaultSubRole._id);
			defaultRole = await defaultRole.save();
		});

		it('should throw an error if Role is not found', function(done) {
			const params = {
				roleId: new ObjectId().toString(),
				subRoleId: defaultSubRole._id.toString(), 
			};

			RoleServices.removeSubRoleFromRole(params)
				.then(() => {
					assert.fail(err);
				})
				.catch(err => {
					expect(err).to.have.property('message', 'Role not found');
					expect(err).to.have.property('statusCode', 404);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

		it('should throw an error if subRole is not found', function(done) {
			const params = {
				roleId: defaultRole._id.toString(),
				subRoleId: new ObjectId().toString(), 
			};

			RoleServices.removeSubRoleFromRole(params)
				.then(() => {
					assert.fail(err);
				})
				.catch(err => {
					expect(err).to.have.property('message', 'Role to remove not found');
					expect(err).to.have.property('statusCode', 404);
					done();
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});

		it('should throw an error if subRole is not in subRoles', function(done) {
			const params = {
				roleId: defaultRole._id.toString(),
				subRoleId: defaultSubRole._id.toString(), 
			};

			defaultRole.subRoles = [];
			defaultRole.save()
				.then(() => {
					RoleServices.removeSubRoleFromRole(params)
						.then(() => {
							assert.fail(err);
						})
						.catch(err => {
							expect(err).to.have.property('message', 'Role not in subRoles');
							expect(err).to.have.property('statusCode', 400);
							done();
						})
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});
		
		it('should remove Role from Role subRoles', function(done) {
			const params = {
				roleId: defaultRole._id.toString(),
				subRoleId: defaultSubRole._id.toString(), 
			};

			RoleServices.removeSubRoleFromRole(params)
				.then(() => {
					Role.findOne({_id: defaultRole._id.toString()})
						.then(newRole => {
							expect(newRole).not.to.be.null;
							expect(newRole.subRoles.length).to.be.equal(0);
							expect(newRole.subRoles.includes(defaultSubRole._id.toString())).to.be.false;							
							done();
						})
						.catch(err => {
							console.log(err);
							assert.fail(err);
							done();
						})
				})
				.catch(err => {
					console.log(err);
					assert.fail(err);
					done();
				});
		});
	});

});
