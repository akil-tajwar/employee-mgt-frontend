'use client';

import { useGetAllEmployees, useGetEmployeeAttendances, useGetOfficeTimingWeekends } from '@/hooks/use-api';
import { useInitializeUser } from '@/utils/user';
import React from 'react';

const EmployeeAttendances = () => {
    useInitializeUser()
    const { data: officeTimingWeekends } = useGetOfficeTimingWeekends()
    const { data: employees } = useGetAllEmployees()
    const { data: employeeAttendances } = useGetEmployeeAttendances()
    return (
        <div>
            employee attendances
        </div>
    );
};

export default EmployeeAttendances;