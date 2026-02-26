import React from 'react';
import { Trash2 } from 'lucide-react';

interface TransportAssignment {
    id: string;
    students?: { full_name: string };
    routes?: { route_name: string };
    stops?: { stop_name: string };
    academic_year: string;
    assigned_at: string;
}

interface AssignmentsTabProps {
    assignments: TransportAssignment[];
    onDelete: (id: string) => void;
}

const AssignmentsTab: React.FC<AssignmentsTabProps> = ({ assignments, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stop</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Academic Year</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {assignments.map((assignment) => (
                        <tr key={assignment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {assignment.students?.full_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {assignment.routes?.route_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {assignment.stops?.stop_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {assignment.academic_year}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {new Date(assignment.assigned_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <button
                                    onClick={() => onDelete(assignment.id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {assignments.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                    No assignments found
                </div>
            )}
        </div>
    );
};

export default AssignmentsTab;
