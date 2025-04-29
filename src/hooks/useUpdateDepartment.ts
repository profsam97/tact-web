import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getAuthenticatedGqlClient, UPDATE_DEPARTMENT_MUTATION, UpdateDepartmentInput, Department } from '@/lib/api';

interface UpdateDepartmentResponse {
  updateDepartment: Department;
}
const updateDepartment = async (input: UpdateDepartmentInput): Promise<Department> => {
  const client = getAuthenticatedGqlClient();
  const data = await client.request<UpdateDepartmentResponse>(UPDATE_DEPARTMENT_MUTATION, { input });
  return data.updateDepartment;
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation<Department, Error, UpdateDepartmentInput>({
    mutationFn: updateDepartment,
    onSuccess: (updatedDepartment) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success(`Department "${updatedDepartment.name}" updated successfully!`);

    },
    onError: (error, variables) => {
      toast.error(`Failed to update department (ID: ${variables.id}): ${error.message}`);
    },
  });
};
