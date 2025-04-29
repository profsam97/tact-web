import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getAuthenticatedGqlClient, DELETE_DEPARTMENT_MUTATION, Department } from '@/lib/api';

interface DeleteDepartmentResponse {
  deleteDepartment: {
    id: string;
  };
}

const deleteDepartment = async (id: string): Promise<{ id: string }> => {
  const client = getAuthenticatedGqlClient();
  const data = await client.request<DeleteDepartmentResponse>(DELETE_DEPARTMENT_MUTATION, { id });
  return data.deleteDepartment;
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation<{ id: string }, Error, string>({ 
    mutationFn: deleteDepartment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success(`Department deleted successfully!`);
    },
    onError: (error, variables) => {
      toast.error(`Failed to delete department (ID: ${variables}): ${error.message}`);
    },
  });
};
