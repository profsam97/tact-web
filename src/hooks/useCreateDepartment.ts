import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getAuthenticatedGqlClient, CREATE_DEPARTMENT_MUTATION, CreateDepartmentInput, Department } from '@/lib/api';

interface CreateDepartmentResponse {
  createDepartment: Department;
}

const createDepartment = async (input: CreateDepartmentInput): Promise<Department> => {
  const client = getAuthenticatedGqlClient();
  const data = await client.request<CreateDepartmentResponse>(CREATE_DEPARTMENT_MUTATION, { input });
  return data.createDepartment;
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation<Department, Error, CreateDepartmentInput>({
    mutationFn: createDepartment,
    onSuccess: (newDepartment) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success(`Department "${newDepartment.name}" created successfully!`);
    },
    onError: (error) => {
      toast.error(`Failed to create department: ${error.message}`);
    },
  });
};
