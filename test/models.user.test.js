let request = require('supertest');
const app = require('../app');
const { Role, User, Log, sequelize } = require('../db/models');

beforeEach(async () => {
    await sequelize.sync({force: true});
});

describe('Models testing', () => {
    
    test('Create Role --> sending invalid data', () => {
        expect.assertions(1);

        try {
            const failedInstance = Role.build({
                name: null,
                description: 123
            });
        } catch (error) {
            console.log(error);
            console.log(error.message);
            expect(error).toBeInstanceOf(error);
            expect(error.message).toBe('notNull Violation: Role.name cannot be null');
        }
    });
    
    test('Create Role --> sending valid data', async () => {
        const testRole = await Role.create({name: 'Admin'});

        expect(testRole).toBeDefined();
        expect(testRole.name).toBe('Admin');
    });
});
