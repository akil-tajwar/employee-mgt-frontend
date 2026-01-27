'use client'
import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { User, Upload, Download } from 'lucide-react'
import { tokenAtom, useInitializeUser, userDataAtom } from '@/utils/user'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { CustomCombobox } from '@/utils/custom-combobox'
import {
  useAddEmployee,
  useGetDepartments,
  useGetDesignations,
  useGetEmployeeTypes,
} from '@/hooks/use-api'
import type { CreateEmployeeType } from '@/utils/type'
import { toast } from '@/hooks/use-toast'
import ExcelFileInput from '@/utils/excel-file-input'
import { Popup } from '@/utils/popup'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

const CreateEmployee = () => {
  useInitializeUser()
  const [userData] = useAtom(userDataAtom)
  const [token] = useAtom(tokenAtom)
  const { data: departments } = useGetDepartments()
  const { data: designations } = useGetDesignations()
  const { data: employeeTypes } = useGetEmployeeTypes()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isImportPopupOpen, setIsImportPopupOpen] = useState(false)

  const [employeePhotoFile, setEmployeePhotoFile] = useState<File | null>(null)

  const [formData, setFormData] = useState<
    Omit<
      CreateEmployeeType,
      'employeeId' | 'createdAt' | 'updatedAt' | 'updatedBy'
    >
  >({
    fullName: '',
    email: '',
    officialPhone: '',
    personalPhone: null,
    presentAddress: '',
    permanentAddress: null,
    emergencyContactName: null,
    emergencyContactPhone: null,
    photoUrl: null,
    dob: '',
    doj: new Date().toISOString().split('T')[0],
    gender: 'Male',
    bloodGroup: null,
    basicSalary: 0,
    grossSalary: 0,
    isActive: 1,
    empCode: '',
    departmentId: 0,
    designationId: 0,
    employeeTypeId: 0,
    createdBy: userData?.userId || 0,
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement

    if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? Number(value) : null,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value || null,
      }))
    }
  }

  const handleEmployeePhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      setEmployeePhotoFile(file)
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'gender' || name === 'bloodGroup') {
      setFormData((prev) => ({
        ...prev,
        [name]: value || null,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? Number(value) : null,
      }))
    }
  }

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      officialPhone: '',
      personalPhone: null,
      presentAddress: '',
      permanentAddress: null,
      emergencyContactName: null,
      emergencyContactPhone: null,
      photoUrl: null,
      dob: '',
      doj: new Date().toISOString().split('T')[0],
      gender: 'Male',
      bloodGroup: null,
      basicSalary: 0,
      grossSalary: 0,
      isActive: 1,
      empCode: '',
      departmentId: 0,
      designationId: 0,
      employeeTypeId: 0,
      createdBy: userData?.userId || 0,
    })
    setEmployeePhotoFile(null)
    setIsPopupOpen(false)
    setError(null)
  }

  const closePopup = useCallback(() => {
    setIsPopupOpen(false)
    setError(null)
  }, [])

  const addMutation = useAddEmployee({
    onClose: closePopup,
    reset: resetForm,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    console.log('=== FORM SUBMISSION START ===')
    console.log('📋 Employee Details:', formData)

    // Validations
    if (!formData.fullName.trim()) return setError('Please enter full name')
    if (!formData.email.trim()) return setError('Please enter email')
    if (!formData.officialPhone.trim())
      return setError('Please enter official phone')
    if (!formData.presentAddress.trim())
      return setError('Please enter present address')
    if (!formData.dob.trim()) return setError('Please enter date of birth')
    if (!formData.doj.trim()) return setError('Please enter date of joining')
    if (!formData.empCode.trim()) return setError('Please enter employee code')
    if (!formData.basicSalary || formData.basicSalary <= 0)
      return setError('Please enter valid basic salary')
    if (!formData.grossSalary || formData.grossSalary <= 0)
      return setError('Please enter valid gross salary')
    if (!formData.departmentId || formData.departmentId <= 0)
      return setError('Please select department')
    if (!formData.designationId || formData.designationId <= 0)
      return setError('Please select designation')
    if (!formData.employeeTypeId || formData.employeeTypeId <= 0)
      return setError('Please select employee type')

    const form = new FormData()

    // Add employee details as JSON (excluding photo URL)
    const employeeDetailsPayload = {
      ...formData,
      photoUrl: null,
    }
    console.log(
      '📦 Employee Details Payload (without photo):',
      employeeDetailsPayload
    )
    form.append('employeeDetails', JSON.stringify(employeeDetailsPayload))

    // Append photo only if selected
    if (employeePhotoFile) {
      form.append('photoUrl', employeePhotoFile)
      console.log(`✅ Appended photoUrl to FormData`)
    }

    console.log('📤 FormData contents:')
    for (const pair of form.entries()) {
      if (pair[1] instanceof File) {
        console.log(
          `  ${pair[0]}: [File] ${pair[1].name} (${pair[1].size} bytes)`
        )
      } else {
        console.log(`  ${pair[0]}: ${pair[1]}`)
      }
    }
    console.log('=== FORM SUBMISSION END ===')

    try {
      await addMutation.mutateAsync(form as any)
      console.log('✅ Employee created successfully!')
      toast({
        title: 'Success!',
        description: 'Employee is added successfully.',
      })
    } catch (err) {
      setError('Failed to create employee')
      console.error('❌ Error creating employee:', err)
    }
  }

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        FullName: '',
        Email: '',
        OfficialPhone: '',
        PersonalPhone: '',
        PresentAddress: '',
        PermanentAddress: '',
        EmergencyContactName: '',
        EmergencyContactPhone: '',
        DOB: '',
        DOJ: '',
        Gender: 'Male',
        BloodGroup: '',
        BasicSalary: '',
        GrossSalary: '',
        EmpCode: '',
        DepartmentId: '',
        DesignationId: '',
        EmployeeTypeId: '',
      },
    ]

    const worksheet = XLSX.utils.json_to_sheet(templateData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee Template')

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    })

    saveAs(blob, 'create-employees-template.xlsx')
  }

  const handleExcelDataParsed = (data: any[]) => {
    console.log('Excel data parsed:', data)
  }

  const handleExcelSubmit = async (data: any[]) => {
    try {
      // Process each row and create employee records
      const employeesToCreate = data.map((row) => ({
        fullName: row['FullName'] || '',
        email: row['Email'] || '',
        officialPhone: row['OfficialPhone'] || '',
        personalPhone: row['PersonalPhone'] || null,
        presentAddress: row['PresentAddress'] || '',
        permanentAddress: row['PermanentAddress'] || null,
        emergencyContactName: row['EmergencyContactName'] || null,
        emergencyContactPhone: row['EmergencyContactPhone'] || null,
        photoUrl: null,
        dob: row['DOB'] || '',
        doj: row['DOJ'] || new Date().toISOString().split('T')[0],
        gender: row['Gender'] || 'Male',
        bloodGroup: row['BloodGroup'] || null,
        basicSalary: row['BasicSalary'] ? Number(row['BasicSalary']) : 0,
        grossSalary: row['GrossSalary'] ? Number(row['GrossSalary']) : 0,
        isActive: 1,
        empCode: row['EmpCode'] || '',
        departmentId: row['DepartmentId'] ? Number(row['DepartmentId']) : 0,
        designationId: row['DesignationId'] ? Number(row['DesignationId']) : 0,
        employeeTypeId: row['EmployeeTypeId']
          ? Number(row['EmployeeTypeId'])
          : 0,
        createdBy: userData?.userId || 0,
      }))

      console.log('Employees to create:', employeesToCreate)

      // Submit all employees
      for (const employee of employeesToCreate) {
        const form = new FormData()
        const employeeDetailsPayload = {
          ...employee,
          photoUrl: null,
        }
        form.append('employeeDetails', JSON.stringify(employeeDetailsPayload))

        await addMutation.mutateAsync(form as any)
      }

      setIsImportPopupOpen(false)
      toast({
        title: 'Success!',
        description: `${employeesToCreate.length} employees added successfully.`,
      })
      resetForm()
    } catch (error) {
      console.error('Error importing employees:', error)
      toast({
        title: 'Error',
        description:
          'Failed to import employees. Please check the data and try again.',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    if (addMutation.error) {
      setError('Error creating employee')
      console.error('❌ Mutation error:', addMutation.error)
    }
  }, [addMutation.error])

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-amber-100 p-2 rounded-md">
            <User className="text-amber-600" />
          </div>
          <h2 className="text-lg font-semibold">Create Employee</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2 bg-transparent"
            onClick={handleDownloadTemplate}
          >
            <Download className="h-4 w-4" />
            Download Template
          </Button>
          <Button
            variant="outline"
            className="gap-2 bg-transparent"
            onClick={() => setIsImportPopupOpen(true)}
          >
            <Upload className="h-4 w-4" />
            Bulk Import
          </Button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 py-4">
        {/* Basic Information Section */}
        <div className="border p-8 rounded-lg bg-slate-100">
          <h3 className="text-md font-semibold mb-4">Basic Information</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="empCode">
                Employee Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="empCode"
                name="empCode"
                type="text"
                value={formData.empCode}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="officialPhone">
                Official Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="officialPhone"
                name="officialPhone"
                type="tel"
                value={formData.officialPhone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="personalPhone">Personal Phone</Label>
              <Input
                id="personalPhone"
                name="personalPhone"
                type="tel"
                value={formData.personalPhone || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">
                Gender <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleSelectChange('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">
                Date of Birth <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="doj">
                Date of Joining <span className="text-red-500">*</span>
              </Label>
              <Input
                id="doj"
                name="doj"
                type="date"
                value={formData.doj}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select
                value={formData.bloodGroup || ''}
                onValueChange={(value) =>
                  handleSelectChange('bloodGroup', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeePhoto" className="text-sm">
                Employee Photo
              </Label>
              <Input
                id="employeePhoto"
                type="file"
                accept="image/*"
                onChange={handleEmployeePhotoChange}
                className="text-sm"
              />
              {employeePhotoFile && (
                <p className="text-xs text-green-600">
                  ✓ Photo selected: {employeePhotoFile.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Address & Contact Information Section */}
        <div className="border p-8 rounded-lg bg-slate-100">
          <h3 className="text-md font-semibold mb-4">
            Address & Contact Information
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="presentAddress">
                Present Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="presentAddress"
                name="presentAddress"
                type="text"
                value={formData.presentAddress}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permanentAddress">Permanent Address</Label>
              <Input
                id="permanentAddress"
                name="permanentAddress"
                type="text"
                value={formData.permanentAddress || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">
                Emergency Contact Name
              </Label>
              <Input
                id="emergencyContactName"
                name="emergencyContactName"
                type="text"
                value={formData.emergencyContactName || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContactPhone">
                Emergency Contact Phone
              </Label>
              <Input
                id="emergencyContactPhone"
                name="emergencyContactPhone"
                type="tel"
                value={formData.emergencyContactPhone || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Employment Details Section */}
        <div className="border p-8 rounded-lg bg-slate-100">
          <h3 className="text-md font-semibold mb-4">Employment Details</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="departmentId">
                Department <span className="text-red-500">*</span>
              </Label>
              <CustomCombobox
                items={
                  departments?.data?.map((dept) => ({
                    id: dept?.departmentId?.toString() || '0',
                    name: dept.departmentName || 'Unnamed department',
                  })) || []
                }
                value={
                  formData.departmentId
                    ? {
                        id: formData.departmentId.toString(),
                        name:
                          departments?.data?.find(
                            (d) => d.departmentId === formData.departmentId
                          )?.departmentName || '',
                      }
                    : null
                }
                onChange={(value) =>
                  handleSelectChange(
                    'departmentId',
                    value ? String(value.id) : '0'
                  )
                }
                placeholder="Select department"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="designationId">
                Designation <span className="text-red-500">*</span>
              </Label>
              <CustomCombobox
                items={
                  designations?.data?.map((desig) => ({
                    id: desig?.designationId?.toString() || '0',
                    name: desig.designationName || 'Unnamed designation',
                  })) || []
                }
                value={
                  formData.designationId
                    ? {
                        id: formData.designationId.toString(),
                        name:
                          designations?.data?.find(
                            (d) => d.designationId === formData.designationId
                          )?.designationName || '',
                      }
                    : null
                }
                onChange={(value) =>
                  handleSelectChange(
                    'designationId',
                    value ? String(value.id) : '0'
                  )
                }
                placeholder="Select designation"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeTypeId">
                Employee Type <span className="text-red-500">*</span>
              </Label>
              <CustomCombobox
                items={
                  employeeTypes?.data?.map((type) => ({
                    id: type?.employeeTypeId?.toString() || '0',
                    name: type.employeeTypeName || 'Unnamed type',
                  })) || []
                }
                value={
                  formData.employeeTypeId
                    ? {
                        id: formData.employeeTypeId.toString(),
                        name:
                          employeeTypes?.data?.find(
                            (t) => t.employeeTypeId === formData.employeeTypeId
                          )?.employeeTypeName || '',
                      }
                    : null
                }
                onChange={(value) =>
                  handleSelectChange(
                    'employeeTypeId',
                    value ? String(value.id) : '0'
                  )
                }
                placeholder="Select employee type"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="basicSalary">
                Basic Salary <span className="text-red-500">*</span>
              </Label>
              <Input
                id="basicSalary"
                name="basicSalary"
                type="number"
                step="0.01"
                value={formData.basicSalary || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grossSalary">
                Gross Salary <span className="text-red-500">*</span>
              </Label>
              <Input
                id="grossSalary"
                name="grossSalary"
                type="number"
                step="0.01"
                value={formData.grossSalary || ''}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={resetForm}>
            Reset Fields
          </Button>
          <Button type="submit" disabled={addMutation.isPending}>
            {addMutation.isPending ? 'Creating...' : 'Create Employee'}
          </Button>
        </div>
      </form>

      <Popup
        isOpen={isImportPopupOpen}
        onClose={() => setIsImportPopupOpen(false)}
        title="Import Employees from Excel"
        size="sm:max-w-3xl"
      >
        <div className="py-4">
          <div className="mb-4 p-4 bg-amber-50 rounded-md">
            <h3 className="font-semibold mb-2">Excel Format Requirements:</h3>
            <p className="text-sm text-gray-700 mb-2">
              Your Excel file should have the following columns:
            </p>
            <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
              <li>
                <strong>FullName</strong> - Full name of employee (required)
              </li>
              <li>
                <strong>Email</strong> - Email address (required)
              </li>
              <li>
                <strong>OfficialPhone</strong> - Official phone number
                (required)
              </li>
              <li>
                <strong>PersonalPhone</strong> - Personal phone number
                (optional)
              </li>
              <li>
                <strong>PresentAddress</strong> - Present address (required)
              </li>
              <li>
                <strong>PermanentAddress</strong> - Permanent address (optional)
              </li>
              <li>
                <strong>EmergencyContactName</strong> - Emergency contact name
                (optional)
              </li>
              <li>
                <strong>EmergencyContactPhone</strong> - Emergency contact phone
                (optional)
              </li>
              <li>
                <strong>DOB</strong> - Date of birth in YYYY-MM-DD format
                (required)
              </li>
              <li>
                <strong>DOJ</strong> - Date of joining in YYYY-MM-DD format
                (required)
              </li>
              <li>
                <strong>Gender</strong> - Male or Female (required)
              </li>
              <li>
                <strong>BloodGroup</strong> - Blood group (optional)
              </li>
              <li>
                <strong>BasicSalary</strong> - Basic salary amount (required)
              </li>
              <li>
                <strong>GrossSalary</strong> - Gross salary amount (required)
              </li>
              <li>
                <strong>EmpCode</strong> - Employee code (required)
              </li>
              <li>
                <strong>DepartmentId</strong> - Department ID (required)
              </li>
              <li>
                <strong>DesignationId</strong> - Designation ID (required)
              </li>
              <li>
                <strong>EmployeeTypeId</strong> - Employee Type ID (required)
              </li>
            </ul>
            <p className="text-sm text-gray-700 mt-3">
              <strong>Tip:</strong> Download the template first to see the
              correct format!
            </p>
          </div>
          <ExcelFileInput
            onDataParsed={handleExcelDataParsed}
            onSubmit={handleExcelSubmit}
            submitButtonText="Import Employees"
            dateColumns={['DOB', 'DOJ']}
          />
        </div>
      </Popup>
    </div>
  )
}

export default CreateEmployee
