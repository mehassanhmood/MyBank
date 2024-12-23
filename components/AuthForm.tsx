"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
const AuthForm = ({type}: {type:string}) => {
    
    const [user, setUser] = useState(null)

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
            Form
            </>
            )
        }
    </section>
  )
}

export default AuthForm
