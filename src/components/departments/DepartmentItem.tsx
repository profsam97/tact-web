import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Department } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import EditDepartmentDialog from '@/components/departments/EditDepartmentDialog';
import DeleteConfirmationDialog from '@/components/departments/DeleteConfirmationDialog';
interface DepartmentItemProps {
  department: Department;
  level?: number; 
}

const DepartmentItem: React.FC<DepartmentItemProps> = ({ department, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubDepartments = department.subDepartments && department.subDepartments.length > 0;

  const toggleExpand = () => {
    if (hasSubDepartments) {
      setIsExpanded(!isExpanded);
    }
  };
  const variants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' },
  };
  const indentationStyle = { marginLeft: `${level * 1}rem` };

  return (
    <div style={indentationStyle}> 
      <div className="flex items-center justify-between p-2 border-b border-gray-200 hover:bg-gray-50 rounded transition-colors duration-150">
        <div className="flex items-center flex-grow cursor-pointer" onClick={toggleExpand}>
          {hasSubDepartments ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 mr-2 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-2 text-gray-500" />
            )
          ) : (
            <span className="w-4 h-4 mr-2"></span> 
          )}
          <span className="font-medium text-gray-700">{department.name}</span>
        </div>
        <div className="flex space-x-1 text-gray-400">
            <EditDepartmentDialog department={department}>
            <Button variant="ghost" size="icon" title="Edit Department" className="h-7 w-7 hover:text-blue-600 hover:bg-blue-50">
                <Pencil className="h-4 w-4" />
            </Button>
            </EditDepartmentDialog>
            <DeleteConfirmationDialog department={department}>
            <Button variant="ghost" size="icon" title="Delete Department" className="h-7 w-7 hover:text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
            </Button>
            </DeleteConfirmationDialog>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {isExpanded && hasSubDepartments && (
          <motion.div
            key="sub-departments"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="pl-4 border-l border-gray-200 ml-2" 
          >
            {department.subDepartments?.map(subDept => (
              <div key={subDept.id} className="flex items-center justify-between p-2 border-b border-gray-100 hover:bg-gray-50 rounded">
                 <span className="text-sm text-gray-600">{subDept.name}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DepartmentItem;
