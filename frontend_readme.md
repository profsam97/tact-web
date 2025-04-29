# Frontend API Documentation

This document provides guidance for frontend developers working with the backend API for the Tact application. The backend is a NestJS GraphQL API.

## API Endpoint

The main GraphQL endpoint is:

`http://localhost:3000/graphql` (Assuming the backend is running locally on port 3000)

All GraphQL queries and mutations should be sent as POST requests to this URL.

## Authentication

The API uses JSON Web Tokens (JWT) for authentication.

1.  **Registration:**
    *   **Endpoint:** `POST http://localhost:3000/auth/register` (This is a REST endpoint, not GraphQL)
    *   **Method:** POST
    *   **Body (JSON):**
        ```json
        {
          "username": "your_username",
          "password": "your_password"
        }
        ```
    *   **Response:**
        ```json
        {
          "success": "user created successfully"
        }
        ```

2.  **Login:**
    *   **Endpoint:** `POST http://localhost:3000/auth/login` (This is a REST endpoint, not GraphQL)
    *   **Method:** POST
    *   **Body (JSON):**
        ```json
        {
          "username": "your_username",
          "password": "your_password"
        }
        ```
    *   **Response:**
        ```json
        {
          "access_token": "your_jwt_token_here"
        }
        ```
    *   **Usage:** Store the `access_token` securely (e.g., in `localStorage` or a state management solution) and include it in the `Authorization` header of subsequent GraphQL requests.

3.  **Authenticated GraphQL Requests:**
    *   For all authenticated GraphQL queries and mutations, include the `Authorization` header in your HTTP request:
        ```
        Authorization: Bearer your_jwt_token_here
        ```
    *   Replace `your_jwt_token_here` with the actual token received from the login endpoint.

## GraphQL Operations

Here are the available GraphQL queries and mutations with examples. You can use a library like Apollo Client, Relay, or even standard `fetch` to interact with the API.

### Departments

#### 1. Create Department

Creates a new department, optionally with embedded sub-departments.

*   **Mutation:** `createDepartment`
*   **Input:** `CreateDepartmentInput` (requires `name: String!`, optional `subDepartments: [CreateEmbeddedSubDepartmentInput!]`)
*   **`CreateEmbeddedSubDepartmentInput`:** (requires `name: String!`)

```graphql
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
```

*   **Variables (JSON):**
    ```json
    {
      "input": {
        "name": "Engineering",
        "subDepartments": [
          { "name": "Frontend" },
          { "name": "Backend" }
        ]
      }
    }
    ```
    (The `subDepartments` array is optional)

#### 2. Get All Departments

Fetches all departments with their associated sub-departments.

*   **Query:** `getDepartments`
*   **Input:** None

```graphql
query GetAllDepartments {
  getDepartments {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

*   **Variables (JSON):** `{}`

#### 3. Get Department by ID

Fetches a single department by its ID with its associated sub-departments.

*   **Query:** `getDepartmentById`
*   **Input:** `id: String!`

```graphql
query GetDepartmentById($id: String!) {
  getDepartmentById(id: $id) {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

*   **Variables (JSON):**
    ```json
    {
      "id": "the_department_id"
    }
    ```

#### 4. Update Department

Updates an existing department's name.

*   **Mutation:** `updateDepartment`
*   **Input:** `UpdateDepartmentInput` (requires `id: String!`, optional `name: String`)

```graphql
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
```

*   **Variables (JSON):**
    ```json
    {
      "input": {
        "id": "the_department_id",
        "name": "Updated Department Name"
      }
    }
    ```

#### 5. Delete Department

Deletes a department by its ID. (Note: Due to `onDelete: Cascade` in the Prisma schema, associated sub-departments will also be deleted).

*   **Mutation:** `deleteDepartment`
*   **Input:** `id: String!`

```graphql
mutation DeleteExistingDepartment($id: String!) {
  deleteDepartment(id: $id) {
    id
    name
  }
}
```

*   **Variables (JSON):**
    ```json
    {
      "id": "the_department_id"
    }
    ```

### Sub-Departments

#### 1. Create Sub-Department

Creates a new sub-department and links it to an existing department.

*   **Mutation:** `createSubDepartment`
*   **Input:** `CreateSubDepartmentInput` (requires `name: String!`, `departmentId: String!`)

```graphql
mutation CreateNewSubDepartment($input: CreateSubDepartmentInput!) {
  createSubDepartment(input: $input) {
    id
    name
    departmentId
  }
}
```

*   **Variables (JSON):**
    ```json
    {
      "input": {
        "name": "Marketing Sub",
        "departmentId": "the_existing_department_id"
      }
    }
    ```

#### 2. Get All Sub-Departments

Fetches all sub-departments.

*   **Query:** `getSubDepartments`
*   **Input:** None

```graphql
query GetAllSubDepartments {
  getSubDepartments {
    id
    name
    departmentId
  }
}
```

*   **Variables (JSON):** `{}`

#### 3. Get Sub-Department by ID

Fetches a single sub-department by its ID.

*   **Query:** `getSubDepartmentById`
*   **Input:** `id: String!`

```graphql
query GetSubDepartmentById($id: String!) {
  getSubDepartmentById(id: $id) {
    id
    name
    departmentId
  }
}
```

*   **Variables (JSON):**
    ```json
    {
      "id": "the_sub_department_id"
    }
    ```

#### 4. Update Sub-Department

Updates an existing sub-department's name.

*   **Mutation:** `updateSubDepartment`
*   **Input:** `UpdateSubDepartmentInput` (requires `id: String!`, optional `name: String`)

```graphql
mutation UpdateExistingSubDepartment($input: UpdateSubDepartmentInput!) {
  updateSubDepartment(input: $input) {
    id
    name
    departmentId
  }
}
```

*   **Variables (JSON):**
    ```json
    {
      "input": {
        "id": "the_sub_department_id",
        "name": "Updated Sub-Department Name"
      }
    }
    ```

#### 5. Delete Sub-Department

Deletes a sub-department by its ID.

*   **Mutation:** `deleteSubDepartment`
*   **Input:** `id: String!`

```graphql
mutation DeleteExistingSubDepartment($id: String!) {
  deleteSubDepartment(id: $id) {
    id
    name
    departmentId
  }
}
```

*   **Variables (JSON):**
    ```json
    {
      "id": "the_sub_department_id"
    }
    ```



