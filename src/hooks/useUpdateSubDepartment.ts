import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getAuthenticatedGqlClient, UPDATE_SUB_DEPARTMENT_MUTATION, UpdateSubDepartmentInput, SubDepartment, Department } from '@/lib/api';

interface UpdateSubDepartmentResponse {
  updateSubDepartment: SubDepartment & { departmentId: string };
}
const updateSubDepartment = async (input: UpdateSubDepartmentInput): Promise<UpdateSubDepartmentResponse['updateSubDepartment']> => {
  const client = getAuthenticatedGqlClient();
  const data = await client.request<UpdateSubDepartmentResponse>(UPDATE_SUB_DEPARTMENT_MUTATION, { input });
  return data.updateSubDepartment;
};

export const useUpdateSubDepartment = () => {

  return useMutation<UpdateSubDepartmentResponse['updateSubDepartment'], Error, UpdateSubDepartmentInput>({
    mutationFn: updateSubDepartment,
    onSuccess: (updatedSubDept) => {
      toast.success(`Sub-department "${updatedSubDept.name}" updated.`);
    },
    onError: (error, variables) => {
      const identifier = variables.name ? `"${variables.name}"` : `(ID: ${variables.id})`;
      toast.error(`Failed to update sub-department ${identifier}: ${error.message}`);
    },
  });
};
