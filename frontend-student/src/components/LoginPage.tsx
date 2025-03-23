import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form"
import * as z from "zod"
import { useForm } from "react-hook-form";
import axios from "axios";
import { Input } from "./ui/input";
import Cookies from "js-cookie";


const  loginFormSchema = z.object({
        email:z.string().email(),
        password: z.string().min(4)
    });

type loginFormValues = z.infer<typeof loginFormSchema>


export const LoginPage = ()=>{

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
        // Cookies.set("token",token.toekn,{expires:1,secure:false});
        alert("yay, login sucseccful!");
    }

    return(<div>
        <div className="p-4 w-2xl" id='page'>
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
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    </div>)
}