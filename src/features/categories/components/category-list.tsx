'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, Pencil, Trash2, MoreVertical } from 'lucide-react'
import { CategoryType } from '@/types/category'
import EditCategoryModal from './edit-category-modal'
import { useState, useEffect } from 'react'

interface CategoryListProps {
  categories: CategoryType[]
}

export default function CategoryList({ categories }: CategoryListProps) {

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [filteredCategories, setFilteredCategories] = useState<CategoryType[]>(categories)

  console.log(activeTab)
  console.log(filteredCategories)

  useEffect(() => {
    let result = [...categories]

    if (activeTab === 'active') {
      result = result.filter((c) => c.status === 'Active')
      console.log(categories.map(c => c.status))
    } else if (activeTab === 'inactive') {
      result = result.filter((c) => c.status === 'Inactive')
      console.log(categories.map(c => c.status))
    }

    setFilteredCategories(result)
  }, [categories, activeTab])

  const handleEditClick = (category: CategoryType) => {
    setSelectedCategory(category)
    setIsEditModalOpen(true)
  }

  const handleTabChang = (value: string) => {
    setActiveTab(value)
  }

  return (
    <>
      <Card>
        {/* Header */}
        <CardHeader className='pb-4'>
          <CardTitle className='text-lg sm:text-xl'>
            Category List
          </CardTitle>

          <Tabs
            value={activeTab}
            onValueChange={handleTabChang}>
            <TabsList className='grid grid-cols-3 mb-4'>
              <TabsTrigger value='all'>All Categories</TabsTrigger>
              <TabsTrigger value='active'>Active</TabsTrigger>
              <TabsTrigger value='inactive'>Inactive</TabsTrigger>
            </TabsList>

            {/* Search */}
            <div className='relative'>
              <Search
                size={16}
                className='absolute left-2 top-2.5 text-muted-foreground'
              />
              <Input
                placeholder='Search categories...'
                className='pl-8'
              />
            </div>
          </Tabs>
        </CardHeader>

        {/* Content */}
        <CardContent>
          <div className='border rounded-md overflow-hidden'>
            {/* Header */}
            <div className='grid grid-cols-12 bg-muted py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium'>
              <div className='col-span-1 hidden sm:block'>No.</div>
              <div className='col-span-6 sm:col-span-5'>Category Name</div>
              <div className='col-span-2 text-center hidden sm:block'>
                Products
              </div>
              <div className='col-span-3 sm:col-span-2 text-center'>
                Status
              </div>
              <div className='col-span-3 sm:col-span-2 text-right'>
                Actions
              </div>
            </div>
          </div>

          <ScrollArea className='h-[350px] sm:h-[420px]'>
            {/* Data */}
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category, index) => (
                <div
                  key={index}
                  className='grid grid-cols-12 py-3 px-2 sm:px-4 border-t items-center text-sm hover:bg-gray-50 transition'
                >
                  {/* No */}
                  <div className='col-span-1 hidden sm:block'>
                    {index + 1}
                  </div>

                  {/* Name */}
                  <div className='col-span-6 sm:col-span-5 truncate pr-2'>
                    {category.name}
                  </div>

                  {/* Products */}
                  <div className='col-span-2 text-center hidden sm:block'>
                    0
                  </div>

                  {/* Status */}
                  <div className='col-span-3 sm:col-span-2 text-center'>
                    <Badge
                      variant={
                        category.status === "Active" ? "default" : "destructive"
                      }
                      className="px-1 sm:px-2"
                    >
                      {category.status}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className='col-span-3 sm:col-span-2 text-right'>

                    {/* Mobile Buttons */}
                    <div className='flex justify-end gap-1 md:hidden'>
                      <Button variant='ghost' size='icon' className='size-7' onClick={() => handleEditClick(category)}>
                        <Pencil size={15} />
                      </Button>
                      <Button variant='ghost' size='icon' className='size-7'>
                        <Trash2 size={15} />
                      </Button>
                    </div>

                    {/* Desktop Dropdown */}
                    <div className='hidden md:block'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='size-8'
                          >
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem onClick={() => handleEditClick(category)}>
                            <Pencil size={15} />
                            <span className='ml-2'>Edit</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem>
                            <Trash2
                              size={15}
                              className='text-destructive'
                            />
                            <span className='ml-2 text-destructive'>
                              Delete
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <div className='py-8 text-center text-muted-foreground'>
                No categories found matching your search
              </div>
            )}

          </ScrollArea>
        </CardContent>
      </Card>
      <EditCategoryModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        category={selectedCategory} />
    </>
  )
}