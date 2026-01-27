import { tokenAtom, useInitializeUser } from '@/utils/user'
import { useAtom } from 'jotai'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from './use-toast'
import {
  createDepartment,
  createDesignation,
  createEmployee,
  createEmployeeType,
  deleteDepartment,
  deleteDesignation,
  deleteEmployee,
  deleteEmployeeType,
  editDepartment,
  editDesignation,
  editEmployee,
  editEmployeeType,
  getAllDepartments,
  getAllDesignations,
  getAllEmployees,
  getAllEmployeeTypes,
  getEmployeeById,
} from '@/utils/api'
import { CreateDepartmentType, CreateDesignationType, CreateEmployeeTypeType } from '@/utils/type'

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
    mutationFn: ({ id, data }: { id: number; data: CreateEmployeeTypeType }) => {
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