import CreateDepartmentDialog from "../departments/CreateDepartmentDialog";
import { Button } from "./button";

export const EmptyState = () => ( 
    <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <h2 className="mt-2 text-xl font-semibold text-gray-800">No Departments Yet</h2>
      <p className="text-gray-500 mt-1">Get started by creating your first department.</p>
      <CreateDepartmentDialog>
          <Button className="mt-4">Create Department</Button>
      </CreateDepartmentDialog>
    </div>
  );