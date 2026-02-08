import { off } from 'process'
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
  createdBy: z.number(),
  createdAt: z.number().optional().nullable(),
  updatedBy: z.number().optional().nullable(),
  updatedAt: z.number().optional().nullable(),
})
export type CreateDepartmentType = z.infer<typeof departmentSchema>
export type GetDepartmentType = z.infer<typeof departmentSchema>

//designations
export const designationSchema = z.object({
  designationId: z.number().optional(),
  designationName: z.string(),
  createdBy: z.number(),
  createdAt: z.number().optional().nullable(),
  updatedBy: z.number().optional().nullable(),
  updatedAt: z.number().optional().nullable(),
})
export type CreateDesignationType = z.infer<typeof designationSchema>
export type GetDesignationType = z.infer<typeof designationSchema>

//employee type
export const employeeTypeSchema = z.object({
  employeeTypeId: z.number().optional(),
  employeeTypeName: z.string(),
  createdBy: z.number(),
  createdAt: z.number().optional().nullable(),
  updatedBy: z.number().optional().nullable(),
  updatedAt: z.number().optional().nullable(),
})
export type CreateEmployeeTypeType = z.infer<typeof employeeTypeSchema>
export type GetEmployeeTypeType = z.infer<typeof employeeTypeSchema>

//employee
export const employeeSchema = z.object({
  employeeId: z.number().optional(),
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email'),
  officialPhone: z.string().min(1, 'Official phone is required'),
  personalPhone: z.string().optional().nullable(),
  presentAddress: z.string().min(1, 'Present address is required'),
  permanentAddress: z.string().optional().nullable(),
  emergencyContactName: z.string().optional().nullable(),
  emergencyContactPhone: z.string().optional().nullable(),
  photoUrl: z.string().url().optional().nullable(),
  cvUrl: z.string().url().optional().nullable(),
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
  officeTimingId: z.number(),
  leaveTypeIds: z.array(z.number()),
  createdBy: z.number(),
  createdAt: z.number().optional().nullable(),
  updatedBy: z.number().optional().nullable(),
  updatedAt: z.number().optional().nullable(),
})
export type CreateEmployeeType = z.infer<typeof employeeSchema>
export type GetEmployeeType = z.infer<typeof employeeSchema> & {
  departmentName: string
  designationName: string
  employeeTypeName: string
  officeTiming: string
  leaveTypes: string[]
}

//weekend
export const weekendSchema = z.object({
  weekendId: z.number().optional(),
  day: z.string(),
})
export type GetWeekendType = z.infer<typeof weekendSchema>

//office timing weekend
export const officeTimingSchema = z.object({
  officeTiminId: z.number().optional(),
  officeTimingId: z.number().optional(),
  startTime: z.string(),
  endTime: z.string(),
  weekendIds: z.array(z.number()),
  createdBy: z.number(),
  createdAt: z.number().optional().nullable(),
  updatedBy: z.number().optional().nullable(),
  updatedAt: z.number().optional().nullable(),
})
export type CreateOfficeTimingType = z.infer<typeof officeTimingSchema>
export type GetOfficeTimingType = z.infer<typeof officeTimingSchema> & {
  weekends: string[]
}

//holiday
export const holidaySchema = z.object({
  holidayId: z.number().optional(),
  holidayName: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  noOfDays: z.number(),
  description: z.string().optional().nullable(),
  createdBy: z.number(),
  createdAt: z.number().optional().nullable(),
  updatedBy: z.number().optional().nullable(),
  updatedAt: z.number().optional().nullable(),
})
export type CreateHolidayType = z.infer<typeof holidaySchema>
export type GetHolidayType = z.infer<typeof holidaySchema>

//leave type
export const leaveTypeSchema = z.object({
  leaveTypeId: z.number().optional(),
  leaveTypeName: z.string(),
  totalLeaves: z.number(),
  yearPeriod: z.number(),
  createdBy: z.number(),
  createdAt: z.number().optional().nullable(),
  updatedBy: z.number().optional().nullable(),
  updatedAt: z.number().optional().nullable(),
})
export type CreateLeaveTypeType = z.infer<typeof leaveTypeSchema>
export type GetLeaveTypeType = z.infer<typeof leaveTypeSchema>

export const employeeAttendanceSchema = z.object({
  employeeAttendanceId: z.number().optional(),
  employeeId: z.number(),
  attendanceDate: z.string(),
  inTime: z.string(),
  outTime: z.string(),
  lateInMinutes: z.number().default(0),
  earlyOutMinutes: z.number().default(0),
  createdBy: z.number(),
  createdAt: z.number().optional(),
  updatedBy: z.number().optional(),
  updatedAt: z.number().optional(),
})
export type CreateEmployeeAttendanceType = z.infer<
  typeof employeeAttendanceSchema
>
export type GetEmployeeAttendanceType = z.infer<
  typeof employeeAttendanceSchema
> & {
  employeeName: string
}

export const assignLeaveTypeSchema = z.object({
  employeeLeaveTypeId: z.number().optional(),
  employeeId: z.number(),
  leaveTypeIds: z.array(z.number()).min(1),
})
export type AssignLeaveTypeType = z.infer<typeof assignLeaveTypeSchema>
