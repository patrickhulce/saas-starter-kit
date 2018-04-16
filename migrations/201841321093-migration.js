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
      firebaseId: Sequelize.STRING(40),
      role: Sequelize.TEXT,
      email: Sequelize.STRING(250),
      createdAt: Sequelize.DATE(6),
      updatedAt: Sequelize.DATE(6),
    })
    await queryInterface.addIndex('users', {
      name: 'users_unique_firebaseid',
      unique: true,
      fields: ['firebaseId'],
    })
    await queryInterface.addIndex('users', {
      name: 'users_unique_email',
      unique: true,
      fields: ['email'],
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
