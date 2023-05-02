import { DataTypes, Model, Optional } from 'sequelize';
import { DB } from '../services/db';
import User from './user';

const Subscription = DB.define(
  'Subscription',
  {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id"
      }
    },
    plan_id: {
      type: DataTypes.INTEGER,
    },
    stripe_product_id: {
      type: DataTypes.STRING,
    },
    stripe_subscription_id: {
      type: DataTypes.STRING,
    },
    start_date: {
      type: DataTypes.DATE,
    },
    end_date: {
      type: DataTypes.DATE,
    },
    trial_period_start: {
      type: DataTypes.DATE,
    },
    trial_period_end: {
      type: DataTypes.DATE
    }
  },
);

export default Subscription;
