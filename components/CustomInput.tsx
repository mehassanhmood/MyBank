import React from 'react'
import {
    FormField,
    FormLabel,
    FormControl,
    FormMessage
} from "@/components/ui/form";
import {z} from "zod";
import {Input} from "@/components/ui/input";
import {Control, FieldPath} from "react-hook-form";
import { authFormSchema } from '@/lib/utils';

interface CustomInput {
    control: Control<z.infer<typeof authFormSchema>> ,
    name: FieldPath<z.infer<typeof authFormSchema>>,
    label: string,
    placeholder: string
}


const CustomInput = ({name, control, label, placeholder}: CustomInput) => {
  return (
    <FormField
        control={control}
        name = { name }
        render={({ field }) => (
        <div className='form-item'>
            <FormLabel className='form-label'>
                {label}
            </FormLabel>
            <div className='flex flex-col w-full'>
            <FormControl>
                <Input id={name} placeholder={placeholder} className='input-class' type= {name === "password" ? "password" : "text"}
                {...field}
                />
            </FormControl>
            <FormMessage className='form-message mt-2' />
            </div>
        </div>
        )}
    />
  )
}

export default CustomInput
