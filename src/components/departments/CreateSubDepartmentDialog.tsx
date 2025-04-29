import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; 
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createSubDepartmentSchema, CreateSubDepartmentFormData } from '@/schemas/subDepartmentSchema'; 
import { useCreateSubDepartment } from '@/hooks/useCreateSubDepartment'; 
import { useDepartments } from '@/hooks/useDepartments'; 
import { CreateSubDepartmentInput } from '@/lib/api';

interface CreateSubDepartmentDialogProps {
  children: React.ReactNode; 
}

const CreateSubDepartmentDialog: React.FC<CreateSubDepartmentDialogProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: departmentsData, isLoading: isLoadingDepts } = useDepartments();
  const departments = departmentsData?.departments;
  const { mutate: createSubDepartment, isPending } = useCreateSubDepartment();

  const form = useForm<CreateSubDepartmentFormData>({
    resolver: zodResolver(createSubDepartmentSchema),
    defaultValues: {
      name: "",
      departmentId: "",
    },
  });

  const onSubmit = (data: CreateSubDepartmentFormData) => {
    const input: CreateSubDepartmentInput = {
      name: data.name,
      departmentId: data.departmentId,
    };
    createSubDepartment(input, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['departments'] }); 
            setIsOpen(false); 
            form.reset(); 
        }
    });
  };

  // Reset form when dialog is closed manually
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        form.reset({ name: "", departmentId: "" });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Sub-Department</DialogTitle>
          <DialogDescription>
            Enter a name and select the parent department.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
             <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Department</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingDepts}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingDepts ? "Loading..." : "Select a department"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {!isLoadingDepts && departments?.map(dept => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                       {isLoadingDepts && <SelectItem value="loading" disabled>Loading...</SelectItem>}
                       {!isLoadingDepts && !departments?.length && <SelectItem value="no-depts" disabled>No departments found</SelectItem>}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub-Department Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Content Marketing" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={isPending}>Cancel</Button>
                 </DialogClose>
              <Button type="submit" disabled={isPending || isLoadingDepts}>
                {isPending ? 'Saving...' : 'Save Sub-Department'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSubDepartmentDialog;
