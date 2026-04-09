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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowUpDown,
  Search,
  DollarSign,
  Edit2,
  Trash2,
  Calendar,
  Plus,
  X,
  List,
} from 'lucide-react'
import { Popup } from '@/utils/popup'
import type {
  CreateSalaryType,
  GetSalaryType,
  GetOtherSalaryComponentType,
} from '@/utils/type'
import { useInitializeUser, userDataAtom } from '@/utils/user'
import { useAtom } from 'jotai'
import {
  useAddSalary,
  useDeleteSalary,
  useGetSalaries,
  useUpdateSalary,
  useGetOtherSalaryComponents,
  useGetAllEmployees,
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

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

interface OtherSalaryRow {
  otherSalaryComponentId: number
  amount: number
}

interface SalaryFormData {
  employeeId: number
  departmentId: number
  designationId: number
  basicSalary: number
  grossSalary: number
  netSalary: number
  doj: string
  salaryMonth: string
  salaryYear: number
  otherSalaries: OtherSalaryRow[]
}

const defaultForm = (): SalaryFormData => ({
  employeeId: 0,
  departmentId: 0,
  designationId: 0,
  basicSalary: 0,
  grossSalary: 0,
  netSalary: 0,
  doj: '',
  salaryMonth: MONTHS[new Date().getMonth()],
  salaryYear: new Date().getFullYear(),
  otherSalaries: [],
})

const Salaries = () => {
  useInitializeUser()
  const [userData] = useAtom(userDataAtom)

  const { data: salaries } = useGetSalaries()
  console.log("🚀 ~ Salaries ~ salaries:", salaries)
  const { data: employees } = useGetAllEmployees()
  console.log("🚀 ~ Salaries ~ employees:", employees)
  const { data: otherSalaryComponents } = useGetOtherSalaryComponents()

  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [groupsPerPage] = useState(5)
  const [sortColumn, setSortColumn] = useState<string>('employeeName')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [searchTerm, setSearchTerm] = useState('')

  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingSalaryId, setEditingSalaryId] = useState<number | null>(null)

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingSalaryId, setDeletingSalaryId] = useState<number | null>(null)

  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false)
  const [detailSalary, setDetailSalary] = useState<GetSalaryType | null>(null)

  const [form, setForm] = useState<SalaryFormData>(defaultForm())

  const resetForm = useCallback(() => {
    setForm(defaultForm())
    setEditingSalaryId(null)
    setIsEditMode(false)
    setIsPopupOpen(false)
    setError(null)
  }, [])

  const closePopup = useCallback(() => {
    setIsPopupOpen(false)
    setError(null)
    resetForm()
  }, [resetForm])

  const addMutation = useAddSalary({ onClose: closePopup, reset: resetForm })
  const updateMutation = useUpdateSalary({
    onClose: closePopup,
    reset: resetForm,
  })
  const deleteMutation = useDeleteSalary({
    onClose: closePopup,
    reset: resetForm,
  })

  // Auto-calculate net salary
  useEffect(() => {
    const allowances = form.otherSalaries.reduce((sum, row) => {
      const comp = otherSalaryComponents?.data?.find(
        (c: GetOtherSalaryComponentType) =>
          c.otherSalaryComponentId === row.otherSalaryComponentId
      )
      return comp?.componentType === 'Allowance' ? sum + row.amount : sum
    }, 0)

    const deductions = form.otherSalaries.reduce((sum, row) => {
      const comp = otherSalaryComponents?.data?.find(
        (c: GetOtherSalaryComponentType) =>
          c.otherSalaryComponentId === row.otherSalaryComponentId
      )
      return comp?.componentType === 'Deduction' ? sum + row.amount : sum
    }, 0)

    const gross = form.basicSalary + allowances
    const net = gross - deductions

    setForm((prev) => ({
      ...prev,
      grossSalary: gross,
      netSalary: net,
    }))
  }, [form.basicSalary, form.otherSalaries, otherSalaryComponents?.data])

  // Auto-fill department, designation, doj from employee selection (only in create mode)
  useEffect(() => {
    if (form.employeeId && employees?.data && !isEditMode) {
      const emp = employees.data.find(
        (e: any) => e.employeeId === form.employeeId
      )
      if (emp) {
        setForm((prev) => ({
          ...prev,
          departmentId: emp.departmentId || 0,
          designationId: emp.designationId || 0,
          doj: emp.doj || '',
        }))
      }
    }
  }, [form.employeeId, employees?.data, isEditMode])

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const filteredSalaries = useMemo(() => {
    if (!salaries?.data || !Array.isArray(salaries.data)) return []
    return salaries.data.filter((s: GetSalaryType) =>
      s.salary.employeeName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [salaries?.data, searchTerm])

  // Group by salaryMonth + salaryYear
  const groupedSalaries = useMemo(() => {
    const groups = filteredSalaries.reduce(
      (acc: Record<string, GetSalaryType[]>, salary: GetSalaryType) => {
        const key = `${salary.salary.salaryYear}-${salary.salary.salaryMonth}`
        if (!acc[key]) acc[key] = []
        acc[key].push(salary)
        return acc
      },
      {}
    )

    Object.keys(groups).forEach((key) => {
      groups[key].sort((a: GetSalaryType, b: GetSalaryType) => {
        const aVal = (a.salary as any)[sortColumn] ?? ''
        const bVal = (b.salary as any)[sortColumn] ?? ''
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortDirection === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal)
        }
        return sortDirection === 'asc'
          ? aVal > bVal
            ? 1
            : -1
          : bVal > aVal
            ? 1
            : -1
      })
    })

    // Sort groups descending (latest month/year first)
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a))
  }, [filteredSalaries, sortColumn, sortDirection])

  const paginatedGroups = useMemo(() => {
    const startIndex = (currentPage - 1) * groupsPerPage
    return groupedSalaries.slice(startIndex, startIndex + groupsPerPage)
  }, [groupedSalaries, currentPage, groupsPerPage])

  const totalPages = Math.ceil(groupedSalaries.length / groupsPerPage)

  const addOtherSalaryRow = () => {
    setForm((prev) => ({
      ...prev,
      otherSalaries: [
        ...prev.otherSalaries,
        { otherSalaryComponentId: 0, amount: 0 },
      ],
    }))
  }

  const removeOtherSalaryRow = (index: number) => {
    setForm((prev) => ({
      ...prev,
      otherSalaries: prev.otherSalaries.filter((_, i) => i !== index),
    }))
  }

  const updateOtherSalaryRow = (
    index: number,
    field: keyof OtherSalaryRow,
    value: number
  ) => {
    setForm((prev) => {
      const updated = [...prev.otherSalaries]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, otherSalaries: updated }
    })
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError(null)

      try {
        if (!form.employeeId) {
          setError('Please select an employee')
          return
        }

        const payload: CreateSalaryType = {
          salary: {
            salaryMonth: form.salaryMonth,
            salaryYear: form.salaryYear,
            employeeId: form.employeeId,
            departmentId: form.departmentId,
            designationId: form.designationId,
            basicSalary: form.basicSalary,
            grossSalary: form.grossSalary,
            netSalary: form.netSalary,
            doj: form.doj,
            createdBy: userData?.userId || 0,
            ...(isEditMode ? { updatedBy: userData?.userId || 0 } : {}),
          },
          otherSalary: form.otherSalaries
            .filter((row) => row.otherSalaryComponentId > 0)
            .map((row) => ({
              employeeId: form.employeeId,
              otherSalaryComponentId: row.otherSalaryComponentId,
              salaryMonth: form.salaryMonth,
              salaryYear: form.salaryYear,
              amount: row.amount,
              createdBy: userData?.userId || 0,
              ...(isEditMode ? { updatedBy: userData?.userId || 0 } : {}),
            })),
        }

        if (isEditMode && editingSalaryId) {
          await updateMutation.mutateAsync({
            id: editingSalaryId,
            data: payload,
          })
        } else {
          await addMutation.mutateAsync(payload)
        }
      } catch (err) {
        setError('Failed to save salary')
        console.error(err)
      }
    },
    [form, isEditMode, editingSalaryId, addMutation, updateMutation, userData]
  )

  const handleEditClick = (salary: GetSalaryType) => {
    setForm({
      employeeId: salary.salary.employeeId,
      departmentId: salary.salary.departmentId,
      designationId: salary.salary.designationId,
      basicSalary: salary.salary.basicSalary,
      grossSalary: salary.salary.grossSalary,
      netSalary: salary.salary.netSalary,
      doj: salary.salary.doj,
      salaryMonth: salary.salary.salaryMonth,
      salaryYear: salary.salary.salaryYear,
      otherSalaries: salary.otherSalary.map((os) => ({
        otherSalaryComponentId: os.otherSalaryComponentId,
        amount: os.amount,
      })),
    })
    setEditingSalaryId((salary.salary as any).salaryId ?? null)
    setIsEditMode(true)
    setIsPopupOpen(true)
  }

  const formatGroupLabel = (key: string) => {
    const [year, month] = key.split('-')
    return `${month} ${year}`
  }

  const getComponentTypeLabel = (componentId: number) => {
    const comp = otherSalaryComponents?.data?.find(
      (c: GetOtherSalaryComponentType) =>
        c.otherSalaryComponentId === componentId
    )
    return comp ? `${comp.componentName} (${comp.componentType})` : ''
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-amber-100 p-2 rounded-md">
            <DollarSign className="text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold">Salaries</h2>
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
            Add Salary
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {!salaries || salaries.data === undefined ? (
          <div className="text-center py-8 text-gray-500">
            Loading salaries...
          </div>
        ) : !salaries.data || salaries.data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No salaries found
          </div>
        ) : paginatedGroups.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No salaries match your search
          </div>
        ) : (
          paginatedGroups.map(([key, groupSalaries]) => (
            <div
              key={key}
              className="rounded-lg border border-gray-200 overflow-hidden shadow-sm"
            >
              {/* Group Header */}
              <div className="bg-amber-200 px-6 py-4 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-black" />
                <h3 className="text-lg font-semibold text-black">
                  {formatGroupLabel(key)}
                </h3>
                <span className="ml-auto bg-black/10 px-3 py-1 rounded-full text-sm font-medium text-black">
                  {groupSalaries.length}{' '}
                  {groupSalaries.length === 1 ? 'employee' : 'employees'}
                </span>
              </div>

              {/* Salary Table */}
              <div className="bg-white">
                <Table>
                  <TableHeader className="bg-amber-50">
                    <TableRow>
                      <TableHead className="w-20">Sl No.</TableHead>
                      <TableHead
                        onClick={() => handleSort('employeeName')}
                        className="cursor-pointer"
                      >
                        Employee Name
                        <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                      </TableHead>
                      <TableHead
                        onClick={() => handleSort('basicSalary')}
                        className="cursor-pointer"
                      >
                        Basic Salary
                        <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                      </TableHead>
                      <TableHead>Gross Salary</TableHead>
                      <TableHead>Net Salary</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupSalaries.map(
                      (salary: GetSalaryType, index: number) => {
                        return (
                          <TableRow
                            key={(salary.salary as any).salaryId ?? index}
                            className="hover:bg-amber-50/50"
                          >
                            <TableCell className="font-medium text-gray-600">
                              {index + 1}
                            </TableCell>
                            <TableCell className="font-medium">
                              {salary.salary.employeeName}
                            </TableCell>
                            <TableCell>
                              {salary.salary.basicSalary.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {salary.salary.grossSalary.toLocaleString()}
                            </TableCell>
                            <TableCell className="font-semibold text-green-700">
                              {salary.salary.netSalary.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  title="View other salary components"
                                  onClick={() => {
                                    setDetailSalary(salary)
                                    setIsDetailPopupOpen(true)
                                  }}
                                >
                                  <List className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                  onClick={() => handleEditClick(salary)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => {
                                    setDeletingSalaryId(
                                      (salary.salary as any).salaryId ?? null
                                    )
                                    setIsDeleteDialogOpen(true)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      }
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))
        )}
      </div>

      {groupedSalaries.length > 0 && totalPages > 1 && (
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

      {/* Add / Edit Popup */}
      <Popup
        isOpen={isPopupOpen}
        onClose={closePopup}
        title={isEditMode ? 'Edit Salary' : 'Add Salary'}
        size="sm:max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Month & Year */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Salary Month <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.salaryMonth}
                onValueChange={(val) =>
                  setForm((prev) => ({ ...prev, salaryMonth: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                Salary Year <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                value={form.salaryYear}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    salaryYear: Number(e.target.value),
                  }))
                }
                min={2000}
                max={2100}
                required
              />
            </div>
          </div>

          {/* Employee */}
          <div className="space-y-2">
            <Label>
              Employee <span className="text-red-500">*</span>
            </Label>
            <Select
              value={form.employeeId ? String(form.employeeId) : ''}
              onValueChange={(val) =>
                setForm((prev) => ({ ...prev, employeeId: Number(val) }))
              }
              disabled={isEditMode}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees?.data
                  ?.filter((e: any) => e.isActive === 1)
                  .map((emp: any) => (
                    <SelectItem
                      key={emp.employeeId}
                      value={String(emp.employeeId)}
                    >
                      {emp.fullName}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Basic / Gross / Net Salary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>
                Basic Salary <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                value={form.basicSalary}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    basicSalary: Number(e.target.value),
                  }))
                }
                min={0}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Gross Salary</Label>
              <Input
                type="number"
                value={form.grossSalary}
                readOnly
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label>Net Salary</Label>
              <Input
                type="number"
                value={form.netSalary}
                readOnly
                className="bg-gray-50 cursor-not-allowed font-semibold text-green-700"
              />
            </div>
          </div>

          {/* DOJ */}
          <div className="space-y-2">
            <Label>
              Date of Joining <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              value={form.doj}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, doj: e.target.value }))
              }
              className="max-w-xs"
              required
            />
          </div>

          {/* Other Salary Components */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">
                Other Salary Components
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-amber-600 border-amber-400 hover:bg-amber-50"
                onClick={addOtherSalaryRow}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add More
              </Button>
            </div>

            {form.otherSalaries.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead className="w-36">Amount</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {form.otherSalaries.map((row, index) => {
                      const selectedComp = otherSalaryComponents?.data?.find(
                        (c: GetOtherSalaryComponentType) =>
                          c.otherSalaryComponentId ===
                          row.otherSalaryComponentId
                      )
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <Select
                              value={
                                row.otherSalaryComponentId
                                  ? String(row.otherSalaryComponentId)
                                  : ''
                              }
                              onValueChange={(val) =>
                                updateOtherSalaryRow(
                                  index,
                                  'otherSalaryComponentId',
                                  Number(val)
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select component" />
                              </SelectTrigger>
                              <SelectContent>
                                {otherSalaryComponents?.data
                                  ?.filter(
                                    (c: GetOtherSalaryComponentType) =>
                                      c.status === 1
                                  )
                                  .map((comp: GetOtherSalaryComponentType) => (
                                    <SelectItem
                                      key={comp.otherSalaryComponentId}
                                      value={String(
                                        comp.otherSalaryComponentId
                                      )}
                                    >
                                      {comp.componentName} ({comp.componentType}
                                      )
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={row.amount}
                              onChange={(e) =>
                                updateOtherSalaryRow(
                                  index,
                                  'amount',
                                  Number(e.target.value)
                                )
                              }
                              min={0}
                              className={
                                selectedComp?.componentType === 'Deduction'
                                  ? 'text-red-600'
                                  : selectedComp?.componentType === 'Allowance'
                                    ? 'text-green-600'
                                    : ''
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => removeOtherSalaryRow(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400 border border-dashed rounded-lg">
                No other salary components added. Click &quot;Add More&quot; to add.
              </div>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
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
                : 'Save Salary'}
            </Button>
          </div>
        </form>
      </Popup>

      {/* Other Salary Components Detail Popup */}
      <Popup
        isOpen={isDetailPopupOpen}
        onClose={() => {
          setIsDetailPopupOpen(false)
          setDetailSalary(null)
        }}
        title="Other Salary Components"
        size="sm:max-w-lg"
      >
        <div className="py-4 space-y-4">
          {detailSalary && (
            <>
              <div className="flex items-center justify-between pb-2 border-b">
                <div>
                  <p className="font-semibold text-gray-800">
                    {detailSalary.salary.employeeName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {detailSalary.salary.salaryMonth}{' '}
                    {detailSalary.salary.salaryYear}
                  </p>
                </div>
              </div>

              {detailSalary.otherSalary.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No other salary components for this record.
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-amber-50">
                    <TableRow>
                      <TableHead className="w-10">Sl No.</TableHead>
                      <TableHead>Component</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detailSalary.otherSalary.map((os, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="text-gray-500">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {os.componentName ??
                            getComponentTypeLabel(os.otherSalaryComponentId)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              os.componentType === 'Allowance'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {os.componentType}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          <span
                            className={
                              os.componentType === 'Allowance'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }
                          >
                            {os.componentType === 'Allowance' ? '+' : '-'}
                            {os.amount.toLocaleString()}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {detailSalary.otherSalary.length > 0 && (
                <div className="pt-2 border-t space-y-1 text-sm">
                  {(() => {
                    const allowanceTotal = detailSalary.otherSalary
                      .filter((os) => os.componentType === 'Allowance')
                      .reduce((sum, os) => sum + os.amount, 0)
                    const deductionTotal = detailSalary.otherSalary
                      .filter((os) => os.componentType === 'Deduction')
                      .reduce((sum, os) => sum + os.amount, 0)
                    return (
                      <>
                        <div className="flex justify-between text-green-700">
                          <span>Total Allowances</span>
                          <span className="font-semibold">
                            +{allowanceTotal.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-red-700">
                          <span>Total Deductions</span>
                          <span className="font-semibold">
                            -{deductionTotal.toLocaleString()}
                          </span>
                        </div>
                      </>
                    )
                  })()}
                </div>
              )}
            </>
          )}
        </div>
      </Popup>

      {/* Delete Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Salary</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this salary record? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingSalaryId) {
                  deleteMutation.mutate({ id: deletingSalaryId })
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

export default Salaries
