'use client'

import type React from 'react'
import { useCallback, useEffect, useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
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
import {
  ArrowUpDown,
  Search,
  Clock,
  Edit2,
  Trash2,
  Calendar,
} from 'lucide-react'
import { Popup } from '@/utils/popup'
import type {
  CreateEmployeeAttendanceType,
  GetEmployeeAttendanceType,
  GetEmployeeType,
} from '@/utils/type'
import { useInitializeUser, userDataAtom } from '@/utils/user'
import { useAtom } from 'jotai'
import {
  useAddEmployeeAttendance,
  useDeleteEmployeeAttendance,
  useGetEmployeeAttendances,
  useUpdateEmployeeAttendance,
  useGetAllEmployees,
  useGetOfficeTimingWeekends,
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
import { formatDate, formatTime } from '@/utils/conversions'

interface AttendanceFormData {
  employeeId: number
  employeeName: string
  inTime: string
  outTime: string
  lateInMinutes: number
  earlyOutMinutes: number
  officeStartTime: string
  officeEndTime: string
  isChecked: boolean
}

const EmployeeAttendances = () => {
  useInitializeUser()
  const [userData] = useAtom(userDataAtom)

  const { data: employeeAttendances } = useGetEmployeeAttendances()
  const { data: employees } = useGetAllEmployees()
  const { data: officeTimingWeekends } = useGetOfficeTimingWeekends()

  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [groupsPerPage] = useState(5) // Number of date groups per page
  const [sortColumn, setSortColumn] =
    useState<keyof GetEmployeeAttendanceType>('employeeName')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [searchTerm, setSearchTerm] = useState('')

  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingAttendanceId, setEditingAttendanceId] = useState<number | null>(
    null
  )

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingAttendanceId, setDeletingAttendanceId] = useState<
    number | null
  >(null)

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })

  const [attendanceForms, setAttendanceForms] = useState<AttendanceFormData[]>(
    []
  )

  // Calculate late and early minutes
  const calculateTimeDifference = (
    actualTime: string,
    expectedTime: string,
    isLate: boolean
  ): number => {
    const [actualHours, actualMinutes] = actualTime.split(':').map(Number)
    const [expectedHours, expectedMinutes] = expectedTime.split(':').map(Number)

    const actualTotalMinutes = actualHours * 60 + actualMinutes
    const expectedTotalMinutes = expectedHours * 60 + expectedMinutes

    const difference = actualTotalMinutes - expectedTotalMinutes

    if (isLate) {
      return Math.max(0, difference)
    } else {
      return Math.max(0, -difference)
    }
  }

  // Initialize attendance forms when popup opens
  useEffect(() => {
    if (
      isPopupOpen &&
      !isEditMode &&
      employees?.data &&
      officeTimingWeekends?.data
    ) {
      const forms: AttendanceFormData[] = employees.data
        .filter((emp: GetEmployeeType) => emp.isActive === 1)
        .map((emp: GetEmployeeType) => {
          const officeTiming = officeTimingWeekends?.data?.find(
            (ot: any) => ot.officeTimingId === emp.officeTimingId
          )

          const startTime = officeTiming?.startTime || '09:00'
          const endTime = officeTiming?.endTime || '17:00'

          return {
            employeeId: emp.employeeId!,
            employeeName: emp.fullName,
            inTime: startTime,
            outTime: endTime,
            lateInMinutes: 0,
            earlyOutMinutes: 0,
            officeStartTime: startTime,
            officeEndTime: endTime,
            isChecked: true,
          }
        })

      setAttendanceForms(forms)
    }
  }, [isPopupOpen, isEditMode, employees?.data, officeTimingWeekends?.data])

  const allChecked = useMemo(() => {
    return (
      attendanceForms.length > 0 &&
      attendanceForms.every((form) => form.isChecked)
    )
  }, [attendanceForms])

  const someChecked = useMemo(() => {
    return attendanceForms.some((form) => form.isChecked) && !allChecked
  }, [attendanceForms, allChecked])

  const handleSelectAll = (checked: boolean) => {
    setAttendanceForms((prev) =>
      prev.map((form) => ({ ...form, isChecked: checked }))
    )
  }

  const handleCheckboxChange = (index: number, checked: boolean) => {
    setAttendanceForms((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], isChecked: checked }
      return updated
    })
  }

  const handleTimeChange = (
    index: number,
    field: 'inTime' | 'outTime',
    value: string
  ) => {
    setAttendanceForms((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }

      if (field === 'inTime') {
        updated[index].lateInMinutes = calculateTimeDifference(
          value,
          updated[index].officeStartTime,
          true
        )
      } else {
        updated[index].earlyOutMinutes = calculateTimeDifference(
          value,
          updated[index].officeEndTime,
          false
        )
      }

      return updated
    })
  }

  const resetForm = useCallback(() => {
    setAttendanceForms([])
    setSelectedDate(() => {
      const today = new Date()
      return today.toISOString().split('T')[0]
    })
    setEditingAttendanceId(null)
    setIsEditMode(false)
    setIsPopupOpen(false)
    setError(null)
  }, [])

  const closePopup = useCallback(() => {
    setIsPopupOpen(false)
    setError(null)
    resetForm()
  }, [resetForm])

  const addMutation = useAddEmployeeAttendance({
    onClose: closePopup,
    reset: resetForm,
  })

  const updateMutation = useUpdateEmployeeAttendance({
    onClose: closePopup,
    reset: resetForm,
  })

  const deleteMutation = useDeleteEmployeeAttendance({
    onClose: closePopup,
    reset: resetForm,
  })

  const handleSort = (column: keyof GetEmployeeAttendanceType) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const filteredAttendances = useMemo(() => {
    if (!employeeAttendances?.data || !Array.isArray(employeeAttendances.data))
      return []
    return employeeAttendances.data.filter((attendance) =>
      attendance.employeeName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [employeeAttendances?.data, searchTerm])

  // Group attendances by date and sort
  const groupedAttendances = useMemo(() => {
    if (!Array.isArray(filteredAttendances)) return []

    const groups = filteredAttendances.reduce(
      (acc, attendance) => {
        const date = attendance.attendanceDate
        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(attendance)
        return acc
      },
      {} as Record<string, GetEmployeeAttendanceType[]>
    )

    // Sort each group's attendances by employee name or selected column
    Object.keys(groups).forEach((date) => {
      groups[date].sort((a, b) => {
        const aValue = a[sortColumn] ?? ''
        const bValue = b[sortColumn] ?? ''

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }

        return sortDirection === 'asc'
          ? aValue > bValue
            ? 1
            : -1
          : bValue > aValue
            ? 1
            : -1
      })
    })

    // Sort dates in descending order (latest first)
    return Object.entries(groups).sort(([dateA], [dateB]) =>
      dateB.localeCompare(dateA)
    )
  }, [filteredAttendances, sortColumn, sortDirection])

  // Paginate by date groups
  const paginatedGroups = useMemo(() => {
    const startIndex = (currentPage - 1) * groupsPerPage
    return groupedAttendances.slice(startIndex, startIndex + groupsPerPage)
  }, [groupedAttendances, currentPage, groupsPerPage])

  const totalPages = Math.ceil(groupedAttendances.length / groupsPerPage)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError(null)

      try {
        const checkedForms = attendanceForms.filter((form) => form.isChecked)

        if (checkedForms.length === 0) {
          setError('Please select at least one employee')
          return
        }

        if (isEditMode && editingAttendanceId) {
          const form = checkedForms[0]
          const submitData = {
            employeeId: form.employeeId,
            attendanceDate: selectedDate,
            inTime: form.inTime,
            outTime: form.outTime,
            lateInMinutes: form.lateInMinutes,
            earlyOutMinutes: form.earlyOutMinutes,
            updatedBy: userData?.userId || 0,
          }

          await updateMutation.mutateAsync({
            id: editingAttendanceId,
            data: submitData as GetEmployeeAttendanceType,
          })
        } else {
          const attendancesArray: CreateEmployeeAttendanceType[] =
            checkedForms.map((form) => ({
              employeeId: form.employeeId,
              attendanceDate: selectedDate,
              inTime: form.inTime,
              outTime: form.outTime,
              lateInMinutes: form.lateInMinutes,
              earlyOutMinutes: form.earlyOutMinutes,
              createdBy: userData?.userId || 0,
            }))

          await addMutation.mutateAsync(attendancesArray as any)
        }
      } catch (err) {
        setError('Failed to save attendance')
        console.error(err)
      }
    },
    [
      attendanceForms,
      selectedDate,
      isEditMode,
      editingAttendanceId,
      addMutation,
      updateMutation,
      userData,
    ]
  )

  useEffect(() => {
    if (addMutation.error || updateMutation.error) {
      setError('Error saving attendance')
    }
  }, [addMutation.error, updateMutation.error])

  const handleEditClick = (attendance: GetEmployeeAttendanceType) => {
    const employee = employees?.data?.find(
      (emp: GetEmployeeType) => emp.employeeId === attendance.employeeId
    )

    if (employee && officeTimingWeekends?.data) {
      const officeTiming = officeTimingWeekends.data.find(
        (ot: any) => ot.officeTimingId === employee.officeTimingId
      )

      const startTime = officeTiming?.startTime || '09:00'
      const endTime = officeTiming?.endTime || '17:00'

      setAttendanceForms([
        {
          employeeId: attendance.employeeId,
          employeeName: attendance.employeeName,
          inTime: attendance.inTime,
          outTime: attendance.outTime,
          lateInMinutes: attendance.lateInMinutes,
          earlyOutMinutes: attendance.earlyOutMinutes,
          officeStartTime: startTime,
          officeEndTime: endTime,
          isChecked: true,
        },
      ])

      setSelectedDate(attendance.attendanceDate)
      setEditingAttendanceId(attendance.employeeAttendanceId!)
      setIsEditMode(true)
      setIsPopupOpen(true)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-amber-100 p-2 rounded-md">
            <Clock className="text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold">Employee Attendances</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button
            className="bg-amber-500 hover:bg-amber-600 text-black"
            onClick={() => setIsPopupOpen(true)}
          >
            Add Attendance
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {!employeeAttendances || employeeAttendances.data === undefined ? (
          <div className="text-center py-8 text-gray-500">
            Loading attendances...
          </div>
        ) : !employeeAttendances.data ||
          employeeAttendances.data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No attendances found
          </div>
        ) : paginatedGroups.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No attendances match your search
          </div>
        ) : (
          paginatedGroups.map(([date, attendances]) => (
            <div
              key={date}
              className="rounded-lg border border-gray-200 overflow-hidden shadow-sm"
            >
              {/* Date Header */}
              <div className="bg-amber-200 px-6 py-4 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-black" />
                <h3 className="text-lg font-semibold text-black">
                  {formatDate(new Date(date))}
                </h3>
                <span className="ml-auto bg-black/10 px-3 py-1 rounded-full text-sm font-medium text-black">
                  {attendances.length}{' '}
                  {attendances.length === 1 ? 'employee' : 'employees'}
                </span>
              </div>

              {/* Attendance Table */}
              <div className="bg-white">
                <Table>
                  <TableHeader className="bg-amber-50">
                    <TableRow>
                      <TableHead className="w-20">Sl No.</TableHead>
                      <TableHead
                        onClick={() => handleSort('employeeName')}
                        className="cursor-pointer hover:bg-amber-100 transition-colors"
                      >
                        Employee Name{' '}
                        <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                      </TableHead>
                      <TableHead
                        onClick={() => handleSort('inTime')}
                        className="cursor-pointer hover:bg-amber-100 transition-colors"
                      >
                        In Time <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                      </TableHead>
                      <TableHead
                        onClick={() => handleSort('outTime')}
                        className="cursor-pointer hover:bg-amber-100 transition-colors"
                      >
                        Out Time <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                      </TableHead>
                      <TableHead>Late (mins)</TableHead>
                      <TableHead>Early Out (mins)</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendances.map((attendance: any, index) => (
                      <TableRow
                        key={attendance.employeeAttendanceId || index}
                        className="hover:bg-amber-50/50"
                      >
                        <TableCell className="font-medium text-gray-600">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {attendance.employeeName}
                        </TableCell>
                        <TableCell>{formatTime(attendance.inTime)}</TableCell>
                        <TableCell>{formatTime(attendance.outTime)}</TableCell>
                        <TableCell>
                          <span
                            className={
                              attendance.lateInMinutes > 0
                                ? 'text-red-600 font-semibold bg-red-50 px-2 py-1 rounded'
                                : 'text-gray-600'
                            }
                          >
                            {attendance.lateInMinutes}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              attendance.earlyOutMinutes > 0
                                ? 'text-orange-600 font-semibold bg-orange-50 px-2 py-1 rounded'
                                : 'text-gray-600'
                            }
                          >
                            {attendance.earlyOutMinutes}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                              onClick={() => handleEditClick(attendance)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                setDeletingAttendanceId(
                                  attendance.employeeAttendanceId
                                )
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))
        )}
      </div>

      {groupedAttendances.length > 0 && totalPages > 1 && (
        <div className="mt-6">
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
        title={isEditMode ? 'Edit Attendance' : 'Add Attendance'}
        size="sm:max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="attendanceDate">
              Attendance Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="attendanceDate"
              name="attendanceDate"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
              className="max-w-xs"
            />
          </div>

          {!isEditMode && attendanceForms.length > 0 && (
            <div className="flex items-center gap-2 pb-2">
              <Checkbox
                id="selectAll"
                checked={allChecked}
                onCheckedChange={handleSelectAll}
                className="data-[state=checked]:bg-amber-500"
              />
              <Label htmlFor="selectAll" className="cursor-pointer font-medium">
                {allChecked
                  ? 'Unselect All'
                  : someChecked
                    ? 'Select All'
                    : 'Select All'}
              </Label>
              <span className="text-sm text-gray-500">
                ({attendanceForms.filter((f) => f.isChecked).length} of{' '}
                {attendanceForms.length} selected)
              </span>
            </div>
          )}

          <div className="max-h-96 overflow-y-auto border rounded-lg">
            <Table>
              <TableHeader className="bg-gray-50 sticky top-0">
                <TableRow>
                  {!isEditMode && (
                    <TableHead className="w-12">Select</TableHead>
                  )}
                  <TableHead className="w-48">Employee</TableHead>
                  <TableHead className="w-32">In Time</TableHead>
                  <TableHead className="w-32">Out Time</TableHead>
                  <TableHead className="w-28">Late (mins)</TableHead>
                  <TableHead className="w-28">Early Out (mins)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceForms.map((form, index) => (
                  <TableRow
                    key={form.employeeId}
                    className={!form.isChecked ? 'bg-gray-100 opacity-60' : ''}
                  >
                    {!isEditMode && (
                      <TableCell>
                        <Checkbox
                          checked={form.isChecked}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(index, checked as boolean)
                          }
                          className="data-[state=checked]:bg-amber-500"
                        />
                      </TableCell>
                    )}
                    <TableCell className="font-medium">
                      {form.employeeName}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="time"
                        value={form.inTime}
                        onChange={(e) =>
                          handleTimeChange(index, 'inTime', e.target.value)
                        }
                        disabled={!form.isChecked}
                        className="w-full disabled:cursor-not-allowed disabled:bg-gray-50"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="time"
                        value={form.outTime}
                        onChange={(e) =>
                          handleTimeChange(index, 'outTime', e.target.value)
                        }
                        disabled={!form.isChecked}
                        className="w-full disabled:cursor-not-allowed disabled:bg-gray-50"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={form.lateInMinutes}
                        readOnly
                        className={`w-full bg-gray-50 cursor-not-allowed ${
                          form.lateInMinutes > 0
                            ? 'text-red-600 font-medium'
                            : ''
                        }`}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={form.earlyOutMinutes}
                        readOnly
                        className={`w-full bg-gray-50 cursor-not-allowed ${
                          form.earlyOutMinutes > 0
                            ? 'text-orange-600 font-medium'
                            : ''
                        }`}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={closePopup}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addMutation.isPending || updateMutation.isPending}
              className="bg-amber-500 hover:bg-amber-600 text-black"
            >
              {addMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : 'Save Attendance'}
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
            <AlertDialogTitle>Delete Attendance</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this attendance record? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingAttendanceId) {
                  deleteMutation.mutate({ id: deletingAttendanceId })
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

export default EmployeeAttendances
