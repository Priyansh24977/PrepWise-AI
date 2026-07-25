import { useAuth } from "../hooks/useAuth";
// import { Navigate } from "react-router";
import {Navigate } from "react-router";
import LoadingScreen from '../../../components/LoadingScreen.jsx';

 const Protected=({children})=>{
    const {loading,user}=useAuth();
    if(loading){
      return (<main><h1><LoadingScreen/></h1></main>)

    }

    if(!user){
        return <Navigate to={'/login'} />
    }

    return children;

}

export default Protected;