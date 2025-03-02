import { useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"


const profileFormSchema = z.object({
    username: z.string().min(2,{
        message: "Username must be atlist 2 charector"
    }),
    email: z.string().email(),
    name: z.string().min(2,{
        message:"Name must be atlest 2 characters",
    }),
    studentId:z.string(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const defaultValues : Partial<ProfileFormValues> = {
    username:"Flash",
    email:"prayag@gmail.com",
    name: "John Doe",
    studentId: "STU123456",
}




const UserProfile = ()=>{

    const form = useForm<ProfileFormValues>({
        resolver:zodResolver(profileFormSchema),
        defaultValues,
    })

    function handler(){

    }

    return(<div>
        <div>Profile Setting</div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Profile information</CardTitle>
                    <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handler) }>
                            <div>
                                <Avatar>
                                    <AvatarImage src=""></AvatarImage>
                                    <AvatarFallback>FL</AvatarFallback>
                                </Avatar>
                                <Button variant="outline">change photo</Button>
                            </div>
                            <FormField control={form.control} name="name" render={({field})=>(
                                     <FormItem>
                                     <FormLabel>Full name</FormLabel>
                                     <FormControl>
                                         <input placeholder="Enter you Name" {...field}/>
                                     </FormControl>
                                 </FormItem>
                            )}  
                            />
                            <FormField
                            control={form.control}
                            name="email"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Email </FormLabel>
                                    <FormControl>
                                        <input placeholder="Enter your Email" {...field}/>
                                    </FormControl>
                                </FormItem>
                            )} 
                            />

                            <FormField
                            control={form.control}
                            name="studentId"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Student ID</FormLabel>
                                    <FormControl>
                                        <input placeholder="Enter your Student Id" {...field}/>
                                    </FormControl>
                                </FormItem>
                            )} 
                            />
                            <Button type="submit">Update Profile</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    </div>)
}

export default UserProfile;