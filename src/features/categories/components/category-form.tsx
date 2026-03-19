'use client'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Plus } from 'lucide-react'
import Form from 'next/form'
import InputForm from '@/components/shared/input-form'
import SubmitBtn from '@/components/shared/submit-btn'
import { useForm } from '@/hooks/use-form'
import { categoryAction } from '../actions/categories'
import ErrorMessage from '@/components/shared/error-message'

export default function CategoryForm() {
  const { errors, formAction, isPending, clearErrors } = useForm(categoryAction)
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
          <Plus size={18} />
          <span>Add new category</span>
        </CardTitle>

        <CardDescription className='text-xs sm:text-sm'>
          Create a new category for your products
        </CardDescription>
      </CardHeader>

      <Form
        action={formAction}
        onChange={clearErrors}
        className='space-y-4'
      >
        <CardContent>
          <div className='space-y-2'>
            <InputForm
              label='Category name'
              id='category-name'
              placeholder='Enter category name'
              required
            />
            {/* Error Message */}
            {errors.name && <ErrorMessage error={errors.name[0]} />}
          </div>
        </CardContent>

        <CardFooter>
          <SubmitBtn
            name='Add Category'
            icon={Plus}
            className='w-full'
            pending={isPending}
          />
        </CardFooter>
      </Form>
    </Card>
  )
}