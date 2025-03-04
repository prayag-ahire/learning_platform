import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form"
import * as z from "zod"
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

const  loginFormSchema = z.object({
        name: z.string().trim().min(2,{
            message:"username must be atlist 2 characher"
        }),
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

    const [username,setusername] = useState(""
        
    );
     const form = useForm<loginFormValues>({
            resolver:zodResolver(loginFormSchema)
        })

    async function handler(){
        const response = await axios.post("https://learning-platform-1oks.onrender.com/api/v1/student/ssignup",{

        });
        const token = await response.data;
    }

    return(<div>
        <div className="" id='page'>
            <Card>
                <CardHeader>
                    <CardTitle>Login </CardTitle>
                    <CardDescription>Welcome To your Favoraite Platform </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handler)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={()=>(
                                <FormItem>
                                    <FormLabel>UserName</FormLabel>
                                    <FormControl>
                                        <input placeholder="Enter your " onChange={()=>{}}/>
                                    </FormControl>
                                </FormItem>
                                )}
                                />
                                 <FormField
                                control={form.control}
                                name="password"
                                render={()=>(
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <input placeholder="Enter your password" />
                                    </FormControl>
                                </FormItem>
                                )}
                                />
                                 <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={()=>(
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <input placeholder="ReEnter your password" />
                                    </FormControl>
                                </FormItem>
                                )}
                                />
                                <Button>Sign Up</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    </div>)
}