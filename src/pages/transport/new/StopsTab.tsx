import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface Stop {
    id: string;
    stop_name: string;
    stop_order: number;
    pickup_time: string;
    drop_time: string;
    landmark: string;
}

interface StopsTabProps {
    stops: Stop[];
    onEdit: (stop: Stop) => void;
    onDelete: (id: string) => void;
}

const StopsTab: React.FC<StopsTabProps> = ({ stops, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stop Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pickup Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Drop Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Landmark</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {stops.map((stop) => (
                        <tr key={stop.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {stop.stop_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                #{stop.stop_order}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {stop.pickup_time}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {stop.drop_time}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                {stop.landmark}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onEdit(stop)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(stop.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {stops.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                    No stops found
                </div>
            )}
        </div>
    );
};

export default StopsTab;
