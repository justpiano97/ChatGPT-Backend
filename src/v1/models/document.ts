import { DataTypes } from 'sequelize';
import { DB } from '../services/db';

import Chat from './chat';

const Document = DB.define(
  'Document',
  {
    user_id: {
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
    },
    uid: {
      type: DataTypes.STRING,
    },
    ip: {
      type: DataTypes.STRING,
    },
    total_pages: {
      type: DataTypes.INTEGER,
    },
    s3_link: {
      type: DataTypes.STRING,
    },
  },
)

Document.hasOne(Chat, { foreignKey: 'document_id' });

export default Document;
