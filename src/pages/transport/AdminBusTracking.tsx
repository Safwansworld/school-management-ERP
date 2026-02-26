import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../../lib/supabase'; // Adjust path as needed
import * as L from 'leaflet';
import { Bus, MapPin, Activity } from 'lucide-react';


interface BusLocation {
  id: string;
  bus_id: string;
  latitude: number;
  longitude: number;
  speed: number;
  timestamp: string;
  bus: {
    bus_number: string;
    driver_name: string;
    route_name: string;
  };
}

const AdminBusTracking: React.FC = () => {
  const [buses, setBuses] = useState<BusLocation[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all active bus locations
  useEffect(() => {
    fetchActiveBuses();
    subscribeToLocationUpdates();
  }, []);

  const fetchActiveBuses = async () => {
    const { data, error } = await supabase
      .from('bus_locations')
      .select(`
        *,
        bus:buses(bus_number, driver_name, route_name)
      `)
      .eq('is_tracking', true)
      .order('timestamp', { ascending: false });

    if (data) {
      // Convert PostGIS geography to lat/lng
      const formatted = data.map(loc => ({
        ...loc,
        latitude: loc.location.coordinates[1],
        longitude: loc.location.coordinates[0]
      }));
      setBuses(formatted);
    }
    setLoading(false);
  };

  // Subscribe to real-time location updates
  const subscribeToLocationUpdates = () => {
    const channel = supabase
      .channel('bus-tracking')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bus_locations'
        },
        (payload) => {
          console.log('New location update:', payload);
          fetchActiveBuses(); // Refresh all buses
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Bus className="w-8 h-8" />
          Bus Fleet Tracking
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <MapContainer
                center={[28.6139, 77.2090]} // Default center
                zoom={12}
                style={{ height: '600px', width: '100%' }}
                className="rounded-lg"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                {buses.map((bus) => (
                  <Marker
                    key={bus.id}
                    position={[bus.latitude, bus.longitude]}
                    icon={createBusIcon()}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold">{bus.bus.bus_number}</h3>
                        <p>Driver: {bus.bus.driver_name}</p>
                        <p>Route: {bus.bus.route_name}</p>
                        <p>Speed: {bus.speed} km/h</p>
                        <p className="text-xs text-gray-500">
                          Updated: {new Date(bus.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Bus Status Sidebar */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Active Buses ({buses.length})</h2>
            {buses.map((bus) => (
              <div key={bus.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-lg">{bus.bus.bus_number}</span>
                  <Activity className="w-5 h-5 text-green-500 animate-pulse" />
                </div>
                <p className="text-sm text-gray-600">
                  Driver: {bus.bus.driver_name}
                </p>
                <p className="text-sm text-gray-600">
                  Route: {bus.bus.route_name}
                </p>
                <p className="text-sm font-medium mt-2">
                  Speed: {bus.speed} km/h
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(bus.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom bus marker icon
const createBusIcon = () => {
  return L.divIcon({
    html: `<div class="bg-blue-500 text-white rounded-full p-2 shadow-lg">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M8 6v6M16 6v6M2 12h19M3 18h18M3 6h18v12H3z"/>
             </svg>
           </div>`,
    className: 'custom-bus-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
};

export default AdminBusTracking;
