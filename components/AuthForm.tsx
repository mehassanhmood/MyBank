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




// since the following code is also required in the CustomInput Component, it is better to move it
// ot a seperate file from which it can be reused.
// const formSchema = z.object({
//   email: z.string().email()
// })
 
const AuthForm = ({type}: {type:string}) => {
    
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: "",
      username: "",
      password: ""
    },
  })
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof authFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true)
    console.log(values)
    setIsLoading(false)
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
                  <CustomInput control={form.control} name={"email"} label={"Email"} placeholder={"Enter your email"} />
                  <CustomInput control={form.control} name={"password"} label={"Password"} placeholder={"Enter your password"} />
                  <Button type="submit" className='form-btn' disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2  size={20} className='animate-spin'/> &nbsp;
                        Loading...
                      </>
                    ): type === "sign-in" ?  "Sign In" : "Sign Up"}
                  </Button>
                </form>
              </Form>
            </>
            )
        }
    </section>
  )
}

export default AuthForm
