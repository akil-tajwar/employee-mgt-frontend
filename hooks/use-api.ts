import { tokenAtom, useInitializeUser } from '@/utils/user'
import { useAtom } from 'jotai'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from './use-toast'
import {
  assignLeaveType,
  createDepartment,
  createDesignation,
  createEmployee,
  createEmployeeAttendance,
  createEmployeeLeave,
  createEmployeeOtherSalaryComponent,
  createEmployeeType,
  createHoliday,
  createLeaveType,
  createLone,
  createOfficeTimingWeekend,
  createOtherSalaryComponent,
  createSalary,
  deleteDepartment,
  deleteDesignation,
  deleteEmployee,
  deleteEmployeeAttendance,
  deleteEmployeeLeave,
  deleteEmployeeOtherSalaryComponent,
  deleteEmployeeType,
  deleteHoliday,
  deleteLeaveType,
  deleteLone,
  deleteOfficeTimingWeekend,
  deleteOtherSalaryComponent,
  deleteSalary,
  editDepartment,
  editDesignation,
  editEmployee,
  editEmployeeAttendance,
  editEmployeeLeave,
  editEmployeeOtherSalaryComponent,
  editEmployeeType,
  editHoliday,
  editLeaveType,
  editLone,
  editOfficeTimingWeekend,
  editOtherSalaryComponent,
  editSalary,
  getAllDepartments,
  getAllDesignations,
  getAllEmployeeAttendances,
  getAllEmployeeLeaves,
  getAllEmployeeLeaveTypes,
  getAllEmployeeOtherSalaryComponents,
  getAllEmployees,
  getAllEmployeeTypes,
  getAllHolidays,
  getAllLeaveTypes,
  getAllLones,
  getAllOfficeTimingWeekends,
  getAllOtherSalaryComponents,
  getAllSalaries,
  getAllWeekends,
  getAttendanceReport,
  getEmployeeById,
  getSalaryReport,
} from '@/utils/api'
import {
  AssignLeaveTypeType,
  CreateDepartmentType,
  CreateDesignationType,
  CreateEmployeeAttendanceType,
  CreateEmployeeLeaveType,
  CreateEmployeeOtherSalaryComponentType,
  CreateEmployeeTypeType,
  CreateHolidayType,
  CreateLeaveTypeType,
  CreateEmployeeLoneType,
  CreateOfficeTimingType,
  CreateOtherSalaryComponentType,
  CreateSalaryType,
  GetEmployeeAttendanceType,
  GetEmployeeLeaveType,
  GetEmployeeLoneType,
  GetOfficeTimingType,
} from '@/utils/type'

//departments
export const useGetDepartments = () => {
  const [token] = useAtom(tokenAtom)
  useInitializeUser()

  return useQuery({
    queryKey: ['departments'],
    queryFn: () => {
      if (!token) {
        throw new Error('Token not found')
      }
      return getAllDepartments(token)
    },
    enabled: !!token,
    select: (data) => data,
  })
}

export const useAddDepartment = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: CreateDepartmentType) => {
      return createDepartment(data, token)
    },
    onSuccess: (data) => {
      console.log('department added successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['departments'] })

      // Reset form fields after success
      reset()

      // Close the form modal
      onClose()
    },
    onError: (error) => {
      // Handle error
      console.error('Error adding department:', error)
    },
  })

  return mutation
}

export const useUpdateDepartment = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()

  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateDepartmentType }) => {
      return editDepartment(id, data, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'department edited successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['departments'] })

      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error editing department:', error)
    },
  })

  return mutation
}

export const useDeleteDepartment = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()

  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }: { id: number }) => {
      return deleteDepartment(id, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'department is deleted successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['departments'] })

      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error sending delete request:', error)
    },
  })

  return mutation
}

//designation
export const useGetDesignations = () => {
  const [token] = useAtom(tokenAtom)
  useInitializeUser()

  return useQuery({
    queryKey: ['designations'],
    queryFn: () => {
      if (!token) {
        throw new Error('Token not found')
      }
      return getAllDesignations(token)
    },
    enabled: !!token,
    select: (data) => data,
  })
}

export const useAddDesignation = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: CreateDesignationType) => {
      return createDesignation(data, token)
    },
    onSuccess: (data) => {
      console.log('designation added successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['designations'] })

      // Reset form fields after success
      reset()

      // Close the form modal
      onClose()
    },
    onError: (error) => {
      // Handle error
      console.error('Error adding designation:', error)
    },
  })

  return mutation
}

export const useUpdateDesignation = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()

  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateDesignationType }) => {
      return editDesignation(id, data, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'designation edited successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['designations'] })

      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error editing designation:', error)
    },
  })

  return mutation
}

export const useDeleteDesignation = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()

  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }: { id: number }) => {
      return deleteDesignation(id, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'designation is deleted successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['designations'] })

      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error sending delete request:', error)
    },
  })

  return mutation
}

//employee type
export const useGetEmployeeTypes = () => {
  const [token] = useAtom(tokenAtom)
  useInitializeUser()

  return useQuery({
    queryKey: ['employeeTypes'],
    queryFn: () => {
      if (!token) {
        throw new Error('Token not found')
      }
      return getAllEmployeeTypes(token)
    },
    enabled: !!token,
    select: (data) => data,
  })
}

export const useAddEmployeeType = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: CreateEmployeeTypeType) => {
      return createEmployeeType(data, token)
    },
    onSuccess: (data) => {
      console.log('employee type added successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['employeeTypes'] })

      // Reset form fields after success
      reset()

      // Close the form modal
      onClose()
    },
    onError: (error) => {
      // Handle error
      console.error('Error adding employeeType:', error)
    },
  })

  return mutation
}

export const useUpdateEmployeeType = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()

  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: CreateEmployeeTypeType
    }) => {
      return editEmployeeType(id, data, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'employee type edited successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['employeeTypes'] })

      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error editing employeeType:', error)
    },
  })

  return mutation
}

export const useDeleteEmployeeType = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()

  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }: { id: number }) => {
      return deleteEmployeeType(id, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'employee type is deleted successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['employeeTypes'] })

      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error sending delete request:', error)
    },
  })

  return mutation
}

//weekend
export const useGetWeekends = () => {
  const [token] = useAtom(tokenAtom)
  useInitializeUser()

  return useQuery({
    queryKey: ['weekends'],
    queryFn: () => {
      if (!token) {
        throw new Error('Token not found')
      }
      return getAllWeekends(token)
    },
    enabled: !!token,
    select: (data) => data,
  })
}

//office timing weekends
export const useGetOfficeTimingWeekends = () => {
  const [token] = useAtom(tokenAtom)
  useInitializeUser()

  return useQuery({
    queryKey: ['officeTimings'],
    queryFn: () => {
      if (!token) {
        throw new Error('Token not found')
      }
      return getAllOfficeTimingWeekends(token)
    },
    enabled: !!token,
    select: (data) => data,
  })
}

export const useAddOfficeTimingWeekend = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: CreateOfficeTimingType) => {
      return createOfficeTimingWeekend(data, token)
    },
    onSuccess: (data) => {
      console.log('office timing weekend added successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['officeTimings'] })

      // Reset form fields after success
      reset()

      // Close the form modal
      onClose()
    },
    onError: (error) => {
      // Handle error
      console.error('Error adding office timing:', error)
    },
  })

  return mutation
}

export const useUpdateOfficeTimingWeekend = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()

  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: GetOfficeTimingType }) => {
      return editOfficeTimingWeekend(id, data, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'office timing is edited successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['officeTimings'] })

      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error editing office timing:', error)
    },
  })

  return mutation
}

export const useDeleteOfficeTimingWeekend = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()

  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }: { id: number }) => {
      return deleteOfficeTimingWeekend(id, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'office timing is deleted successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['officeTimings'] })

      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error sending delete request:', error)
    },
  })

  return mutation
}

//employee
export const useAddEmployee = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      return createEmployee(formData, token)
    },
    onSuccess: (data) => {
      console.log('employees added successfully:', data)

      queryClient.invalidateQueries({ queryKey: ['employees'] })

      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error adding employees:', error)
    },
  })

  return mutation
}

export const useGetAllEmployees = () => {
  const [token] = useAtom(tokenAtom)
  useInitializeUser()

  return useQuery({
    queryKey: ['employees'],
    queryFn: () => {
      if (!token) {
        throw new Error('Token not found')
      }
      return getAllEmployees(token)
    },
    enabled: !!token,
    select: (data) => data,
  })
}

export const useGetEmployeeById = (id: number) => {
  const [token] = useAtom(tokenAtom)
  useInitializeUser()

  return useQuery({
    queryKey: ['employees', id],
    queryFn: () => {
      if (!token) throw new Error('Token not found')
      return getEmployeeById(token, id)
    },
    enabled: !!token && id > 0,
    select: (data) => data,
  })
}

export const useUpdateEmployeeWithFees = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()

  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => {
      // 🔥 data is already FormData — use it directly
      return editEmployee(id, data, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Employee edited successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error editing employee:', error)
    },
  })

  return mutation
}

export const useDeleteEmployee = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()

  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }: { id: number }) => {
      return deleteEmployee(id, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'employee is deleted successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['employees'] })

      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error sending delete request:', error)
    },
  })

  return mutation
}

export const useAssignLeaveType = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()

  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ data }: { data: AssignLeaveTypeType }) => {
      return assignLeaveType(data, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'leave type assigned successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['employees'] })

      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error assigning leaveType:', error)
    },
  })

  return mutation
}

//holidays
export const useGetHolidays = () => {
  const [token] = useAtom(tokenAtom)
  useInitializeUser()

  return useQuery({
    queryKey: ['holidays'],
    queryFn: () => {
      if (!token) {
        throw new Error('Token not found')
      }
      return getAllHolidays(token)
    },
    enabled: !!token,
    select: (data) => data,
  })
}

export const useAddHoliday = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: CreateHolidayType) => {
      return createHoliday(data, token)
    },
    onSuccess: (data) => {
      console.log('holiday added successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['holidays'] })

      // Reset form fields after success
      reset()

      // Close the form modal
      onClose()
    },
    onError: (error) => {
      // Handle error
      console.error('Error adding employeeType:', error)
    },
  })

  return mutation
}

export const useUpdateHoliday = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()

  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateHolidayType }) => {
      return editHoliday(id, data, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'holiday edited successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['holidays'] })

      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error editing employeeType:', error)
    },
  })

  return mutation
}

export const useDeleteHoliday = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()

  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }: { id: number }) => {
      return deleteHoliday(id, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'holiday is deleted successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['holidays'] })

      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error sending delete request:', error)
    },
  })

  return mutation
}

//leave type
export const useGetLeaveTypes = () => {
  const [token] = useAtom(tokenAtom)
  useInitializeUser()

  return useQuery({
    queryKey: ['leaveTypes'],
    queryFn: () => {
      if (!token) {
        throw new Error('Token not found')
      }
      return getAllLeaveTypes(token)
    },
    enabled: !!token,
    select: (data) => data,
  })
}

export const useAddLeaveType = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: CreateLeaveTypeType) => {
      return createLeaveType(data, token)
    },
    onSuccess: (data) => {
      console.log('leave type added successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['leaveTypes'] })

      // Reset form fields after success
      reset()

      // Close the form modal
      onClose()
    },
    onError: (error) => {
      // Handle error
      console.error('Error adding leaveType:', error)
    },
  })

  return mutation
}

export const useUpdateLeaveType = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()

  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateLeaveTypeType }) => {
      return editLeaveType(id, data, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'leave type edited successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['leaveTypes'] })

      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error editing leaveType:', error)
    },
  })

  return mutation
}

export const useDeleteLeaveType = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()

  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }: { id: number }) => {
      return deleteLeaveType(id, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'leave type is deleted successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['leaveTypes'] })

      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error sending delete request:', error)
    },
  })

  return mutation
}

//employee attendances
export const useGetEmployeeAttendances = () => {
  const [token] = useAtom(tokenAtom)
  useInitializeUser()

  return useQuery({
    queryKey: ['employeeAttendances'],
    queryFn: () => {
      if (!token) {
        throw new Error('Token not found')
      }
      return getAllEmployeeAttendances(token)
    },
    enabled: !!token,
    select: (data) => data,
  })
}

export const useAddEmployeeAttendance = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
  showToast?: (type: 'success' | 'error', message: string) => void
}) => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: CreateEmployeeAttendanceType) => {
      return createEmployeeAttendance(data, token)
    },

    onSuccess: (response) => {
      // Expect backend to return { status: 'success', data, message? }
      if (!response?.error) {
        console.log('✅ Employee attendance added successfully:', response.data)

        queryClient.invalidateQueries({ queryKey: ['employeeAttendances'] })
        reset()
        onClose()
      } else {
        // Backend returned something unexpected
        console.warn('⚠ Unexpected response from server:', response)
        toast({
          title: 'Error!',
          variant: 'destructive',
          description:
            (response?.error?.details as any)?.message ||
            'Failed to add employee attendance.',
        })
      }
    },

    onError: (error: any) => {
      console.error('❌ Error adding employee attendance:', error)
      toast({
        title: 'Error!',
        variant: 'destructive',
        description: 'Failed to add employee attendance.',
      })
    },
  })

  return mutation
}

export const useUpdateEmployeeAttendance = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()

  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: GetEmployeeAttendanceType
    }) => {
      return editEmployeeAttendance(id, data, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'employee attendance edited successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['employeeAttendances'] })

      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error editing employee attendance:', error)
    },
  })

  return mutation
}

export const useDeleteEmployeeAttendance = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()

  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }: { id: number }) => {
      return deleteEmployeeAttendance(id, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'employee attendance is deleted successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['employeeAttendances'] })

      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error sending delete request:', error)
    },
  })

  return mutation
}

//other salary components
export const useGetOtherSalaryComponents = () => {
  const [token] = useAtom(tokenAtom)
  useInitializeUser()

  return useQuery({
    queryKey: ['otherSalaryComponents'],
    queryFn: () => {
      if (!token) {
        throw new Error('Token not found')
      }
      return getAllOtherSalaryComponents(token)
    },
    enabled: !!token,
    select: (data) => data,
  })
}

export const useAddOtherSalaryComponent = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: CreateOtherSalaryComponentType) => {
      return createOtherSalaryComponent(data, token)
    },
    onSuccess: (data) => {
      console.log('other salary component added successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['otherSalaryComponents'] })

      // Reset form fields after success
      reset()

      // Close the form modal
      onClose()
    },
    onError: (error) => {
      // Handle error
      console.error('Error adding other salary component:', error)
    },
  })

  return mutation
}

export const useUpdateOtherSalaryComponent = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()

  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: CreateOtherSalaryComponentType
    }) => {
      return editOtherSalaryComponent(id, data, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'other salary component edited successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['otherSalaryComponents'] })

      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error editing employeeType:', error)
    },
  })

  return mutation
}

export const useDeleteOtherSalaryComponent = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()

  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }: { id: number }) => {
      return deleteOtherSalaryComponent(id, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'other salary component is deleted successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['otherSalaryComponents'] })

      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error sending delete request:', error)
    },
  })

  return mutation
}

//employee other salary compoennents
export const useGetEmployeeOtherSalaryComponents = () => {
  const [token] = useAtom(tokenAtom)
  useInitializeUser()

  return useQuery({
    queryKey: ['employeeOtherSalaryComponents'],
    queryFn: () => {
      if (!token) {
        throw new Error('Token not found')
      }
      return getAllEmployeeOtherSalaryComponents(token)
    },
    enabled: !!token,
    select: (data) => data,
  })
}

export const useAddEmployeeOtherSalaryComponent = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: CreateEmployeeOtherSalaryComponentType) => {
      return createEmployeeOtherSalaryComponent(data, token)
    },
    onSuccess: (data) => {
      console.log('employee other salary component added successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['employeeOtherSalaryComponents'] })

      // Reset form fields after success
      reset()

      // Close the form modal
      onClose()
    },
    onError: (error) => {
      // Handle error
      console.error('Error adding employee other salary component:', error)
    },
  })

  return mutation
}

export const useUpdateEmployeeOtherSalaryComponent = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()

  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: CreateEmployeeOtherSalaryComponentType
    }) => {
      return editEmployeeOtherSalaryComponent(id, data, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Employee other salary component edited successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['employeeOtherSalaryComponents'] })

      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error editing employeeType:', error)
    },
  })

  return mutation
}

export const useDeleteEmployeeOtherSalaryComponent = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()

  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }: { id: number }) => {
      return deleteEmployeeOtherSalaryComponent(id, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Employee other salary component is deleted successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['employeeOtherSalaryComponents'] })

      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error sending delete request:', error)
    },
  })

  return mutation
}

//salary
export const useGetSalaries = () => {
  const [token] = useAtom(tokenAtom)
  useInitializeUser()

  return useQuery({
    queryKey: ['salaries'],
    queryFn: () => {
      if (!token) {
        throw new Error('Token not found')
      }
      return getAllSalaries(token)
    },
    enabled: !!token,
    select: (data) => data,
  })
}

export const useAddSalary = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: CreateSalaryType) => {
      return createSalary(data, token)
    },
    onSuccess: (data) => {
      console.log('salary added successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['salaries'] })

      // Reset form fields after success
      reset()

      // Close the form modal
      onClose()
    },
    onError: (error) => {
      // Handle error
      console.error('Error adding salary:', error)
    },
  })

  return mutation
}

export const useUpdateSalary = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()

  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => {
      return editSalary(id, data, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'salary edited successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['salaries'] })

      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error editing salary:', error)
    },
  })

  return mutation
}

export const useDeleteSalary = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()

  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }: { id: number }) => {
      return deleteSalary(id, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'salary is deleted successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['salaries'] })

      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error sending delete request:', error)
    },
  })

  return mutation
}

//lones
export const useGetLones = () => {
  const [token] = useAtom(tokenAtom)
  useInitializeUser()

  return useQuery({
    queryKey: ['lones'],
    queryFn: () => {
      if (!token) {
        throw new Error('Token not found')
      }
      return getAllLones(token)
    },
    enabled: !!token,
    select: (data) => data,
  })
}

export const useAddLone = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: CreateEmployeeLoneType) => {
      return createLone(data, token)
    },
    onSuccess: (data) => {
      console.log('lone added successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['lones'] })

      // Reset form fields after success
      reset()

      // Close the form modal
      onClose()
    },
    onError: (error) => {
      // Handle error
      console.error('Error adding lone:', error)
    },
  })

  return mutation
}

export const useUpdateLone = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()

  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: GetEmployeeLoneType }) => {
      return editLone(id, data, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'lone edited successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['lones'] })

      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error editing lone:', error)
    },
  })

  return mutation
}

export const useDeleteLone = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()

  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }: { id: number }) => {
      return deleteLone(id, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'lone is deleted successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['lones'] })

      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error sending delete request:', error)
    },
  })

  return mutation
}

//employee leaves
export const useGetEmployeeLeaves = () => {
  const [token] = useAtom(tokenAtom)
  useInitializeUser()

  return useQuery({
    queryKey: ['employeeLeaves'],
    queryFn: () => {
      if (!token) {
        throw new Error('Token not found')
      }
      return getAllEmployeeLeaves(token)
    },
    enabled: !!token,
    select: (data) => data,
  })
}

export const useGetEmployeeLeaveTypes = () => {
  const [token] = useAtom(tokenAtom)
  useInitializeUser()

  return useQuery({
    queryKey: ['employeeLeaveTypes'],
    queryFn: () => {
      if (!token) {
        throw new Error('Token not found')
      }
      return getAllEmployeeLeaveTypes(token)
    },
    enabled: !!token,
    select: (data) => data,
  })
}

export const useAddEmployeeLeave = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()
  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: CreateEmployeeLeaveType) => {
      return createEmployeeLeave(data, token)
    },
    onSuccess: (data) => {
      console.log('Employee leave added successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['employeeLeaves'] })

      // Reset form fields after success
      reset()

      // Close the form modal
      onClose()
    },
    onError: (error) => {
      // Handle error
      console.error('Error adding lone:', error)
    },
  })

  return mutation
}

export const useUpdateEmployeeLeave = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()

  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: GetEmployeeLeaveType }) => {
      return editEmployeeLeave(id, data, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Employee leave edited successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['employeeLeaves'] })

      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error editing employee leave:', error)
    },
  })

  return mutation
}

export const useDeleteEmployeeLeave = ({
  onClose,
  reset,
}: {
  onClose: () => void
  reset: () => void
}) => {
  useInitializeUser()

  const [token] = useAtom(tokenAtom)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id }: { id: number }) => {
      return deleteEmployeeLeave(id, token)
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Employee leave is deleted successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['employeeLeaves'] })

      reset()
      onClose()
    },
    onError: (error) => {
      console.error('Error sending delete request:', error)
    },
  })

  return mutation
}

//reports
export const useGetSalaryReport = (salaryMonth: string, salaryYear: number) => {
  const [token] = useAtom(tokenAtom)
  useInitializeUser()

  return useQuery({
    queryKey: ['salaryReport', salaryMonth, salaryYear],
    queryFn: () => {
      if (!token) throw new Error('Token not found')
      return getSalaryReport(salaryMonth, salaryYear, token)
    },
    enabled: !!token && salaryMonth.length > 0 && salaryYear > 0,
    select: (data) => data,
  })
}

export const useGetAttendanceReport = (fromDate: string, toDate: string) => {
  const [token] = useAtom(tokenAtom)
  useInitializeUser()

  return useQuery({
    queryKey: ['attendanceReport', fromDate, toDate],
    queryFn: () => {
      if (!token) throw new Error('Token not found')
      return getAttendanceReport(fromDate, toDate, token)
    },
    enabled: !!token && fromDate.length > 0 && toDate.length > 0,
    select: (data) => data,
  })
}
