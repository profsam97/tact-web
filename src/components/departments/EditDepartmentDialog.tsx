import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { PlusCircle, XCircle } from 'lucide-react'; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { departmentSchema, DepartmentFormData } from '@/schemas/departmentSchemas';
import { useUpdateDepartment } from '@/hooks/useUpdateDepartment';
import { useCreateSubDepartment } from '@/hooks/useCreateSubDepartment';
import { useUpdateSubDepartment } from '@/hooks/useUpdateSubDepartment';
import { useDeleteSubDepartment } from '@/hooks/useDeleteSubDepartment';
import { Department, UpdateDepartmentInput, CreateSubDepartmentInput, UpdateSubDepartmentInput as SubUpdateInput } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';
interface EditDepartmentDialogProps {
  children: React.ReactNode;
  department: Department;
}
const EditDepartmentDialog: React.FC<EditDepartmentDialogProps> = ({ children, department }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutateAsync: updateDepartment, isPending: isUpdatingDept } = useUpdateDepartment();
  const { mutateAsync: createSubDepartment, isPending: isCreatingSub } = useCreateSubDepartment();
  const { mutateAsync: updateSubDepartment, isPending: isUpdatingSub } = useUpdateSubDepartment();
  const { mutateAsync: deleteSubDepartment, isPending: isDeletingSub } = useDeleteSubDepartment(); // Add delete hook
  const isPending = isUpdatingDept || isCreatingSub || isUpdatingSub || isDeletingSub;
  const originalSubDepartments = React.useRef<Department['subDepartments']>([]);
  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: department.name || "",
      subDepartments: department.subDepartments?.map(sub => ({ id: sub.id, name: sub.name })) || [],
    },
  });
   const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subDepartments"
  });
  useEffect(() => {
    if (isOpen) {
        const initialSubs = department.subDepartments?.map(sub => ({ id: sub.id, name: sub.name })) || [];
        form.reset({
            name: department.name || "",
            subDepartments: initialSubs,
        });
        originalSubDepartments.current = initialSubs; // Store original state
    }
  }, [isOpen, department, form]);

 const onSubmit = async (data: DepartmentFormData) => {
    const mutationPromises: Promise<any>[] = [];
    let mainDeptUpdated = false;

    //we update Department Name (if changed)
    if (data.name !== department.name) {
        const deptInput: UpdateDepartmentInput = { id: department.id, name: data.name };
        // we use mutateAsync to get a Promise for Promise.all
        mutationPromises.push(updateDepartment(deptInput));
        mainDeptUpdated = true;
    }
    //process sub-departments
    const submittedSubs = data.subDepartments || [];
    const originalSubs = originalSubDepartments.current || [];

    // Find sub-departments to update (have ID, name changed)
    submittedSubs.forEach(submittedSub => {
        if (submittedSub.id) { // that is an existing sub-department
            const originalSub = originalSubs.find(orig => orig.id === submittedSub.id);
            if (originalSub && originalSub.name !== submittedSub.name && submittedSub.name.trim() !== '') {
                const subInput: SubUpdateInput = { id: submittedSub.id, name: submittedSub.name.trim() };
                mutationPromises.push(updateSubDepartment(subInput));
            }
        }
    });

    submittedSubs.forEach(submittedSub => {
        if (!submittedSub.id && submittedSub.name.trim() !== '') {
            const subInput: CreateSubDepartmentInput = {
                departmentId: department.id,
                name: submittedSub.name.trim(),
            };
            mutationPromises.push(createSubDepartment(subInput));
        }
    });

    const submittedSubIds = new Set(submittedSubs.map(s => s.id).filter(id => id)); 
    originalSubs.forEach(originalSub => {
        // If an original sub with an ID is not found among the submitted existing subs, we delete it.
        if (originalSub.id && !submittedSubIds.has(originalSub.id)) {
             mutationPromises.push(deleteSubDepartment(originalSub.id));
        }
    });

    if (mutationPromises.length === 0 && !mainDeptUpdated) {
       setIsOpen(false); 
       return;
    }
    try {
        await Promise.all(mutationPromises);
        queryClient.invalidateQueries({ queryKey: ['departments'] });
        setIsOpen(false);
    } catch (error) {
        console.error("Error during department/sub-department update:", error);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
          <DialogDescription>
            Update the name for the "{department.name}" department. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Marketing" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-3 mt-4">
                <Label>Sub-departments</Label>
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-2">
                        <FormField
                        control={form.control}
                        name={`subDepartments.${index}.name`}
                        render={({ field }) => (
                            <FormItem className="flex-grow">
                            <FormControl>
                                <Input placeholder={`Sub-dept ${index + 1} name`} {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                         <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => remove(index)}
                         >
                            <XCircle className="h-4 w-4" />
                        </Button>
                    </div>
                 ))}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => append({ id: undefined, name: "" })}
                >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Sub-department
                </Button>
            </div>
             <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={isPending}>Cancel</Button>
                 </DialogClose>
              <Button type="submit" disabled={isPending || !form.formState.isDirty}>
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default EditDepartmentDialog;
