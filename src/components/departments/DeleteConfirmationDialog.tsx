import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteDepartment } from '@/hooks/useDeleteDepartment';
import { Department } from '@/lib/api';
interface DeleteConfirmationDialogProps {
  children: React.ReactNode; 
  department: Department; 
  onDeleted?: () => void; 
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  children,
  department,
  onDeleted,
}) => {
  const { mutate: deleteDepartment, isPending } = useDeleteDepartment();

  const handleDelete = () => {
    deleteDepartment(department.id, {
        onSuccess: () => {
            if (onDeleted) onDeleted();
        },
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            department "<span className="font-semibold">{department.name}</span>"
            {department.subDepartments && department.subDepartments.length > 0 && (
                <span> and its associated sub-departments</span>
            )}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90" // Style as destructive action
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
