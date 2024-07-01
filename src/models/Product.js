const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const Product = sequelize.define('product', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },

    // stock: {
    //     type: DataTypes.INTEGER,
    //     allowNull: true,
    //     defaultValue: 10
    // },
    
    //categoryId
});

module.exports = Product;