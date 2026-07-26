import express from 'express';
import { registerUserController,loginUserController,logoutUserController,getmeController } from '../controllers/auth.controller.js';
import authUser from '../middlewares/auth.middlewares.js';
const authRouter=express.Router();


/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post('/register',registerUserController);

/**
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access public
 */
authRouter.post('/login',loginUserController);

/** 
 * @route GET /api/auth/logout
 * @description clear token from cookie and add the token to blacklist
 * @access public
 */
authRouter.get('/logout',logoutUserController);

/** 
 * @route GET /api/auth/getme
 * @description get the logged in user details
 * @access private
 */
authRouter.get('/getme',authUser,getmeController);


export default authRouter;