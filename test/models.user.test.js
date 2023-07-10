let request = require('supertest');
const app = require('../app');
const { Role, User, Log, sequelize } = require('../models');

beforeEach(async () => {
    await sequelize.sync({force: true});
});

describe('Models testing', () => {
    
    test('Create Role --> sending invalid data', () => {
        expect(() => {
            Role.build({name: '', description: 123});
        }).toThrow();
    });
    
    test('Create Role --> sending valid data', async () => {
        const testRole = await Role.create({name: 'Admin'});

        expect(testRole).toBeDefined();
        expect(testRole.name).toBe('Admin');
    });
});
