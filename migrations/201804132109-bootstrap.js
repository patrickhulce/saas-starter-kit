module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('accounts', {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.BIGINT,
      },
      name: Sequelize.STRING(40),
      plan: Sequelize.TEXT,
      createdAt: Sequelize.DATE(6),
      updatedAt: Sequelize.DATE(6),
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
      isVerified: Sequelize.BOOLEAN,
      password: Sequelize.STRING(73),
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
    await queryInterface.createTable('verifications', {
      id: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.BIGINT,
      },
      userId: {
        references: {
          key: 'id',
          model: 'users',
        },
        type: Sequelize.BIGINT,
      },
      key: Sequelize.STRING(40),
      type: Sequelize.TEXT,
      consumed: Sequelize.BOOLEAN,
      meta__ip: Sequelize.TEXT,
      createdAt: Sequelize.DATE(6),
      updatedAt: Sequelize.DATE(6),
    })
    await queryInterface.addIndex('verifications', {
      name: 'verifications_unique_key',
      unique: true,
      fields: ['key'],
    })
    await queryInterface.addIndex('verifications', {
      name: 'verifications_consumed_asc__key_asc',
      fields: [{attribute: 'consumed', order: 'ASC'}, {attribute: 'key', order: 'ASC'}],
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('verifications')
    await queryInterface.dropTable('users')
    await queryInterface.dropTable('accounts')
  },
}
