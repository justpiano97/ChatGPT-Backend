const { OAuth2Client } = require('google-auth-library');
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';

import User from '../../models/user';
import Plan from '../../models/plan';
import Document from '../../models/document';
import RefreshToken from '../../models/refreshToken';
import { generateTokens, verifyToken } from '../../utils/jwt';
import { hashToken } from '../../utils/hash_token';
import axios from 'axios';
import Subscription from '../../models/subscription';

const oauth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);

const authorizeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tokens } = req.body;
    oauth2Client.setCredentials(tokens);
    const { data } = await google.oauth2('v2').userinfo.get({ auth: oauth2Client });

    let profile = await User.findOne({ where: { google_id: data?.id }, include: [Plan, Subscription] });
    if(!profile) {
      const created = await User.create({ email: data?.email, google_id: data?.id, name: data?.name, picture: data?.picture, current_plan_id: 1 } );
      profile = await User.findOne({where: {id: created.dataValues.id}, include: [Plan, Subscription]})
    }

    const jti = uuidv4();
    const { refreshToken, accessToken } = generateTokens({ id: (profile?.dataValues?.id), email: (profile?.dataValues?.email) }, jti);
    await RefreshToken.create({ jti: jti, hashed_token: hashToken(refreshToken), user_id: profile?.dataValues?.id });

    // Get files in google drive
    const url = `${process.env.GOOGLE_DRIVE_API_BASE_URL}/files`;
    let files = [];
    const headers = {
      Authorization: `Bearer ${tokens.access_token}`,
      "Content-Type": "application/json",
    };
    try {      
      const response = await axios.get(url, { headers });
      files = (response?.data ?? [])?.files?.filter((file: any) => file.name.split(".").pop() == "pdf");
    } catch (error) {
      files = [];
    }

    // get file hisotry
    const documents = await Document.findAll({ where: { user_id: profile?.dataValues?.id }});
    
    res.status(StatusCodes.OK).json({ tokens: {refreshToken, accessToken}, user: profile, recent: documents, files });
  } catch (err) {
    res.sendStatus(500);
  }
}

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const { token, google_token } = req.body;

  if (!token) {
    return next({
      status: StatusCodes.BAD_REQUEST,
      message: 'Some required fields are missing',
    });
  }

  const payload = verifyToken(token) as { [key: string]: any};
  const savedRefreshToken = await RefreshToken.findOne({ 
    where: { 
      jti: payload.jti, 
    }, 
  });

  if (!savedRefreshToken || savedRefreshToken.dataValues.revoked === true) {
    return next({
      status: StatusCodes.UNAUTHORIZED,
      message: 'Token is expired',
    });
  }

  if (hashToken(token) !== savedRefreshToken.dataValues.hashed_token) {
    return next({
      status: StatusCodes.UNAUTHORIZED,
      message: 'Token is not match',
    });
  }

  if (Date.now() > payload.exp * 1000) {
    return next({
      status: StatusCodes.UNAUTHORIZED,
      message: 'Token is expired',
    });
  }

  const user = await User.findOne({ where: { id: payload.id }, include: [Plan, Subscription] });

  if (!user) {
    return next({
      status: StatusCodes.UNAUTHORIZED,
      message: 'no user',
    });
  }

  const jti = uuidv4();
  const { refreshToken, accessToken } = generateTokens({ id: (user?.dataValues?.id), email: (user?.dataValues?.email) }, jti);

  await RefreshToken.create({
    jti: jti, hashed_token: hashToken(refreshToken), user_id: user?.dataValues?.id 
  })

  // Get files in google drive
  const url = `${process.env.GOOGLE_DRIVE_API_BASE_URL}/files`;
  let files = [];
  const headers = {
    Authorization: `Bearer ${google_token}`,
    "Content-Type": "application/json",
  };
  try {      
    const response = await axios.get(url, { headers });
    files = (response?.data?.files ?? [])?.filter((file: any) => file.name.split(".").pop() == "pdf");
  } catch (error) {
   files = [];
  }

  // get file hisotry
  const documents = await Document.findAll({ where: { user_id: user?.dataValues?.id }});
  
  res.status(StatusCodes.OK).json({ tokens: {refreshToken, accessToken}, user, recent: documents, files });
}

const logout = (req: Request, res: Response) => {
  res.clearCookie('access_token');
  res.redirect('/');
}

export { authorizeUser, refreshToken, logout };
