import { fetchApi, fetchApiWithFile } from '@/utils/http'
import {
  CreateDepartmentType,
  CreateDesignationType,
  CreateEmployeeAttendanceType,
  CreateEmployeeType,
  CreateEmployeeTypeType,
  CreateHolidayType,
  CreateLeaveTypeType,
  CreateOfficeTimingType,
  GetDepartmentType,
  GetDesignationType,
  GetEmployeeAttendanceType,
  GetEmployeeType,
  GetEmployeeTypeType,
  GetHolidayType,
  GetLeaveTypeType,
  GetOfficeTimingType,
  GetWeekendType,
  SignInRequest,
  SignInResponse,
  SignInResponseSchema,
} from '@/utils/type'

export async function signIn(credentials: SignInRequest) {
  return fetchApi<SignInResponse>({
    url: 'api/auth/login',
    method: 'POST',
    body: credentials,
    schema: SignInResponseSchema,
  })
}

//departments
export async function getAllDepartments(token: string) {
  return fetchApi<GetDepartmentType[]>({
    url: 'api/departments/getall',
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function createDepartment(
  data: CreateDepartmentType,
  token: string
) {
  return fetchApi<CreateDepartmentType>({
    url: 'api/departments/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function editDepartment(
  id: number,
  data: GetDepartmentType,
  token: string
) {
  return fetchApi<GetDepartmentType>({
    url: `api/departments/edit/${id}`,
    method: 'PATCH',
    body: data,
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export async function deleteDepartment(id: number, token: string) {
  return fetchApi<{ id: number }>({
    url: `api/departments/delete/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

//designation
export async function getAllDesignations(token: string) {
  return fetchApi<GetDesignationType[]>({
    url: 'api/designations/getall',
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function createDesignation(
  data: CreateDesignationType,
  token: string
) {
  return fetchApi<CreateDesignationType>({
    url: 'api/designations/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function editDesignation(
  id: number,
  data: GetDesignationType,
  token: string
) {
  return fetchApi<GetDesignationType>({
    url: `api/designations/edit/${id}`,
    method: 'PATCH',
    body: data,
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export async function deleteDesignation(id: number, token: string) {
  return fetchApi<{ id: number }>({
    url: `api/designations/delete/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

//employee type
export async function getAllEmployeeTypes(token: string) {
  return fetchApi<GetEmployeeTypeType[]>({
    url: 'api/employeeTypes/getall',
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function createEmployeeType(
  data: CreateEmployeeTypeType,
  token: string
) {
  return fetchApi<CreateEmployeeTypeType>({
    url: 'api/employeeTypes/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function editEmployeeType(
  id: number,
  data: GetEmployeeTypeType,
  token: string
) {
  return fetchApi<GetEmployeeTypeType>({
    url: `api/employeeTypes/edit/${id}`,
    method: 'PATCH',
    body: data,
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export async function deleteEmployeeType(id: number, token: string) {
  return fetchApi<{ id: number }>({
    url: `api/employeeTypes/delete/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

//weekends
export async function getAllWeekends(token: string) {
  return fetchApi<GetWeekendType[]>({
    url: 'api/weekends/getall',
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

//office timing weekends
export async function getAllOfficeTimingWeekends(token: string) {
  return fetchApi<GetOfficeTimingType[]>({
    url: 'api/officeTimings/getall',
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function createOfficeTimingWeekend(
  data: CreateOfficeTimingType,
  token: string
) {
  return fetchApi<CreateOfficeTimingType>({
    url: 'api/officeTimings/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function editOfficeTimingWeekend(
  id: number,
  data: GetOfficeTimingType,
  token: string
) {
  return fetchApi<GetOfficeTimingType>({
    url: `api/officeTimings/edit/${id}`,
    method: 'PATCH',
    body: data,
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export async function deleteOfficeTimingWeekend(id: number, token: string) {
  return fetchApi<{ id: number }>({
    url: `api/officeTimings/delete/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

//employee
export async function getAllEmployees(token: string) {
  return fetchApi<GetEmployeeType[]>({
    url: 'api/employees/getall',
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function getEmployeeById(token: string, id: number) {
  return fetchApi<GetEmployeeType>({
    url: `api/employees/getById/${id}`,
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function createEmployee(
  formData: FormData,
  token: string
) {
  return fetchApiWithFile<CreateEmployeeType>({
    url: 'api/employees/create',
    method: 'POST',
    body: formData,
    headers: {
      Authorization: token,
    },
  })
}

export async function editEmployee(
  id: number,
  formData: FormData,
  token: string
) {
  return fetchApiWithFile<GetEmployeeType>({
    url: `api/employees/edit/${id}`,
    method: 'PATCH',
    body: formData,
    headers: {
      Authorization: `${token}`,
    },
  })
}

export async function deleteEmployee(id: number, token: string) {
  return fetchApi<{ id: number }>({
    url: `api/employees/delete/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

//holidays
export async function getAllHolidays(token: string) {
  return fetchApi<GetHolidayType[]>({
    url: 'api/holidays/getall',
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function createHoliday(
  data: CreateHolidayType,
  token: string
) {
  return fetchApi<CreateHolidayType>({
    url: 'api/holidays/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function editHoliday(
  id: number,
  data: GetHolidayType,
  token: string
) {
  return fetchApi<GetHolidayType>({
    url: `api/holidays/edit/${id}`,
    method: 'PATCH',
    body: data,
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export async function deleteHoliday(id: number, token: string) {
  return fetchApi<{ id: number }>({
    url: `api/holidays/delete/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

//leave type
export async function getAllLeaveTypes(token: string) {
  return fetchApi<GetLeaveTypeType[]>({
    url: 'api/leaveTypes/getall',
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function createLeaveType(
  data: CreateLeaveTypeType,
  token: string
) {
  return fetchApi<CreateLeaveTypeType>({
    url: 'api/leaveTypes/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function editLeaveType(
  id: number,
  data: GetLeaveTypeType,
  token: string
) {
  return fetchApi<GetLeaveTypeType>({
    url: `api/leaveTypes/edit/${id}`,
    method: 'PATCH',
    body: data,
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export async function deleteLeaveType(id: number, token: string) {
  return fetchApi<{ id: number }>({
    url: `api/leaveTypes/delete/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function getAllEmployeeAttendances(token: string) {
  return fetchApi<GetEmployeeAttendanceType[]>({
    url: 'api/employeeAttendances/getall',
    method: 'GET',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function createEmployeeAttendance(
  data: CreateEmployeeAttendanceType,
  token: string
) {
  return fetchApi<CreateEmployeeAttendanceType>({
    url: 'api/employeeAttendances/create',
    method: 'POST',
    body: data,
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}

export async function editEmployeeAttendance(
  id: number,
  data: GetEmployeeAttendanceType,
  token: string
) {
  return fetchApi<GetEmployeeAttendanceType>({
    url: `api/employeeAttendances/edit/${id}`,
    method: 'PATCH',
    body: data,
    headers: {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    },
  })
}

export async function deleteEmployeeAttendance(id: number, token: string) {
  return fetchApi<{ id: number }>({
    url: `api/employeeAttendances/delete/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json',
    },
  })
}