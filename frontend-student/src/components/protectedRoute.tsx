import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({children}:{children:React.ReactNode})=>{
    const tk = localStorage.getItem("token");

    // if(!tk || tk.trim()==""){
    //     return <Navigate to="/login"/>
    // }

    return<>{children}</>
}