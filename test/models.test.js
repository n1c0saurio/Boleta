let request = require('supertest');
const app = require('../app');
const models = require('../db/models');

request = request(app);

beforeAll(async () => {
  await models.sequelize.sync({ force: true });
});

afterAll(() => {
  models.sequelize.close();
});

describe('Models testing', () => {

  test('Role --> created succesfully with valid data', async () => {
    try {
      const defaultRoles = await models.Role.bulkCreate([
        {
          id: 'admin',
          name: 'Admin',
          description: 'Test admin role'
        },
        {
          id: 'enduser',
          name: 'Regular User',
          description: 'Test regular user'
        }
      ]);

      expect(defaultRoles[0]).toBeInstanceOf(models.Role);
      expect(defaultRoles[0].id).toBe('admin');
      expect(defaultRoles[1].id).toBe('enduser');
    } catch (error) {
      console.log(error);
    }
  });


  test('Role --> create failed with invalid data', async () => {
    try {
      const failedInstance = models.Role.build({
        id: 'admin',
        name: null,
        description: 123
      });
      await expect(failedInstance.validate()).rejects.toThrow('notNull Violation: Role.name cannot be null');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('SequelizeValidationError: notNull Violation: Role.name cannot be null');
    }
  });
  
  // test('Role --> delete failed because is currently assigned', async () => {
  //   try {
  //     roleInUse = await Role.findOne({ where: { 'id': 'admin' } });
  //     await roleInUse.destroy();
  //     expect(roleInUse.id).toBe('admhukihin');
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });
});
