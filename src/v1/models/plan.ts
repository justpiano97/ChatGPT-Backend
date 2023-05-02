import { DataTypes } from 'sequelize';
import { DB } from '../services/db';
import User from './user';

const Plan = DB.define(
  'Plan',
  {
    name: {
      type: DataTypes.STRING
    },
    stripe_product_id: {
      type: DataTypes.STRING
    },
    stripe_product_annual_id: {
      type: DataTypes.STRING
    },
    pages: {
      type: DataTypes.INTEGER,
    },
    pdf: {
      type: DataTypes.INTEGER,
    },
    query: {
      type: DataTypes.INTEGER,
    },
    size: {
      type: DataTypes.INTEGER,
    },
    users: {
      type: DataTypes.INTEGER,
    },
    price: {
      type: DataTypes.INTEGER,
    },
  },
)

export default Plan;
