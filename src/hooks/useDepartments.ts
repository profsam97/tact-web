import { useQuery } from '@tanstack/react-query';
import { getAuthenticatedGqlClient, GET_DEPARTMENTS_QUERY, Department, PaginationInput, PaginatedDepartmentsResponse } from '@/lib/api';

export interface UseDepartmentsData {
  departments: Department[];
  totalCount: number;
}

export const useDepartments = (page?: number, pageSize?: number) => {
  const skip = (page && pageSize) ? (page - 1) * pageSize : undefined;
  const take = pageSize;

  const fetchDepartmentsData = async (): Promise<UseDepartmentsData> => {
    const client = getAuthenticatedGqlClient();
    const pagination: PaginationInput | undefined = (take !== undefined && skip !== undefined) ? { take, skip } : undefined;
    const variables = pagination ? { pagination } : {}; 

    const data = await client.request<PaginatedDepartmentsResponse>(GET_DEPARTMENTS_QUERY, variables);

     return {
        departments: data.getDepartments?.items || [],
        totalCount: data.getDepartments?.totalCount || 0 
    };
  };

  const queryKey = ['departments', page ?? 'all', pageSize ?? 'all'];

  return useQuery<UseDepartmentsData, Error>({
    queryKey: queryKey,
    queryFn: fetchDepartmentsData,
  });
};
