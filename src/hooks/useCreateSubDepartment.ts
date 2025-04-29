import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getAuthenticatedGqlClient, CREATE_SUB_DEPARTMENT_MUTATION, CreateSubDepartmentInput, SubDepartment } from '@/lib/api';

interface CreateSubDepartmentResponse {
  createSubDepartment: SubDepartment & { departmentId: string }; 
}
const createSubDepartment = async (input: CreateSubDepartmentInput): Promise<CreateSubDepartmentResponse['createSubDepartment']> => {
  const client = getAuthenticatedGqlClient();
  const data = await client.request<CreateSubDepartmentResponse>(CREATE_SUB_DEPARTMENT_MUTATION, { input });
  return data.createSubDepartment;
};

export const useCreateSubDepartment = () => {

  return useMutation<CreateSubDepartmentResponse['createSubDepartment'], Error, CreateSubDepartmentInput>({
    mutationFn: createSubDepartment,
    onSuccess: (newSubDept) => {
        toast.success(`Sub-department "${newSubDept.name}" created.`);
    },
    onError: (error, variables) => {
      toast.error(`Failed to create sub-department "${variables.name}": ${error.message}`);
    },
  });
};
