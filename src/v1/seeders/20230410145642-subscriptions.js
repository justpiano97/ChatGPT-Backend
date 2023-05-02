'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Plans', [{
      name: "Basic",
      stripe_product_id: null,
      stripe_product_annual_id: null,
      pages: 120,
      pdf: 3,
      query: 50,
      size: 10,
      users: 1,
      price: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: "Advanced",
      stripe_product_id: "prod_Nh4GejrpzNF5WN",
      stripe_product_annual_id: "prod_Nh4IaN51E6QktF",
      pages: 2000,
      pdf: 50,
      query: 1000,
      size: 32,
      users: 10,
      price: 18,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: "Ultimate",
      stripe_product_id: "prod_Nh4IaN51E6QktF",
      stripe_product_annual_id: "prod_Nh4QPEppyhPhQ7",
      pages: 5000,
      pdf: 100,
      query: 2000,
      size: 64,
      users: 50,
      price: 28,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Plans', null, {});
  }
};
