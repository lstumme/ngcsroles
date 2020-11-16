const { expect, assert } = require('chai');
const { ObjectId } = require('mongodb');
const { dbHandler } = require('ngcstesthelpers');
const roleServices = require('../services/roleservices');
const Role = require('../model/role');

describe('Role services', function () {
    describe('#createRole', function () {
        before(async () => {
            await dbHandler.connect();
        });

        after(async () => {
            await dbHandler.closeDatabase();
        });

        beforeEach(async () => {
            const role = new Role({
                name: 'role1',
                label: 'role1Label'
            });
            await role.save();
        });

        afterEach(async () => {
            await dbHandler.clearDatabase();
        });

        it('should throw an error if a role with given name already exists', function (done) {
            const params = { name: 'role1', label: 'role1Label' };
            roleServices.createRole(params)
                .then(result => {
                    assert.fail('Error');
                })
                .catch(err => {
                    expect(err).to.have.property('message', `Role ${params.name} already exists`);
                    expect(err).to.have.property('statusCode', 409);
                    done();
                })
        });

        it('should create a role', function (done) {
            const params = { name: 'role2', label: 'role2Label' };
            roleServices.createRole(params)
                .then(result => {
                    expect(result).to.have.property('roleId');
                    Role.findOne({ '_id': result.roleId })
                        .then(newRole => {
                            if (!newRole) {
                                assert.fail('Role not created');
                            }
                            expect(newRole).to.have.property('name', params.name);
                            done();
                        })
                })
                .catch(err => {
                    console.log(err);
                    assert.fail('RoleService Error');
                })
        });

    });

    describe('#deleteRole', function () {
        let existingRole;
        before(async () => {
            await dbHandler.connect();
        });

        after(async () => {
            await dbHandler.closeDatabase();
        });

        beforeEach(async () => {
            existingRole = new Role({
                name: 'role1',
                label: 'role1Label'
            });
            existingRole = await existingRole.save();
        });

        afterEach(async () => {
            await dbHandler.clearDatabase();
        });

        it('should throw an error if a role with roleId name does not exists', function (done) {
            const params = { roleId: new ObjectId() };
            roleServices.deleteRole(params)
                .then(result => {
                    assert.fail('Error');
                })
                .catch(err => {
                    expect(err).to.have.property('message', `Could not find role.`);
                    expect(err).to.have.property('statusCode', 404);
                    done();
                })
        });

        it('should delete role if role exists', function (done) {
            const params = { roleId: existingRole._id.toString() };
            roleServices.deleteRole(params)
                .then(result => {
                    Role.countDocuments({}, function (err, count) {
                        if (err) {
                            assert.fail('Database Error');
                        }
                        expect(count).to.equal(0);
                        done();
                    });
                })
                .catch(err => {
                    assert.fail('Error');
                    done();
                })
        });

    });

    describe('#getRole function', function () {
        let registeredRole;
        before(async () => {
            await dbHandler.connect();
        });

        after(async () => {
            await dbHandler.closeDatabase();
        });

        beforeEach(async () => {
            const role = new Role({
                name: 'role1',
                label: 'role1Label'
            });
            registeredRole = await role.save();
        });

        afterEach(async () => {
            await dbHandler.clearDatabase();
        });

        it('should throw an error if Role not found', function (done) {
            roleServices.getRole({ roleId: ObjectId().toString() })
                .then(result => {
                    assert.fail('Error');
                })
                .catch(err => {
                    expect(err).to.have.property('message', 'Role not found.');
                    expect(err).to.have.property('statusCode', 404);
                    done();
                })
        });

        it('should return a role object if role found', function (done) {
            roleServices.getRole({ roleId: registeredRole._id.toString() })
                .then(result => {
                    expect(result).to.have.property('roleId', registeredRole._id.toString());
                    expect(result).to.have.property('name', registeredRole.name);
                    expect(result).to.have.property('label', registeredRole.label);
                    done();
                })
                .catch(err => {
                    assert.fail(err.toString());
                    done();
                })
        });

    });

    describe('#getRoles function', function () {
        before(async () => {
            await dbHandler.connect();
        });

        after(async () => {
            await dbHandler.closeDatabase();
        });

        beforeEach(async () => {
            for (let i = 0; i < 20; i++) {
                const role = new Role({
                    name: 'role' + i,
                    label: 'role' + i + 'Label'
                });
                await role.save();
            }
        });

        afterEach(async () => {
            await dbHandler.clearDatabase();
        });

        it('should throw an error if range out of bounds', function (done) {
            roleServices.getRoles({ page: 3, perPage: 10 })
                .then(result => {
                    assert.fail('Error');
                })
                .catch(err => {
                    expect(err).to.have.property('message', 'Pagination out of bounds.');
                    expect(err).to.have.property('statusCode', 400);
                    done();
                })
        });

        it('should return an object contianing the required data and the number of pages', function (done) {
            const perPage = 10;
            roleServices.getRoles({ page: 1, perPage: perPage })
                .then(result => {
                    expect(result).to.have.property('pageCount', 2);
                    expect(result).to.have.property('roles').to.have.lengthOf(perPage);
                    for (let i = 0; i < perPage; i++) {
                        expect(result.roles[i]).to.have.property('name', 'role' + i);
                        expect(result.roles[i]).to.have.property('label', 'role' + i + 'Label');
                    }
                    done();
                })
                .catch(err => {
                    console.log(err);
                    assert.fail('Error');
                    done();
                })
        });

        it('should return an object containing the required data and the number of pages 2', function (done) {
            const perPage = 7;
            roleServices.getRoles({ page: 1, perPage: perPage })
                .then(result => {
                    expect(result).to.have.property('pageCount', 3);
                    expect(result).to.have.property('roles').to.have.lengthOf(perPage);
                    for (let i = 0; i < perPage; i++) {
                        expect(result.roles[i]).to.have.property('name', 'role' + i);
                        expect(result.roles[i]).to.have.property('label', 'role' + i + 'Label');
                    }
                    done();
                })
                .catch(err => {
                    console.log(err);
                    assert.fail('Error');
                    done();
                })
        });

    });

    describe('#findRole function', function () {
        let registeredRole;
        before(async () => {
            await dbHandler.connect();
        });

        after(async () => {
            await dbHandler.closeDatabase();
        });

        beforeEach(async () => {
            const role = new Role({
                name: 'role1',
                label: 'role1Label'
            });
            registeredRole = await role.save();
        });

        afterEach(async () => {
            await dbHandler.clearDatabase();
        });

        it('should throw an error if Role not found', function (done) {
            roleServices.findRole({ name: 'unknownRole' })
                .then(result => {
                    assert.fail('Error');
                })
                .catch(err => {
                    expect(err).to.have.property('message', 'Role not found.');
                    expect(err).to.have.property('statusCode', 404);
                    done();
                })
        });

        it('should return a role object if role found', function (done) {
            roleServices.findRole({ name: registeredRole.name })
                .then(result => {
                    expect(result).to.have.property('roleId', registeredRole._id.toString());
                    expect(result).to.have.property('name', registeredRole.name);
                    expect(result).to.have.property('label', registeredRole.label);
                    done();
                })
                .catch(err => {
                    assert.fail(err.toString());
                    done();
                })
        });

    });

    describe('#addSubRoleToRole', function () {
        let parentRole;
        let subRole1;
        let subRole2;
        before(async () => {
            await dbHandler.connect();
        });

        after(async () => {
            await dbHandler.closeDatabase();
        });

        beforeEach(async () => {
            subRole1 = new Role({
                name: 'subRole1',
                label: 'subRole1Label'
            })
            subRole1 = await subRole1.save();

            subRole2 = new Role({
                name: 'subRole2',
                label: 'subRole2Label'
            });
            subRole2 = await subRole2.save();

            parentRole = new Role({
                name: 'parentRole',
                label: 'parentRoleLabel',
                subRoles: [subRole1._id]
            });
            parentRole = await parentRole.save();
        });

        afterEach(async () => {
            await dbHandler.clearDatabase();
        });

        it('should throw an error if a role with given subRoleId does not exists', function (done) {
            const params = { parentRoleId: parentRole._id.toString(), subRoleId: (new ObjectId()).toString() };
            roleServices.addSubRoleToRole(params)
                .then(result => {
                    assert.fail('Error');
                })
                .catch(err => {
                    expect(err).to.have.property('message', `Could not find subRole.`);
                    expect(err).to.have.property('statusCode', 404);
                    done();
                })

        });

        it('should throw an error if a role with given parentRoleId does not exists', function (done) {
            const params = { subRoleId: subRole1._id.toString(), parentRoleId: (new ObjectId()).toString() };
            roleServices.addSubRoleToRole(params)
                .then(result => {
                    assert.fail('Error');
                })
                .catch(err => {
                    expect(err).to.have.property('message', `Could not find parent role.`);
                    expect(err).to.have.property('statusCode', 404);
                    done();
                })
        });

        it('should throw an error if a role is already in role', function (done) {
            const params = { parentRoleId: parentRole._id.toString(), subRoleId: subRole1._id.toString() };
            roleServices.addSubRoleToRole(params)
                .then(result => {
                    assert.fail('Error');
                })
                .catch(err => {
                    expect(err).to.have.property('message', `Role already in role.`);
                    expect(err).to.have.property('statusCode', 400);
                    done();
                })
        });

        it('should add subRole to role', function (done) {
            const params = { parentRoleId: parentRole._id.toString(), subRoleId: subRole2._id.toString() };
            roleServices.addSubRoleToRole(params)
                .then(result => {
                    return Role.findOne({ name: parentRole.name })
                        .then(updatedRole => {
                            expect(updatedRole.subRoles.length).to.equal(2);
                            expect(updatedRole.subRoles.includes(subRole2._id.toString())).to.be.true;
                            done();
                        })
                })
                .catch(err => {
                    console.log(err);
                    assert.fail('Error');
                    done();
                })
        });
    });

    describe('#removeSubRoleFromRole', function () {
        let parentRole;
        let subRole1;
        let subRole2;
        before(async () => {
            await dbHandler.connect();
        });

        after(async () => {
            await dbHandler.closeDatabase();
        });

        beforeEach(async () => {
            subRole1 = new Role({
                name: 'subRole1',
                label: 'subRole1Label'
            })
            subrRole1 = await subRole1.save();

            subRole2 = new Role({
                name: 'subRole2',
                label: 'subRole2Label'
            });
            subRole2 = await subRole2.save();

            parentRole = new Role({
                name: 'parentRole',
                label: 'parentRoleLabel',
                subRoles: [subRole1._id]
            });
            parentRole = await parentRole.save();
        });

        afterEach(async () => {
            await dbHandler.clearDatabase();
        });

        it('should throw an error if a role with given subRoleId does not exists', function (done) {
            const params = { parentRoleId: parentRole._id.toString(), subRoleId: (new ObjectId()).toString() };
            roleServices.removeSubRoleFromRole(params)
                .then(result => {
                    assert.fail('Error');
                })
                .catch(err => {
                    expect(err).to.have.property('message', `Could not find sub role.`);
                    expect(err).to.have.property('statusCode', 404);
                    done();
                })
        });

        it('should throw an error if a role with given parentRoleId does not exists', function (done) {
            const params = { subRoleId: subRole1._id.toString(), parentRoleId: (new ObjectId()).toString() };
            roleServices.removeSubRoleFromRole(params)
                .then(result => {
                    assert.fail('Error');
                })
                .catch(err => {
                    expect(err).to.have.property('message', `Could not find parent role.`);
                    expect(err).to.have.property('statusCode', 404);
                    done();
                })
        });

        it('should throw an error if a role is not in role', function (done) {
            const params = { parentRoleId: parentRole._id.toString(), subRoleId: subRole2._id.toString() };
            roleServices.removeSubRoleFromRole(params)
                .then(result => {
                    assert.fail('Error');
                })
                .catch(err => {
                    expect(err).to.have.property('message', `Role not in role.`);
                    expect(err).to.have.property('statusCode', 400);
                    done();
                })
        });

        it('should remove role from role', function (done) {
            const params = { parentRoleId: parentRole._id.toString(), subRoleId: subRole1._id.toString() };
            roleServices.removeSubRoleFromRole(params)
                .then(result => {
                    Role.findOne({ name: 'parentRole' })
                        .then(updatedRole => {
                            expect(updatedRole.subRoles.length).to.equal(0);
                            done();
                        })
                })
                .catch(err => {
                    console.log(err);
                    assert.fail('Error');
                    done();
                })
        });

    });

    describe('#updateRoleInformations', function () {
        let originalRole;
        before(async () => {
            await dbHandler.connect();
        });

        after(async () => {
            await dbHandler.closeDatabase();
        });

        beforeEach(async () => {
            originalRole = new Role({
                name: 'originalName',
                label: 'originalLabel',
            });
            originalRole = await originalRole.save();
        });

        afterEach(async () => {
            await dbHandler.clearDatabase();
        });

        it('should throw an error if role to update is not found', function (done) {
            const id = new ObjectId();
            const params = { roleId: id.toString(), name: 'newName', label: 'newLabel' };
            roleServices.updateRoleInformations(params)
                .then(result => {
                    assert.fail('Error');
                })
                .catch(err => {
                    expect(err).to.have.property('message', `Could not find role.`);
                    expect(err).to.have.property('statusCode', 404);
                    done();
                })
        });

        it('should update role name if name is provided', function (done) {
            const params = { roleId: originalRole._id.toString(), name: 'newName' };
            roleServices.updateRoleInformations(params)
                .then(result => {
                    expect(result).to.have.property('name', params.name);
                    expect(result).to.have.property('label', originalRole.label);
                    Role.findOne({ _id: originalRole._id })
                        .then(newRole => {
                            expect(newRole).to.have.property('name', params.name);
                            expect(newRole).to.have.property('label', originalRole.label);
                            done();
                        })
                })
                .catch(err => {
                    console.log(err);
                    assert.fail('Error');
                    done();
                });
        })

        it('should update role label if label is provided', function (done) {
            const params = { roleId: originalRole._id.toString(), label: 'newLabel' };
            roleServices.updateRoleInformations(params)
                .then(result => {
                    expect(result).to.have.property('name', originalRole.name);
                    expect(result).to.have.property('label', params.label);
                    Role.findOne({ _id: originalRole._id })
                        .then(newRole => {
                            expect(newRole).to.have.property('name', originalRole.name);
                            expect(newRole).to.have.property('label', params.label);
                            done();
                        })
                })
                .catch(err => {
                    console.log(err);
                    assert.fail('Error');
                    done();
                });
        })

        it('should update User details if everything is provided', function (done) {
            const params = { roleId: originalRole._id.toString(), name: 'newName', label: 'newLabel' };
            roleServices.updateRoleInformations(params)
                .then(result => {
                    expect(result).to.have.property('name', params.name);
                    expect(result).to.have.property('label', params.label);
                    Role.findOne({ _id: originalRole._id })
                        .then(newRole => {
                            expect(newRole).to.have.property('name', params.name);
                            expect(newRole).to.have.property('label', params.label);
                            done();
                        })
                })
                .catch(err => {
                    console.log(err);
                    assert.fail('Error');
                    done();
                });
        });

    });
});