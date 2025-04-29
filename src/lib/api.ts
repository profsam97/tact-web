import { GraphQLClient } from 'graphql-request';
import { useAuthStore } from '@/store/authStore'; 
import { gql } from 'graphql-request'; 

const DEV_URL = 'http://localhost:3000'
const PROD_URL = 'https://tact-app.onrender.com'
const API_URL = PROD_URL; 
const GQL_ENDPOINT = `${API_URL}/graphql`;
const gqlClient = new GraphQLClient(GQL_ENDPOINT);

export const getAuthenticatedGqlClient = () => {
  const token = useAuthStore.getState().token;

  if (token) {
    gqlClient.setHeader('Authorization', `Bearer ${token}`);
  } else {
    gqlClient.setHeaders({});
  }
  return gqlClient;
};
export const registerUser = async (credentials: { username: string; password: string }) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
    throw new Error(errorData.message || 'Registration failed');
  }

  return response.json(); 
};

// Login User
export const loginUser = async (credentials: { username: string; password: string }) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(errorData.message || 'Invalid credentials');
  }

  const data = await response.json(); 
  return data;
};
export interface SubDepartment {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
  subDepartments?: SubDepartment[]; 
}

export interface PaginationInput {
  take?: number;
  skip?: number;
}

export interface PaginatedDepartmentsResponse {
  getDepartments: {
    items: Department[];
    totalCount: number;
  };
}

export const GET_DEPARTMENTS_QUERY = gql`
  query GetDepartments($pagination: PaginationInput) { # Add pagination variable
    getDepartments(pagination: $pagination) {          # Pass variable to query
      items {                                          # Request items array
        id
        name
        subDepartments {
          id
          name
        }
      }
      totalCount # Request totalCount
    }
  }
`;
export const CREATE_DEPARTMENT_MUTATION = gql`
  mutation CreateNewDepartment($input: CreateDepartmentInput!) {
    createDepartment(input: $input) {
      id
      name
      subDepartments {
        id
        name
      }
    }
  }
`;

export const UPDATE_DEPARTMENT_MUTATION = gql`
  mutation UpdateExistingDepartment($input: UpdateDepartmentInput!) {
    updateDepartment(input: $input) {
      id
      name
      subDepartments {
        id
        name
      }
    }
  }
`;

export const DELETE_DEPARTMENT_MUTATION = gql`
  mutation DeleteExistingDepartment($id: String!) {
    deleteDepartment(id: $id) {
      id # Return ID of deleted item for confirmation/cache update
    }
  }
`;

export interface CreateDepartmentInput {
  name: string;
  subDepartments?: { name: string }[]; 
}

export interface UpdateDepartmentInput {
  id: string;
  name?: string; 
}
export const CREATE_SUB_DEPARTMENT_MUTATION = gql`
  mutation CreateNewSubDepartment($input: CreateSubDepartmentInput!) {
    createSubDepartment(input: $input) {
      id
      name
      departmentId
    }
  }
`;

export const UPDATE_SUB_DEPARTMENT_MUTATION = gql`
  mutation UpdateExistingSubDepartment($input: UpdateSubDepartmentInput!) {
    updateSubDepartment(input: $input) {
      id
      name
      departmentId
    }
  }
`;

export const DELETE_SUB_DEPARTMENT_MUTATION = gql`
  mutation DeleteExistingSubDepartment($id: String!) {
    deleteSubDepartment(id: $id) {
      id 
      name
      departmentId
    }
  }
`;
export interface CreateSubDepartmentInput {
  name: string;
  departmentId: string;
}

export interface UpdateSubDepartmentInput {
  id: string;
  name?: string;
}
