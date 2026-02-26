import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface Route {
    id: string;
    route_name: string;
    route_code: string;
    start_point: string;
    end_point: string;
    total_stops: number;
    distance_km: number;
    morning_start_time: string;
    fee_amount: number;
    status: 'active' | 'inactive';
}

interface RoutesTabProps {
    routes: Route[];
    onEdit: (route: Route) => void;
    onDelete: (id: string) => void;
}

const RoutesTab: React.FC<RoutesTabProps> = ({ routes, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start - End</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stops</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Morning Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {routes.map((route) => (
                        <tr key={route.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {route.route_code}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {route.route_name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                {route.start_point} → {route.end_point}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {route.distance_km} km
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {route.total_stops}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {route.morning_start_time}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                ₹{route.fee_amount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    route.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {route.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onEdit(route)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(route.id)}
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
            {routes.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                    No routes found
                </div>
            )}
        </div>
    );
};

export default RoutesTab;
