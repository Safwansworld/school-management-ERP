import React from 'react';
import { Edit, Trash2, Bus } from 'lucide-react';

interface Vehicle {
    id: string;
    vehicle_number: string;
    vehicle_type: string;
    capacity: number;
    driver_name: string;
    driver_phone: string;
    driver_license: string;
    license_expiry: string;
    insurance_expiry: string;
    status: 'active' | 'maintenance' | 'inactive';
}

interface VehiclesTabProps {
    vehicles: Vehicle[];
    onEdit: (vehicle: Vehicle) => void;
    onDelete: (id: string) => void;
}

const VehiclesTab: React.FC<VehiclesTabProps> = ({ vehicles, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle Number</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License Expiry</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {vehicles.map((vehicle) => (
                        <tr key={vehicle.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {vehicle.vehicle_number}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {vehicle.vehicle_type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {vehicle.capacity} seats
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {vehicle.driver_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {vehicle.driver_phone}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {new Date(vehicle.license_expiry).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    vehicle.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : vehicle.status === 'maintenance'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {vehicle.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onEdit(vehicle)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(vehicle.id)}
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
            {vehicles.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                    No vehicles found
                </div>
            )}
        </div>
    );
};

export default VehiclesTab;
