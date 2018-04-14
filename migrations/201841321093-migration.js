module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('accounts', {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.BIGINT,
      },
      name: Sequelize.STRING(100),
      slug: Sequelize.STRING(100),
      plan: Sequelize.TEXT,
      createdAt: Sequelize.DATE(6),
      updatedAt: Sequelize.DATE(6),
    })
    await queryInterface.addIndex('accounts', {
      name: 'accounts_unique_slug',
      unique: true,
      fields: ['slug'],
    })
    await queryInterface.addIndex('accounts', {
      name: 'accounts_name_asc',
      fields: [{attribute: 'name', order: 'ASC'}],
    })
    await queryInterface.addIndex('accounts', {
      name: 'accounts_updatedat_desc',
      fields: [{attribute: 'updatedAt', order: 'DESC'}],
    })
    await queryInterface.createTable('users', {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.BIGINT,
      },
      accountId: {
        references: {
          key: 'id',
          model: 'accounts',
        },
        type: Sequelize.BIGINT,
      },
      role: Sequelize.TEXT,
      email: Sequelize.STRING(250),
      password: Sequelize.STRING(40),
      firstName: Sequelize.STRING(100),
      lastName: Sequelize.STRING(100),
      createdAt: Sequelize.DATE(6),
      updatedAt: Sequelize.DATE(6),
    })
    await queryInterface.addIndex('users', {
      name: 'users_unique_email',
      unique: true,
      fields: ['email'],
    })
    await queryInterface.addIndex('users', {
      name: 'users_email_asc__password_asc',
      fields: [{attribute: 'email', order: 'ASC'}, {attribute: 'password', order: 'ASC'}],
    })
    await queryInterface.addIndex('users', {
      name: 'users_updatedat_desc',
      fields: [{attribute: 'updatedAt', order: 'DESC'}],
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users')
    await queryInterface.dropTable('accounts')
  },
}
