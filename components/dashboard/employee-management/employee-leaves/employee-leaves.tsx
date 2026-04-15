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
import { ArrowUpDown, Search, CalendarDays, Edit2, Trash2 } from 'lucide-react'
import { Popup } from '@/utils/popup'
import type {
  CreateEmployeeLeaveType,
  GetEmployeeLeaveType,
} from '@/utils/type'
import { useInitializeUser, userDataAtom } from '@/utils/user'
import { useAtom } from 'jotai'
import {
  useAddEmployeeLeave,
  useDeleteEmployeeLeave,
  useGetEmployeeLeaves,
  useUpdateEmployeeLeave,
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

const EmployeeLeaves = () => {
  useInitializeUser()
  const [userData] = useAtom(userDataAtom)

  const { data: employeeLeaves } = useGetEmployeeLeaves()
  console.log('🚀 ~ EmployeeLeaves ~ employeeLeaves:', employeeLeaves)

  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [leavesPerPage] = useState(10)
  const [sortColumn, setSortColumn] =
    useState<keyof GetEmployeeLeaveType>('employeeName')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [searchTerm, setSearchTerm] = useState('')

  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingLeaveId, setEditingLeaveId] = useState<number | null>(null)

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingLeaveId, setDeletingLeaveId] = useState<number | null>(null)

  const [formData, setFormData] = useState<CreateEmployeeLeaveType>({
    employeeId: 0,
    startDate: '',
    endDate: '',
    noOfDays: 0,
    leaveTypeId: 0,
    description: '',
    createdBy: userData?.userId || 0,
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'employeeId' || name === 'noOfDays' || name === 'leaveTypeId'
          ? Number(value)
          : value,
    }))
  }

  const resetForm = useCallback(() => {
    setFormData({
      employeeId: 0,
      startDate: '',
      endDate: '',
      noOfDays: 0,
      leaveTypeId: 0,
      description: '',
      createdBy: userData?.userId || 0,
    })
    setEditingLeaveId(null)
    setIsEditMode(false)
    setIsPopupOpen(false)
    setError(null)
  }, [userData?.userId])

  const closePopup = useCallback(() => {
    setIsPopupOpen(false)
    setError(null)
    resetForm()
  }, [resetForm])

  const addMutation = useAddEmployeeLeave({
    onClose: closePopup,
    reset: resetForm,
  })

  const updateMutation = useUpdateEmployeeLeave({
    onClose: closePopup,
    reset: resetForm,
  })

  const deleteMutation = useDeleteEmployeeLeave({
    onClose: closePopup,
    reset: resetForm,
  })

  const handleSort = (column: keyof GetEmployeeLeaveType) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const filteredLeaves = useMemo(() => {
    if (!employeeLeaves?.data) return []
    return employeeLeaves.data?.filter(
      (leave) =>
        leave.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.leaveTypeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.empCode?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [employeeLeaves?.data, searchTerm])

  const sortedLeaves = useMemo(() => {
    return [...filteredLeaves].sort((a, b) => {
      const aValue = (a[sortColumn] ?? '') as string
      const bValue = (b[sortColumn] ?? '') as string
      return sortDirection === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue))
    })
  }, [filteredLeaves, sortColumn, sortDirection])

  const paginatedLeaves = useMemo(() => {
    const startIndex = (currentPage - 1) * leavesPerPage
    return sortedLeaves.slice(startIndex, startIndex + leavesPerPage)
  }, [sortedLeaves, currentPage, leavesPerPage])

  const totalPages = Math.ceil(sortedLeaves.length / leavesPerPage)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      setError(null)

      try {
        const submitData: CreateEmployeeLeaveType = {
          employeeId: formData.employeeId,
          startDate: formData.startDate,
          endDate: formData.endDate,
          noOfDays: formData.noOfDays,
          leaveTypeId: formData.leaveTypeId,
          description: formData.description,
          createdBy: formData.createdBy,
        }

        if (isEditMode) {
          submitData.updatedBy = userData?.userId || 0
        } else {
          submitData.createdBy = userData?.userId || 0
        }

        if (isEditMode && editingLeaveId) {
          updateMutation.mutate({
            id: editingLeaveId,
            data: submitData as GetEmployeeLeaveType,
          })
          console.log('update', isEditMode, editingLeaveId)
        } else {
          addMutation.mutate(submitData)
          console.log('create')
        }
      } catch (err) {
        setError('Failed to save employee leave')
        console.error(err)
      }
    },
    [
      formData,
      isEditMode,
      editingLeaveId,
      addMutation,
      updateMutation,
      userData,
    ]
  )

  useEffect(() => {
    if (addMutation.error || updateMutation.error) {
      setError('Error saving employee leave')
    }
  }, [addMutation.error, updateMutation.error])

  const handleEditClick = (leave: any) => {
    setFormData({
      employeeId: leave.employeeId,
      startDate: leave.startDate,
      endDate: leave.endDate,
      noOfDays: leave.noOfDays,
      leaveTypeId: leave.leaveTypeId,
      description: leave.description || '',
      createdBy: userData?.userId || 0,
    })
    setEditingLeaveId(leave.employeeLeaveId)
    setIsEditMode(true)
    setIsPopupOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-amber-100 p-2 rounded-md">
            <CalendarDays className="text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold">Employee Leaves</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search leaves..."
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
                onClick={() => handleSort('leaveTypeName')}
                className="cursor-pointer"
              >
                Leave Type <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead
                onClick={() => handleSort('startDate')}
                className="cursor-pointer"
              >
                Start Date <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead
                onClick={() => handleSort('endDate')}
                className="cursor-pointer"
              >
                End Date <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead
                onClick={() => handleSort('noOfDays')}
                className="cursor-pointer"
              >
                No. of Days <ArrowUpDown className="ml-2 h-4 w-4 inline" />
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
            {!employeeLeaves || employeeLeaves.data === undefined ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-4">
                  Loading employee leaves...
                </TableCell>
              </TableRow>
            ) : !employeeLeaves.data || employeeLeaves.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-4">
                  No employee leaves found
                </TableCell>
              </TableRow>
            ) : paginatedLeaves.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-4">
                  No employee leaves match your search
                </TableCell>
              </TableRow>
            ) : (
              paginatedLeaves.map((leave: any, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {leave.employeeName}
                  </TableCell>
                  <TableCell>{leave.empCode}</TableCell>
                  <TableCell>{leave.leaveTypeName}</TableCell>
                  <TableCell>{leave.startDate}</TableCell>
                  <TableCell>{leave.endDate}</TableCell>
                  <TableCell>{leave.noOfDays}</TableCell>
                  <TableCell>{leave.designationName}</TableCell>
                  <TableCell>{leave.departmentName}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-amber-600 hover:text-amber-700"
                        onClick={() => handleEditClick(leave)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => {
                          setDeletingLeaveId(leave.employeeLeaveId)
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

      {sortedLeaves.length > 0 && (
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
        title={isEditMode ? 'Edit Employee Leave' : 'Add Employee Leave'}
        size="sm:max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
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
            <div className="space-y-2">
              <Label htmlFor="leaveTypeId">
                Leave Type ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="leaveTypeId"
                name="leaveTypeId"
                type="number"
                value={formData.leaveTypeId || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">
                End Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="noOfDays">
                No. of Days <span className="text-red-500">*</span>
              </Label>
              <Input
                id="noOfDays"
                name="noOfDays"
                type="number"
                min={1}
                value={formData.noOfDays || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
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
            <AlertDialogTitle>Delete Employee Leave</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this employee leave? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingLeaveId) {
                  deleteMutation.mutate({ id: deletingLeaveId })
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

export default EmployeeLeaves
