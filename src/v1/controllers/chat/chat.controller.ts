import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import fs from "fs";
import AWS from 'aws-sdk';
import path from "path";

import User from '../../models/user';
import Plan from '../../models/plan';
import Document from '../../models/document';
import Chat from '../../models/chat';
import {splitChunk, createEmbedding} from '../../utils/helper';

interface MulterRequest extends Request {
  files: any;
}


const createDocumentHistory = async (req: MulterRequest, res: Response, next: NextFunction) => {
  const { name, uid, total_pages, messages } = req.body;
  const { id } = res.locals.payload;
  
  let existDoc = await Document.findOne({where: { uid }});
  
  if (!existDoc) {
    const { file } = req?.files;
    file.name = `${name.replace(/\.[^/.]+$/, '')}-${uid}${path.parse(file.name).ext}`;
    const blob = file.data;

    AWS.config.update({
      accessKeyId: process.env.AWS_S3_ACCESSKEYID,
      secretAccessKey: process.env.AWS_S3_SECRETACCESSKEY
    });
  
    const s3 = new AWS.S3();
  
    const params = {
      Bucket: `${process.env.AWS_S3_BUCKETNAME}`,
      Key: `${file.name}`,
      Body: blob
    };
  
    const uploadedImage = await s3.upload(params).promise();
    existDoc = await Document.create({
        user_id: id,
        name: name,
        uid: uid,
        ip: null,
        total_pages: parseInt(total_pages ?? 0),
        s3_link: uploadedImage.Location,
    });
  }
  const existChat = await Chat.findOne({ where: { document_id: existDoc.dataValues.id } });
  if (existChat) {
    await Chat.update({
      messages: JSON.parse(messages),
    }, {
      where: {
        id: existChat.dataValues.id
      }
    })
  } else {
    await Chat.create({
      user_id: id,
      document_id: existDoc.dataValues.id,
      chat_name: `${name.replace(/\.[^/.]+$/, '')}-${uid}`,
      messages: JSON.parse(messages),
    })
  }

  const message = await Chat.findOne({ where: { document_id: existDoc.dataValues.id } })

  res.status(StatusCodes.OK).json({ file: existDoc, message });
};

const getUsersDocuments = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = res.locals.payload;
  const documents = await Document.findAll({ where: { user_id: id }});
  res.status(StatusCodes.OK).json({ documents })
}

const getUsersDocumentById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const document = await Document.findOne({ where: { id: parseInt(id) }});
  const chatting = await Chat.findOne({ where: { document_id: document?.dataValues?.id } });
  res.status(StatusCodes.OK).json({ 
    name: document?.dataValues?.name,
    uid: document?.dataValues?.uid,
    file: null,
    ip: document?.dataValues?.ip,
    s3_url: document?.dataValues?.s3_link,
    active: true,
    total_pages: document?.dataValues?.total_pages,
    messages: chatting?.dataValues?.messages,
    isEmbedded: true,
  });
}

const deleteUsersDocumentById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  await Document.destroy({ where: { id: parseInt(id) }});
  await Chat.destroy({ where: { document_id: parseInt(id) } });
  res.status(StatusCodes.OK).json("OK");
}

const generateEmbedding = async (req: Request, res: Response, next: NextFunction) => {
  const { sentence_list, ip, file_name, apiKey } = req.body;
  const chunkList = await splitChunk(sentence_list);
  const chunkSize = chunkList.length > 80 ? 80 : Number(chunkList.length);
  const chunks = [];
  for (let i = 0; i < chunkList.length; i += chunkSize) {
    chunks.push(chunkList.slice(i, i + chunkSize));
  }
  await Promise.all(chunks.map( async (chunk) => {
    await createEmbedding(chunk, ip, file_name, apiKey);
  }));

  res.status(StatusCodes.OK).json("OK");
}

export {
  createDocumentHistory,
  getUsersDocuments,
  getUsersDocumentById,
  deleteUsersDocumentById,
  generateEmbedding
}

