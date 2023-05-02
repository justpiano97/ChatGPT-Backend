import { DataTypes } from 'sequelize';
import { DB } from '../services/db';
import Document from './document';

const Chat = DB.define(
  'Chat',
  {
    user_id: {
      type: DataTypes.INTEGER,
    },
    document_id: {
      type: DataTypes.INTEGER,
    },
    chat_name: {
      type: DataTypes.STRING,
    },
    messages: {
      type: DataTypes.JSON,
    },
  },
)

export default Chat;
