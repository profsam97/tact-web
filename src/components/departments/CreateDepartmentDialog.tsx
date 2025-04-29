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
import { useCreateDepartment } from '@/hooks/useCreateDepartment';
import { CreateDepartmentInput } from '@/lib/api';

interface CreateDepartmentDialogProps {
  children: React.ReactNode; 
}

const CreateDepartmentDialog: React.FC<CreateDepartmentDialogProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: createDepartment, isPending, isSuccess } = useCreateDepartment();

  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      subDepartments: [], 
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subDepartments"
  });

  const onSubmit = (data: DepartmentFormData) => {
    const validSubDepartments: { name: string }[] = data.subDepartments
        ?.filter(sub => sub.name.trim() !== '')
        .map(sub => ({ name: sub.name })) // we ensure each object has only the 'name' property as expected
        ?? []; // defaults to empty array if data.subDepartments is undefined

    const input: CreateDepartmentInput = {
        name: data.name,
        ...(validSubDepartments.length > 0 && { subDepartments: validSubDepartments }),
    };
    createDepartment(input);
  };

  useEffect(() => {
    if (isSuccess && !isPending) { 
      form.reset();
      setIsOpen(false);
    }
  }, [isSuccess, isPending, form]);

  useEffect(() => {
    if (!isOpen) {
        const timer = setTimeout(() => {
            form.reset({ name: "", subDepartments: [] }); 
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
          <DialogTitle>Create Department</DialogTitle>
          <DialogDescription>
            Enter the name for the new department. Click save when you're done.
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
            <div className="space-y-3">
                <Label>Sub-departments (Optional)</Label>
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
                    onClick={() => append({ name: "" })} 
                >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Sub-department
                </Button>
            </div>
             <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                 </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Department'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default CreateDepartmentDialog;
