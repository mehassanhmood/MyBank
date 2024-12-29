"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import CustomInput from './CustomInput'

import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import { authFormSchema } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import SignUp from '@/app/(auth)/sign-up/page'
import { useRouter } from 'next/navigation'

import {signIn, signUp} from "@/lib/actions/user.actions";



// since the following code is also required in the CustomInput Component, it is better to move it
// ot a seperate file from which it can be reused.
// const formSchema = z.object({
//   email: z.string().email()
// })
 
const AuthForm = ({type}: {type:string}) => {
    
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const formSchema  = authFormSchema(type);


  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address1: "",
      state: "",
      city: "",
      postalCode: "",
      dateOfBirth: "",
      ssn: "",
    },
  })
  // 2. Define a submit handler.
  const onSubmit = async ( values: z.infer<typeof formSchema> ) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true)

    try {
      // sign up with the app-write and make a plaid token

      if (type === "sign-up") {
        const newUser = await signUp(values)
        setUser(newUser)
      }
      if (type === "sign-in") {
        const response = await signIn({
          email: values.email,
          password: values.password
        })
        if (response) router.push("/")
      }

    } catch (error) { 
      console.log(error)
    } finally {
      setIsLoading(false)
    }

    console.log(values)
  }

  return (
    <section className='min-h-screen w-full  max-w-[420px] flex flex-col justify-center gap-5 py-10 md:gap-8'>
      <header className='flex flex-col gap-5 md:gap-8'>
        <Link href={"/"} className='cursor-pointer flex items-center gap-1'>
            <Image src={"/icons/logo.svg"} width={34} height={34} alt='My Bank Logo'/>
            <h1 className='text-26 font-bold text-black-1'>
                My Banks
            </h1>
        </Link>
        <div className='flex flex-col gap-1 md:gap-3'>
        <h1 className='text-24 lg:text-36 font-semibold text-gray-900'>
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
        </h1>
        <p className='text-16 font-normal text-gray-600'>
            {user ? "Link your account to get started" : "Please enter your details"}
        </p>
      </div>
      </header>
        {user ? (
            <div className='flex flex-col gap-4'>
                Plaid Link
            </div>
        ) : (
            <>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {type === "sign-up" &&(
                    <>
                    <div className='flex  gap-4'>
                      <CustomInput control={form.control} name={"firstName"} label={"First Name"} placeholder={"Enter your first name"} />
                      <CustomInput control={form.control} name={"lastName"} label={"Last Name"} placeholder={"Enter your last name"} />
                    </div>

                      <CustomInput control={form.control} name={"address1"} label={"Address"} placeholder={"Enter your address"} />
                      <CustomInput control={form.control} name={"city"} label={"City"} placeholder={"Enter your city"} />
                    
                      <div className='flex gap-4'> 
                        <CustomInput control={form.control} name={"state"} label={"State"} placeholder={"ex: ON"} />
                        <CustomInput control={form.control} name={"postalCode"} label={"Postal Code"} placeholder={"ex: A1B 2C3"} />
                      </div>
                      <div className='flex gap-4'>
                        <CustomInput control={form.control} name={"dateOfBirth"} label={"Data of Birth"} placeholder={"yyy-mm-dd"} /> 
                        <CustomInput control={form.control} name={"ssn"} label={"SSN"} placeholder={"ex: 1234"} />
                      </div>
                    </>
                  )}

                  <CustomInput control={form.control} name={"email"} label={"Email"} placeholder={"Enter your email"} />
                  <CustomInput control={form.control} name={"password"} label={"Password"} placeholder={"Enter your password"} />

                  <div className='flex flex-col gap-4'>
                  <Button type="submit" className='form-btn' disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2  size={20} className='animate-spin'/> &nbsp;
                        Loading...
                      </>
                    ): type === "sign-in" ?  "Sign In" : "Sign Up"}
                  </Button>
                  </div>

                </form>
              </Form>
              <footer className='flex justify-center gap-1'>
                <p className='text-14 font-normal text-gray-600'>
                  {type === "sign-in" 
                  ? "Don't have an account?"
                  : "Already have an account?"}
                </p>
                <Link href={type === "sign-in" ? "/sign-up" : "/sign-in"} className='form-link'>
                    {type === "sign-in"? "Sign Up" : "Sign In"}
                </Link>
              </footer>
            </>
            )
        }
    </section>
  )
}

export default AuthForm
