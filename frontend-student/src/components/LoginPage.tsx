import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form"
import * as z from "zod"
import { useForm } from "react-hook-form";
import axios from "axios";
import { Input } from "./ui/input";
import {ToastContainer ,toast} from "react-toastify"
import { Link,  useNavigate } from "react-router-dom";
import { useEffect } from "react";


const  loginFormSchema = z.object({
        email:z.string().email(),
        password: z.string().min(4)
    });

type loginFormValues = z.infer<typeof loginFormSchema>


export const LoginPage = ()=>{

    const navigate = useNavigate();

    useEffect(()=>{
        console.log(localStorage.getItem("token"));
        console.log("this is login page")
    },[])
     const form = useForm<loginFormValues>({
            resolver:zodResolver(loginFormSchema),
            defaultValues:{
                email:"",
                password:""
            }
        })

    async function handler(values:loginFormValues){
        console.log("login enter");
        console.log(values.email,values.password);
        const response = await axios.post("http://localhost:3000/api/v1/student/login",{
            email: values.email,
            password:values.password

        });
        const token = await response.data;
        console.log(token.token);
        localStorage.setItem("token",token.token);
        toast("yay, login sucseccful!")
        navigate("/")
    }

    return(<div>
        <div className="p-4 w-2xl" id='page'>
            <ToastContainer/>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl"> Login </CardTitle>
                    <CardDescription>Welcome To your Favoraite Platform </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handler)}>
                            <div className="mb-4 border-1 rounded-2xl p-2">
                            <FormField
                                control={form.control}
                                name="email" 
                                render={({field})=>(
                                <FormItem>
                                    <FormLabel>email</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter your " />
                                    </FormControl>
                                </FormItem>
                                )}
                                />
                                </div>
                                <div className="mb-4 border-1 rounded-2xl p-2">
                                 <FormField
                                control={form.control}
                                name="password"
                                render={({field})=>(
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter your password" />
                                    </FormControl>
                                </FormItem>
                                )}
                                />
                                </div>
                               
                                <Button type="submit">Login</Button>
                                <p >Register as new user <Link to="/signup" className="underline">Signup</Link></p>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    </div>)
}