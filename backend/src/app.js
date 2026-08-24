// const express=require('express');
import express from 'express'; 
import authRouter from './routes/auth.routes.js';
import interviewRouter from './routes/interview.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';



const app=express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || process.env.NODE_ENV !== "production" || origin === process.env.FRONTEND_URL) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

app.use('/api/auth',authRouter);
app.use('/api/interview/',interviewRouter)
export default app;