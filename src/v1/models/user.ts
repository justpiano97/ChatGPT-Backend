import { DataTypes } from 'sequelize';
import { DB } from '../services/db'
import Plan from './plan';
import Subscription from './subscription';

const User = DB.define(
  'User',
  {
    email: {
      type: DataTypes.STRING,
    },
    google_id: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    picture: {
      type: DataTypes.STRING,
    },
    current_plan_id: {
      type: DataTypes.INTEGER,
    },
    stripe_customer_id: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.INTEGER,
    },
  },
)

User.belongsTo(Plan, { foreignKey: 'current_plan_id' });
User.hasOne(Subscription, {foreignKey: 'user_id'});

export default User;
