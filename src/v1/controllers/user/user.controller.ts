import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import User from '../../models/user';

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user = await User.findOne({where: {id: parseInt(`${id}`)}});
  if (!user) {
    return next({
      status: StatusCodes.NOT_FOUND,
      message: "User no exist!"
    })
  }
  res.status(StatusCodes.OK).json({user})
}

const updateUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { data } = req.body;
  const user = await User.findOne({where: {id: parseInt(`${id}`)}});
  if (!user) {
    return next({
      status: StatusCodes.NOT_FOUND,
      message: "User no exist!"
    });
  }
  await User.update({...data}, {
    where: { id: parseInt(`${id}`) },
  });
  const updatedUser = await User.findOne({where: {id: parseInt(`${id}`)}});
  res.status(StatusCodes.OK).json({user: updatedUser});
}

export {getUserById, updateUserById}