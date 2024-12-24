"use client"
import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetClose,
    SheetTrigger,
  } from "@/components/ui/sheet"
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { sidebarLinks } from '@/constants'
import { usePathname } from 'next/navigation'

const MobileNavbar = ({user}: MobileNavProps) => {

    const pathname = usePathname();

  return (
    <section className='w-full max-w-[264px]'>
      <Sheet>
        <SheetTrigger>
            <Image src={"/icons/hamburger.svg"} width={30} height={30} alt='Menu' className='cursor-pointer'/>
        </SheetTrigger>
        <SheetContent side={"left"} className='border-none bg-white'>
            <Link href={"/"} className='flex mb-12 cursor-pointer items-center gap-1 px-4'>
                    <Image src={"/icons/logo.svg"} width={34} height={34} alt='MyBanks Logo'
                    
                    />
                        <h1 className='text-26 text-black-1'>MyBanks</h1>               
                </Link>
                <div className='mobilenav-sheet'>
                    <SheetClose asChild>
                        <nav className='flex h-full flex-col gap-6 text-white'>
                            {sidebarLinks.map((item) =>
                            { 
                            const isActive = 
                            pathname === item.route || pathname.startsWith(`${item.route}/`)
                            return (
                            <SheetClose asChild key={item.label}>
                                <Link href={item.route}
                                key={item.label} 
                                className={cn('mobilenav-sheet_close w-full', { 'bg-bank-gradient': isActive})}
                                >
                                    
                                    <Image src={item.imgURL} alt={item.label}
                                    className={cn({'brightness-[3] invert-0': isActive})}
                                    width={20}
                                    height={20}
                                    />
                                    
                                    <p className={cn('text-16 font-semibold text-black-2', {"!text-white": isActive})}>
                                        {item.label}
                                    </p> 
                                </Link>
                            </SheetClose> )}
                        )}
                    USER
                    </nav>
                </SheetClose>
                FOOTER
            </div>
        </SheetContent>
    </Sheet>

    </section>
  )
}

export default MobileNavbar