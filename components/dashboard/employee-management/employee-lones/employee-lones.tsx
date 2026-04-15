'use client'

import type React from 'react'
import { useCallback, useEffect, useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { ArrowUpDown, Search, Banknote, Edit2, Trash2 } from 'lucide-react'
import { Popup } from '@/utils/popup'
import type { CreateLoneType, GetLoneType } from '@/utils/type'
import { useInitializeUser, userDataAtom } from '@/utils/user'
import { useAtom } from 'jotai'
import {
  useAddLone,
  useDeleteLone,
  useGetLones,
  useUpdateLone,
} from '@/hooks/use-api'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const EmployeeLones = () => {
  useInitializeUser()
  const [userData] = useAtom(userDataAtom)

  const { data: lones } = useGetLones()
  console.log('🚀 ~ EmployeeLones ~ lones:', lones)

  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [lonesPerPage] = useState(10)
  const [sortColumn, setSortColumn] = useState<keyof GetLoneType>('loneName')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [searchTerm, setSearchTerm] = useState('')

  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingLoneId, setEditingLoneId] = useState<number | null>(null)

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingLoneId, setDeletingLoneId] = useState<number | null>(null)

  const [formData, setFormData] = useState<CreateLoneType>({
    loneName: '',
    loneDate: '',
    employeeId: 0,
    amount: 0,
    createdBy: userData?.userId || 0,
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'employeeId' ? Number(value) : value,
    }))
  }

  const resetForm = useCallback(() => {
    setFormData({
      loneName: '',
      loneDate: '',
      employeeId: 0,
      amount: 0,
      createdBy: userData?.userId || 0,
    })
    setEditingLoneId(null)
    setIsEditMode(false)
    setIsPopupOpen(false)
    setError(null)
  }, [userData?.userId])

  const closePopup = useCallback(() => {
    setIsPopupOpen(false)
    setError(null)
    resetForm()
  }, [resetForm])

  const addMutation = useAddLone({
    onClose: closePopup,
    reset: resetForm,
  })

  const updateMutation = useUpdateLone({
    onClose: closePopup,
    reset: resetForm,
  })

  const deleteMutation = useDeleteLone({
    onClose: closePopup,
    reset: resetForm,
  })

  const handleSort = (column: keyof GetLoneType) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const filteredLones = useMemo(() => {
    if (!lones?.data) return []
    return lones.data?.filter(
      (lone) =>
        lone.loneName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lone.employeeName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [lones?.data, searchTerm])

  const sortedLones = useMemo(() => {
    return [...filteredLones].sort((a, b) => {
      const aValue = (a[sortColumn] ?? '') as string
      const bValue = (b[sortColumn] ?? '') as string
      return sortDirection === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue))
    })
  }, [filteredLones, sortColumn, sortDirection])

  const paginatedLones = useMemo(() => {
    const startIndex = (currentPage - 1) * lonesPerPage
    return sortedLones.slice(startIndex, startIndex + lonesPerPage)
  }, [sortedLones, currentPage, lonesPerPage])

  const totalPages = Math.ceil(sortedLones.length / lonesPerPage)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      setError(null)

      try {
        const submitData: CreateLoneType = {
          loneName: formData.loneName,
          loneDate: formData.loneDate,
          employeeId: formData.employeeId,
          amount: formData.amount,
          createdBy: formData.createdBy,
        }

        if (isEditMode) {
          submitData.updatedBy = userData?.userId || 0
        } else {
          submitData.createdBy = userData?.userId || 0
        }

        if (isEditMode && editingLoneId) {
          updateMutation.mutate({
            id: editingLoneId,
            data: submitData as GetLoneType,
          })
          console.log('update', isEditMode, editingLoneId)
        } else {
          addMutation.mutate(submitData)
          console.log('create')
        }
      } catch (err) {
        setError('Failed to save lone')
        console.error(err)
      }
    },
    [formData, isEditMode, editingLoneId, addMutation, updateMutation, userData]
  )

  useEffect(() => {
    if (addMutation.error || updateMutation.error) {
      setError('Error saving lone')
    }
  }, [addMutation.error, updateMutation.error])

  const handleEditClick = (lone: any) => {
    setFormData({
      loneName: lone.loneName,
      loneDate: lone.loneDate,
      employeeId: lone.employeeId,
      amount: lone.amount,
      createdBy: userData?.userId || 0,
    })
    setEditingLoneId(lone.loneId)
    setIsEditMode(true)
    setIsPopupOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-amber-100 p-2 rounded-md">
            <Banknote className="text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold">Employee Lones</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search lones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button
            className="bg-amber-400 hover:bg-amber-500 text-black"
            onClick={() => setIsPopupOpen(true)}
          >
            Add
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-amber-100">
            <TableRow>
              <TableHead>Sl No.</TableHead>
              <TableHead
                onClick={() => handleSort('employeeName')}
                className="cursor-pointer"
              >
                Employee Name <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead
                onClick={() => handleSort('empCode')}
                className="cursor-pointer"
              >
                Emp Code <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead
                onClick={() => handleSort('loneName')}
                className="cursor-pointer"
              >
                Lone Name <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead
                onClick={() => handleSort('loneDate')}
                className="cursor-pointer"
              >
                Lone Date <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead
                onClick={() => handleSort('designationName')}
                className="cursor-pointer"
              >
                Designation <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead
                onClick={() => handleSort('departmentName')}
                className="cursor-pointer"
              >
                Department <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!lones || lones.data === undefined ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Loading lones...
                </TableCell>
              </TableRow>
            ) : !lones.data || lones.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No lones found
                </TableCell>
              </TableRow>
            ) : paginatedLones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No lones match your search
                </TableCell>
              </TableRow>
            ) : (
              paginatedLones.map((lone: any, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {lone.employeeName}
                  </TableCell>
                  <TableCell>{lone.empCode}</TableCell>
                  <TableCell>{lone.loneName}</TableCell>
                  <TableCell>{lone.loneDate}</TableCell>
                  <TableCell>{lone.designationName}</TableCell>
                  <TableCell>{lone.departmentName}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-amber-600 hover:text-amber-700"
                        onClick={() => handleEditClick(lone)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => {
                          setDeletingLoneId(lone.loneId)
                          setIsDeleteDialogOpen(true)
                        }}
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
      </div>

      {sortedLones.length > 0 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={
                    currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                  }
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, index) => {
                if (
                  index === 0 ||
                  index === totalPages - 1 ||
                  (index >= currentPage - 2 && index <= currentPage + 2)
                ) {
                  return (
                    <PaginationItem key={`page-${index}`}>
                      <PaginationLink
                        onClick={() => setCurrentPage(index + 1)}
                        isActive={currentPage === index + 1}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )
                } else if (
                  index === currentPage - 3 ||
                  index === currentPage + 3
                ) {
                  return (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationLink>...</PaginationLink>
                    </PaginationItem>
                  )
                }

                return null
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    currentPage === totalPages
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <Popup
        isOpen={isPopupOpen}
        onClose={closePopup}
        title={isEditMode ? 'Edit Lone' : 'Add Lone'}
        size="sm:max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="loneName">
                Lone Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="loneName"
                name="loneName"
                value={formData.loneName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loneDate">
                Lone Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="loneDate"
                name="loneDate"
                type="date"
                value={formData.loneDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeId">
                Employee ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="employeeId"
                name="employeeId"
                type="number"
                value={formData.employeeId || ''}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={closePopup}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addMutation.isPending || updateMutation.isPending}
            >
              {addMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : 'Save'}
            </Button>
          </div>
        </form>
      </Popup>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lone</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this lone? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingLoneId) {
                  deleteMutation.mutate({ id: deletingLoneId })
                }
                setIsDeleteDialogOpen(false)
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default EmployeeLones
