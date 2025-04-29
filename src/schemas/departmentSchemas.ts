import { z } from 'zod';
export const departmentSchema = z.object({
  name: z.string().min(1, { message: "Department name cannot be empty" }),
  subDepartments: z.array(z.object({
    id: z.string().optional(), 
    name: z.string().min(1, { message: "Sub-department name cannot be empty" })
  })).optional(),
});

export type DepartmentFormData = z.infer<typeof departmentSchema>;
