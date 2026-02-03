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
import { ArrowUpDown, Search, BookOpen, Edit2, Trash2 } from 'lucide-react'
import { Popup } from '@/utils/popup'
import type { CreateLeaveTypeType, GetLeaveTypeType } from '@/utils/type'
import { useInitializeUser, userDataAtom } from '@/utils/user'
import { useAtom } from 'jotai'
import {
  useAddLeaveType,
  useDeleteLeaveType,
  useGetLeaveTypes,
  useUpdateLeaveType,
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

const LeaveTypes = () => {
  useInitializeUser()
  const [userData] = useAtom(userDataAtom)

  const { data: leaveTypes } = useGetLeaveTypes()
  console.log('🚀 ~ LeaveTypes ~ leaveTypes:', leaveTypes)

  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [leaveTypesPerPage] = useState(10)
  const [sortColumn, setSortColumn] =
    useState<keyof GetLeaveTypeType>('leaveTypeName')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [searchTerm, setSearchTerm] = useState('')

  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingLeaveTypeId, setEditingLeaveTypeId] = useState<number | null>(
    null
  )

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingLeaveTypeId, setDeletingLeaveTypeId] = useState<
    number | null
  >(null)

  const [formData, setFormData] = useState<CreateLeaveTypeType>({
    leaveTypeName: '',
    totalLeaves: 0,
    createdBy: userData?.userId || 0,
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const resetForm = useCallback(() => {
    setFormData({
      leaveTypeName: '',
      totalLeaves: 0,
      createdBy: userData?.userId || 0,
    })
    setEditingLeaveTypeId(null)
    setIsEditMode(false)
    setIsPopupOpen(false)
    setError(null)
  }, [userData?.userId])

  const closePopup = useCallback(() => {
    setIsPopupOpen(false)
    setError(null)
    resetForm()
  }, [resetForm])

  const addMutation = useAddLeaveType({
    onClose: closePopup,
    reset: resetForm,
  })

  const updateMutation = useUpdateLeaveType({
    onClose: closePopup,
    reset: resetForm,
  })

  const deleteMutation = useDeleteLeaveType({
    onClose: closePopup,
    reset: resetForm,
  })

  const handleSort = (column: keyof GetLeaveTypeType) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const filteredLeaveTypes = useMemo(() => {
    if (!leaveTypes?.data) return []
    return leaveTypes.data?.filter((leaveType) =>
      leaveType.leaveTypeName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [leaveTypes?.data, searchTerm])

  const sortedLeaveTypes = useMemo(() => {
    return [...filteredLeaveTypes].sort((a, b) => {
      const aValue = a.leaveTypeName ?? ''
      const bValue = b.leaveTypeName ?? ''
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    })
  }, [filteredLeaveTypes, sortDirection])

  const paginatedLeaveTypes = useMemo(() => {
    const startIndex = (currentPage - 1) * leaveTypesPerPage
    return sortedLeaveTypes.slice(startIndex, startIndex + leaveTypesPerPage)
  }, [sortedLeaveTypes, currentPage, leaveTypesPerPage])

  const totalPages = Math.ceil(sortedLeaveTypes.length / leaveTypesPerPage)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      setError(null)

      try {
        const submitData: CreateLeaveTypeType = {
          leaveTypeName: formData.leaveTypeName,
          totalLeaves: formData.totalLeaves,
          createdBy: formData.createdBy,
        }

        if (isEditMode) {
          submitData.updatedBy = userData?.userId || 0
        } else {
          submitData.createdBy = userData?.userId || 0
        }

        if (isEditMode && editingLeaveTypeId) {
          updateMutation.mutate({
            id: editingLeaveTypeId,
            data: submitData,
          })
          console.log('update', isEditMode, editingLeaveTypeId)
        } else {
          addMutation.mutate(submitData)
          console.log('create')
        }
      } catch (err) {
        setError('Failed to save leaveType')
        console.error(err)
      }
    },
    [
      formData,
      isEditMode,
      editingLeaveTypeId,
      addMutation,
      updateMutation,
      userData,
    ]
  )

  useEffect(() => {
    if (addMutation.error || updateMutation.error) {
      setError('Error saving leaveType')
    }
  }, [addMutation.error, updateMutation.error])

  const handleEditClick = (leaveType: any) => {
    setFormData({
      leaveTypeName: leaveType.leaveTypeName,
      totalLeaves: leaveType.totalLeaves,
      createdBy: userData?.userId || 0,
    })
    setEditingLeaveTypeId(leaveType.leaveTypeId)
    setIsEditMode(true)
    setIsPopupOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-amber-100 p-2 rounded-md">
            <BookOpen className="text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold">Leave Types</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search leaveTypes..."
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
                onClick={() => handleSort('leaveTypeName')}
                className="cursor-pointer"
              >
                Leave Type Name <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead
                onClick={() => handleSort('totalLeaves')}
                className="cursor-pointer"
              >
                Total Leaves (Days)<ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!leaveTypes || leaveTypes.data === undefined ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  Loading leave types...
                </TableCell>
              </TableRow>
            ) : !leaveTypes.data || leaveTypes.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  No leave types found
                </TableCell>
              </TableRow>
            ) : paginatedLeaveTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  No leave types match your search
                </TableCell>
              </TableRow>
            ) : (
              paginatedLeaveTypes.map((leaveType: any, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {leaveType.leaveTypeName}
                  </TableCell>
                  <TableCell className="font-medium">
                    {leaveType.totalLeaves}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-amber-600 hover:text-amber-700"
                        onClick={() => handleEditClick(leaveType)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => {
                          setDeletingLeaveTypeId(leaveType.leaveTypeId)
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

      {sortedLeaveTypes.length > 0 && (
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
        title={isEditMode ? 'Edit LeaveType' : 'Add LeaveType'}
        size="sm:max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="leaveTypeName">
                Leave Type Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="leaveTypeName"
                name="leaveTypeName"
                value={formData.leaveTypeName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalLeaves">
                Total Leaves <span className="text-red-500">*</span>
              </Label>
              <Input
                id="totalLeaves"
                name="totalLeaves"
                value={formData.totalLeaves}
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
            <AlertDialogTitle>Delete LeaveType</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this leaveType? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingLeaveTypeId) {
                  deleteMutation.mutate({ id: deletingLeaveTypeId })
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

export default LeaveTypes
