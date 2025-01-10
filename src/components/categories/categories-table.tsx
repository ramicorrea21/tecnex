'use client'

import { useState, useEffect } from 'react'
import { useCategories } from '@/hooks/use-categories'
import { Button } from '@/components/ui/button'
import { CategoryForm } from './category-form'
import { DeleteCategoryAlert } from './delete-category-alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Edit, Trash2, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Category, CategoryFormData } from '@/types/category'

export function CategoriesTable() {
  const { categories, loading, error, fetchCategories, create, update, remove } = useCategories()
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>()

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleCreate = async (data: CategoryFormData) => {
    await create(data)
    setFormOpen(false)
  }

  const handleUpdate = async (data: CategoryFormData) => {
    if (selectedCategory) {
      await update(selectedCategory.id, data)
      setSelectedCategory(undefined)
      setFormOpen(false)
    }
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setFormOpen(true)
  }

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category)
    setDeleteOpen(true)
  }

  const handleDelete = async () => {
    if (selectedCategory) {
      try {
        setDeleteLoading(true)
        await remove(selectedCategory.id)
        setDeleteOpen(false)
        setSelectedCategory(undefined)
      } finally {
        setDeleteLoading(false)
      }
    }
  }

  const handleCloseForm = () => {
    setSelectedCategory(undefined)
    setFormOpen(false)
  }

  if (loading) {
    return <div>Cargando categorías...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Categorías</h2>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nueva Categoría
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No hay categorías creadas
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.description || '-'}</TableCell>
                <TableCell>
                  <Badge 
                    variant={category.active ? "default" : "secondary"}
                  >
                    {category.active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteClick(category)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <CategoryForm 
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={selectedCategory ? handleUpdate : handleCreate}
        category={selectedCategory}
      />

      <DeleteCategoryAlert 
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false)
          setSelectedCategory(undefined)
        }}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  )
}