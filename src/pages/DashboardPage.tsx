import React, { useState } from 'react'; // Import useState
import { useDepartments } from '@/hooks/useDepartments';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useNavigate } from 'react-router-dom';
import { Skeleton } from "@/components/ui/skeleton";
import CreateDepartmentDialog from '@/components/departments/CreateDepartmentDialog';
import CreateSubDepartmentDialog from '@/components/departments/CreateSubDepartmentDialog';
import DepartmentItem from '@/components/departments/DepartmentItem'; 
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';

const PAGE_SIZE = 7; 

const DashboardPage: React.FC = () => {
  const [page, setPage] = useState(1); 
  const { data, isLoading, error, isError } = useDepartments(page, PAGE_SIZE);
  const departments = data?.departments;
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const clearToken = useAuthStore((state) => state.clearToken);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <div className="mx-auto p-4 md:p-6 lg:p-8 min-h-screen bg-gray-50">
      <header className="flex flex-wrap justify-between items-center mb-6 pb-4 border-b">
        <h1 className="text-3xl font-bold text-gray-800">Departments</h1>
        <div className="flex items-center space-x-3 mt-2 sm:mt-0">
             <CreateSubDepartmentDialog>
                <Button variant="outline">Create Sub-Dept</Button>
             </CreateSubDepartmentDialog>
             <CreateDepartmentDialog>
                 <Button>Create Department</Button>
             </CreateDepartmentDialog>
             <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      <main className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200"> {/* Added container styling */}
        {isLoading && <LoadingSkeleton />}
        {isError && <p className="text-center text-red-600 bg-red-100 p-4 rounded border border-red-300">Error fetching departments: {error?.message || 'Unknown error'}</p>}
        {!isLoading && !isError && departments && departments.length > 0 && (
          <div className="space-y-1">
            {departments.map(dept => (
              <DepartmentItem key={dept.id} department={dept} level={0} />
            ))}
          </div>
        )}
        {!isLoading && !isError && (!departments || departments.length === 0) && (
          <EmptyState />
        )}
      </main>
      {!isLoading && !isError  && (
        <footer className="mt-6 py-4 border-t border-gray-200 " style={{position: 'absolute', display: 'flex', width: '98%', flexDirection: 'row', justifyContent: 'center',   bottom: 10}}>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPage(p => Math.max(1, p - 1)); }}
                  aria-disabled={page <= 1}
                  tabIndex={page <= 1 ? -1 : undefined}
                  className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>
               <PaginationItem>
                 <span className="px-4 text-sm">Page {page} of {totalPages}</span>
               </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPage(p => Math.min(totalPages, p + 1)); }}
                  aria-disabled={page >= totalPages}
                  tabIndex={page >= totalPages ? -1 : undefined}
                  className={page >= totalPages ? "pointer-events-none opacity-50" : undefined}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </footer>
      )}
    </div>
  );
};

export default DashboardPage;
