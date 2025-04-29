import { z } from 'zod';
export const createSubDepartmentSchema = z.object({
  name: z.string().min(1, { message: "Sub-department name cannot be empty" }),
  departmentId: z.string().min(1, { message: "Please select a parent department" }), // Ensure a department is selected
});

export type CreateSubDepartmentFormData = z.infer<typeof createSubDepartmentSchema>;
