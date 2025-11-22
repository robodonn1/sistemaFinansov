const sequelize = require('./index.js');
const { DataTypes, Op, where } = require('sequelize');

const User = sequelize.define(
    'User',
    {
        login: { type: DataTypes.STRING, allowNull: false, defaultValue: 'ghost' },
        password: { type: DataTypes.STRING, allowNull: false },
        iban: { type: DataTypes.INTEGER, allowNull: false },
        balance: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    }
)

const Operations = sequelize.define(
    'Operations',
    {
        name: { type: DataTypes.ENUM, values: ['deposit', 'pay', 'transfer'] },
        title: { type: DataTypes.STRING, allowNull: false },
        amount: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
        sender: { type: DataTypes.INTEGER, allowNull: true },
        receiver: { type: DataTypes.INTEGER, allowNull: true },
        success: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    }
)

module.exports = { User, Operations };