import { DataTypes } from 'sequelize';
import { DB } from '../services/db'

const RefreshToken = DB.define(
  'RefreshToken',
  {
    jti: {
      type: DataTypes.STRING
    },
    hashed_token: {
      type: DataTypes.STRING,
    },
    user_id: {
      type: DataTypes.STRING
    },
    revoked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
)

export default RefreshToken;
