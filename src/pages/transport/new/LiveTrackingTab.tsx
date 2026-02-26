import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../../../lib/supabase';
import * as L from 'leaflet';
import { Activity, Navigation } from 'lucide-react';

interface VehicleLocation {
    id: string;
    vehicle_number: string;
    driver_name: string;
    latitude: number;
    longitude: number;
    current_speed: number;
    heading: number;
    last_location_update: string;
    status: string;
}

const LiveTrackingTab: React.FC = () => {
    const [activeVehicles, setActiveVehicles] = useState<VehicleLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

    useEffect(() => {
        fetchActiveVehicles();
        subscribeToLocationUpdates();
    }, []);

    const fetchActiveVehicles = async () => {
        const { data, error } = await supabase
            .from('vehicles')
            .select('*')
            .eq('is_tracking', true)
            .not('latitude', 'is', null)
            .not('longitude', 'is', null)
            .eq('status', 'active');

        if (data) {
            setActiveVehicles(data);
        }
        setLoading(false);
    };

    const subscribeToLocationUpdates = () => {
        const channel = supabase
            .channel('vehicle-tracking')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'vehicles',
                    filter: 'is_tracking=eq.true'
                },
                (payload) => {
                    console.log('Location update:', payload);
                    fetchActiveVehicles();
                }
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    };

    const createBusIcon = (isSelected: boolean) => {
        const color = isSelected ? 'red' : 'blue';
        return L.divIcon({
            html: `<div class="bg-${color}-500 text-white rounded-full p-2 shadow-lg border-2 border-white">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                       <path d="M8 6v6M16 6v6M2 12h19M3 18h18M3 6h18v12H3z"/>
                     </svg>
                   </div>`,
            className: 'custom-bus-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });
    };

    const getMapCenter = (): [number, number] => {
        if (activeVehicles.length > 0) {
            return [activeVehicles[0].latitude, activeVehicles[0].longitude];
        }
        return [28.6139, 77.2090]; // Default: Delhi
    };

    if (loading) {
        return (
            <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading live tracking...</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
            {/* Map Section */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Live Vehicle Tracking</h2>
                        <span className="text-sm text-gray-600">
                            {activeVehicles.length} vehicle{activeVehicles.length !== 1 ? 's' : ''} active
                        </span>
                    </div>
                    <MapContainer
                        center={getMapCenter()}
                        zoom={12}
                        style={{ height: '600px', width: '100%' }}
                        className="rounded-lg"
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; OpenStreetMap contributors'
                        />
                        {activeVehicles.map((vehicle) => (
                            <Marker
                                key={vehicle.id}
                                position={[vehicle.latitude, vehicle.longitude]}
                                icon={createBusIcon(selectedVehicle === vehicle.id)}
                                eventHandlers={{
                                    click: () => setSelectedVehicle(vehicle.id)
                                }}
                            >
                                <Popup>
                                    <div className="p-2">
                                        <h3 className="font-bold text-lg">{vehicle.vehicle_number}</h3>
                                        <p className="text-sm">Driver: {vehicle.driver_name}</p>
                                        <p className="text-sm">Speed: {vehicle.current_speed || 0} km/h</p>
                                        <p className="text-sm">Heading: {vehicle.heading || 0}°</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Updated: {vehicle.last_location_update 
                                                ? new Date(vehicle.last_location_update).toLocaleTimeString()
                                                : 'N/A'}
                                        </p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>

            {/* Vehicle Status Sidebar */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Active Vehicles</h2>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {activeVehicles.length} Live
                    </span>
                </div>

                {activeVehicles.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                        <Navigation className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <p>No vehicles currently tracking</p>
                    </div>
                ) : (
                    activeVehicles.map((vehicle) => (
                        <div
                            key={vehicle.id}
                            onClick={() => setSelectedVehicle(vehicle.id)}
                            className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all hover:shadow-md ${
                                selectedVehicle === vehicle.id ? 'ring-2 ring-blue-500' : ''
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-lg">{vehicle.vehicle_number}</span>
                                <Activity className="w-5 h-5 text-green-500 animate-pulse" />
                            </div>
                            <p className="text-sm text-gray-600">
                                Driver: {vehicle.driver_name}
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium">
                                        Speed: {vehicle.current_speed || 0} km/h
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {vehicle.last_location_update
                                            ? new Date(vehicle.last_location_update).toLocaleString()
                                            : 'No recent update'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Heading</p>
                                    <p className="text-sm font-medium">{vehicle.heading || 0}°</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LiveTrackingTab;
