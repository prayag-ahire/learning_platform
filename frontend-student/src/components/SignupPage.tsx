import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form"
import * as z from "zod"
import { useForm } from "react-hook-form";
import axios from "axios";
// import Cookies from "js-cookie";
import { Input } from "./ui/input";
import { Link } from "react-router-dom";


const  loginFormSchema = z.object({
        name: z.string().trim().min(2,{
            message:"username must be atlist 2 characher"
        }),
        email: z.string().email(),
        password: z.string().min(4),
        confirmPassword: z.string().min(4),
        }).superRefine(({confirmPassword,password},ctx)=>{
            if(confirmPassword !== password){
                ctx.addIssue({
                    code: "custom",
                    message: "The password did not metch",
                    path:['confirmPassword']
                });
            }
        });

type loginFormValues = z.infer<typeof loginFormSchema>


export const SignupPage = ()=>{

     const form = useForm<loginFormValues>({
            resolver:zodResolver(loginFormSchema),
            defaultValues:{
                name:"prayag",
                email:"",
                password:"",
                confirmPassword:""
            }
        })

    async function handler(values:loginFormValues){
        console.log(values.name);
        const response = await axios.post("http://localhost:3000/api/v1/student/signup",{
            name: values.name,
            email: values.email,
            password: values.password
        });
        const token = await response.data;

        // localStorage.getItem("token",token);
        alert("Signup successful")
        console.log(token);
    }



    return(<div>
        <div className="p-4 w-2xl" id='page'>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl"> SignUp </CardTitle>
                    <CardDescription>Welcome To your Favoraite Platform </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handler)}>
                            <div className="mb-4 border-1 rounded-2xl p-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field})=>(
                                <FormItem>
                                    <FormLabel>UserName</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="text" placeholder="Enter your name" />
                                    </FormControl>
                                </FormItem>
                                )}
                                />
                                </div> 

                                <div className="mb-4 border-1 rounded-2xl p-2">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field})=>(
                                <FormItem>
                                    <FormLabel>email</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="email" placeholder="Enter your gmail" />
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
                                        <Input {...field} type="password" placeholder="Enter your password" />
                                    </FormControl>
                                </FormItem>
                                )}
                                />
                                </div>
                                <div className="mb-4 border-1 rounded-2xl p-2">
                                 <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({field})=>(
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="ReEnter your password" type="password"/>
                                    </FormControl>
                                </FormItem>
                                )}
                                />
                                </div>
                                <Button type="submit">Sign Up</Button>
                                <p>Already have an account <Link to="/login" className="underline">Login</Link></p>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    </div>)
}