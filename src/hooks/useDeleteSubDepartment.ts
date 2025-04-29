import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getAuthenticatedGqlClient, DELETE_SUB_DEPARTMENT_MUTATION } from '@/lib/api';

interface DeleteSubDepartmentResponse {
  deleteSubDepartment: {
    id: string; 
    name: string; 
  };
}

const deleteSubDepartment = async (id: string): Promise<DeleteSubDepartmentResponse['deleteSubDepartment']> => {
  const client = getAuthenticatedGqlClient();
  const data = await client.request<DeleteSubDepartmentResponse>(DELETE_SUB_DEPARTMENT_MUTATION, { id });
  return data.deleteSubDepartment;
};

export const useDeleteSubDepartment = () => {

  return useMutation<DeleteSubDepartmentResponse['deleteSubDepartment'], Error, string>({ 
    mutationFn: deleteSubDepartment,
    onSuccess: (deletedSubDept) => {
      toast.success(`Sub-department "${deletedSubDept.name}" deleted.`);
    },
    onError: (error, variables_id) => {
      toast.error(`Failed to delete sub-department (ID: ${variables_id}): ${error.message}`);
    },
  });
};
