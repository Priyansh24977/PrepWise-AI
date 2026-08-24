import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    withCredentials: true,
});

export async function sendOtp({ username, email }) {
    try {
        const response = await api.post('/api/auth/send-otp', {
            username, email
        });
        return response.data;
    } catch (err) {
        console.log(err.response?.data);
        throw err;
    }
}

export async function registerWithOtp({ username, email, password, otp }) {
    try {
        const response = await api.post('/api/auth/register-with-otp', {
            username, email, password, otp
        });
        return response.data;
    } catch (err) {
        console.log(err.response?.data);
        throw err;
    }
}

export async function register({username,email,password}){
    try{
        const response =await api.post('/api/auth/register',{
            username,email,password
        })
        return response.data;
    }
    catch (err) {
  console.log(err.response?.data);
  throw err;
    }
}

export async function login({email,password}) {
   try{
        const response =await api.post('/api/auth/login',{
            email,password
        })
        return response.data;
    }
    catch(err){
        console.log(err.response?.data);
    throw err;

        
    } 
}

export async function logout(){
    try{
        const response=await api.get('/api/auth/logout')
        return response.data;

    }
     catch(err){
        console.log(err);
    throw err;

        
    } 
}

export async function getMe(){
    try{
        const response=await api.get('/api/auth/getme');
        return response.data; 
    }
     catch(err){
        console.log(err);
        throw err;

        
    } 
}

