import 'dotenv/config';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'secret';

interface IPayload {
  id: string;
  email: string;
}

const generateAccessToken = (payload: IPayload) => jwt.sign(payload, SECRET, { expiresIn: '1h', algorithm: 'HS256' });
const generateRefreshToken = (payload: IPayload, jti: string) => jwt.sign({ ...payload, jti }, SECRET, { expiresIn: '24h', algorithm: 'HS256' });

const generateTokens = (payload: IPayload, jti: string) => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload, jti);

  return {
    accessToken,
    refreshToken,
  };
};

const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET);
};

export { generateAccessToken, generateRefreshToken, generateTokens, verifyToken };
