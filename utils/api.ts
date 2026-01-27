import { fetchApi, fetchApiWithFile } from '@/utils/http'
import {
  CreateDepartmentType,
  CreateDesignationType,
  CreateEmployeeType,
  CreateEmployeeTypeType,
  GetDepartmentType,
  GetDesignationType,
  GetEmployeeType,
  GetEmployeeTypeType,
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