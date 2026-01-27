import { z } from 'zod'

//auth + authorization + user management
export const SignInRequestSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export const PermissionSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const RolePermissionSchema = z.object({
  roleId: z.number(),
  permissionId: z.number(),
  permission: PermissionSchema,
})

export const RoleSchema = z.object({
  roleId: z.number(),
  roleName: z.string(),
  rolePermissions: z.array(RolePermissionSchema),
})

export const UserSchema = z.object({
  userId: z.number(),
  username: z.string(),
  password: z.string(),
  active: z.number(),
  roleId: z.number(),
  isPasswordResetRequired: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
  role: RoleSchema,
})

export const SignInResponseSchema = z.object({
  token: z.string(),
  user: UserSchema,
})
export type SignInRequest = z.infer<typeof SignInRequestSchema>
export type SignInResponse = z.infer<typeof SignInResponseSchema>

//departments
export const departmentSchema = z.object({
  departmentId: z.number().optional(),
  departmentName: z.string(),
  createdBy: z.number().optional(),
  createdAt: z.date().optional(),
  updatedBy: z.number().nullable().optional(),
  updatedAt: z.date().optional(),
})
export type CreateDepartmentType = z.infer<typeof departmentSchema>
export type GetDepartmentType = z.infer<typeof departmentSchema>

//designations
export const designationSchema = z.object({
  designationId: z.number().optional(),
  designationName: z.string(),
  createdBy: z.number().optional(),
  createdAt: z.date().optional(),
  updatedBy: z.number().optional(),
  updatedAt: z.date().optional(),
})
export type CreateDesignationType = z.infer<typeof designationSchema>
export type GetDesignationType = z.infer<typeof designationSchema>

//employee type
export const employeeTypeSchema = z.object({
  employeeTypeId: z.number().optional(),
  employeeTypeName: z.string(),
  createdBy: z.number().optional(),
  createdAt: z.date().optional(),
  updatedBy: z.number().nullable().optional(),
  updatedAt: z.date().optional(),
})
export type CreateEmployeeTypeType = z.infer<typeof employeeTypeSchema>
export type GetEmployeeTypeType = z.infer<typeof employeeTypeSchema>

//employee
export const employeeSchema = z.object({
  employeeId: z.number(),
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email'),
  officialPhone: z.string().min(1, 'Official phone is required'),
  personalPhone: z.string().optional().nullable(),
  presentAddress: z.string().min(1, 'Present address is required'),
  permanentAddress: z.string().optional().nullable(),
  emergencyContactName: z.string().optional().nullable(),
  emergencyContactPhone: z.string().optional().nullable(),
  photoUrl: z.string().url().optional().nullable(),
  dob: z.string().min(1, 'Date of birth is required'),
  doj: z.string().min(1, 'Date of joining is required'),
  gender: z.enum(['Male', 'Female']),
  bloodGroup: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .optional()
    .nullable(),
  basicSalary: z.number().positive(),
  grossSalary: z.number().positive(),
  isActive: z.number().int().min(0).max(1),
  empCode: z.string().min(1, 'Employee code is required'),
  departmentId: z.number(),
  designationId: z.number(),
  employeeTypeId: z.number(),
  createdBy: z.number(),
  createdAt: z.number(),
  updatedBy: z.number().optional().nullable(),
  updatedAt: z.number().optional().nullable(),
})
export type CreateEmployeeType = z.infer<typeof employeeSchema>
export type GetEmployeeType = z.infer<typeof employeeSchema>