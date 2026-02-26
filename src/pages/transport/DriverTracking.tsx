import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Navigation, 
  StopCircle, 
  PlayCircle, 
  MapPin, 
  Activity,
  Clock,
  Gauge
} from 'lucide-react';

interface LocationData {
  latitude: number;
  longitude: number;
  speed: number | null;
  heading: number | null;
  accuracy: number;
  timestamp: Date;
}

interface Bus {
  id: string;
  bus_number: string;
  route_name: string;
}

const DriverTracking: React.FC = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string>('');
  const [selectedBus, setSelectedBus] = useState<string>('');
  const [buses, setBuses] = useState<Bus[]>([]);
  const [updateCount, setUpdateCount] = useState(0);
  const watchIdRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  // Fetch buses assigned to this driver
  useEffect(() => {
    fetchDriverBuses();
  }, []);

  const fetchDriverBuses = async () => {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Fetch buses where this user is the driver
      const { data, error } = await supabase
        .from('buses')
        .select('id, bus_number, route_name')
        .eq('is_active', true);
      
      if (data) {
        setBuses(data);
        if (data.length > 0) {
          setSelectedBus(data[0].id);
        }
      }
    }
  };

  // Start tracking location
  const startTracking = () => {
    if (!selectedBus) {
      setError('Please select a bus first');
      return;
    }

    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setError('');
    setIsTracking(true);

    // Watch position with optimized settings
    watchIdRef.current = navigator.geolocation.watchPosition(
      handleLocationUpdate,
      handleLocationError,
      {
        enableHighAccuracy: true,
        maximumAge: 5000, // Accept cached position up to 5 seconds old
        timeout: 10000, // Wait max 10 seconds for position
      }
    );
  };

  // Stop tracking location
  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    
    // Mark tracking as stopped in database
    if (selectedBus) {
      updateTrackingStatus(false);
    }
  };

  // Handle location updates
  const handleLocationUpdate = (position: GeolocationPosition) => {
    const now = Date.now();
    
    // Throttle updates to every 10 seconds to save battery and data
    if (now - lastUpdateRef.current < 10000) {
      return;
    }
    
    lastUpdateRef.current = now;

    const locationData: LocationData = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      speed: position.coords.speed ? position.coords.speed * 3.6 : 0, // Convert m/s to km/h
      heading: position.coords.heading,
      accuracy: position.coords.accuracy,
      timestamp: new Date()
    };

    setLocation(locationData);
    sendLocationToSupabase(locationData);
    setUpdateCount(prev => prev + 1);
  };

  // Handle location errors
  const handleLocationError = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setError('Location permission denied. Please enable location access.');
        break;
      case error.POSITION_UNAVAILABLE:
        setError('Location information unavailable. Check your GPS signal.');
        break;
      case error.TIMEOUT:
        setError('Location request timed out. Retrying...');
        break;
    }
    setIsTracking(false);
  };

  // Send location to Supabase
  const sendLocationToSupabase = async (locationData: LocationData) => {
    if (!selectedBus) return;

    try {
      // Insert location using PostGIS POINT format
      // Note: PostGIS uses (longitude, latitude) order, not (latitude, longitude)!
      const { error } = await supabase.rpc('insert_bus_location', {
        p_bus_id: selectedBus,
        p_longitude: locationData.longitude,
        p_latitude: locationData.latitude,
        p_speed: locationData.speed || 0,
        p_heading: locationData.heading || 0
      });

      if (error) {
        console.error('Error sending location:', error);
        setError('Failed to send location update');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // Update tracking status
  const updateTrackingStatus = async (status: boolean) => {
    await supabase
      .from('bus_locations')
      .update({ is_tracking: status })
      .eq('bus_id', selectedBus);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Navigation className="w-7 h-7 text-blue-600" />
              Bus Tracking
            </h1>
            {isTracking && (
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-500 animate-pulse" />
                <span className="text-sm font-medium text-green-600">Live</span>
              </div>
            )}
          </div>

          {/* Bus Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Bus
            </label>
            <select
              value={selectedBus}
              onChange={(e) => setSelectedBus(e.target.value)}
              disabled={isTracking}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">Choose a bus...</option>
              {buses.map((bus) => (
                <option key={bus.id} value={bus.id}>
                  {bus.bus_number} - {bus.route_name}
                </option>
              ))}
            </select>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-4">
            {!isTracking ? (
              <button
                onClick={startTracking}
                disabled={!selectedBus}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <PlayCircle className="w-5 h-5" />
                Start Trip
              </button>
            ) : (
              <button
                onClick={stopTracking}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <StopCircle className="w-5 h-5" />
                End Trip
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Location Status */}
        {location && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Current Status
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Coordinates */}
              <div className="col-span-2 bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-700">Location</span>
                </div>
                <p className="text-sm text-gray-600 font-mono">
                  Lat: {location.latitude.toFixed(6)}
                </p>
                <p className="text-sm text-gray-600 font-mono">
                  Lng: {location.longitude.toFixed(6)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Accuracy: ±{Math.round(location.accuracy)}m
                </p>
              </div>

              {/* Speed */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Gauge className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-700">Speed</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {location.speed?.toFixed(1) || '0'} 
                  <span className="text-sm font-normal text-gray-600 ml-1">km/h</span>
                </p>
              </div>

              {/* Updates */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-700">Updates</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {updateCount}
                  <span className="text-sm font-normal text-gray-600 ml-1">sent</span>
                </p>
              </div>

              {/* Last Update */}
              <div className="col-span-2 text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Last updated: {location.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!isTracking && !location && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Select your assigned bus from the dropdown</li>
              <li>Click "Start Trip" to begin tracking</li>
              <li>Keep this page open while driving your route</li>
              <li>Your location will update every 10 seconds</li>
              <li>Click "End Trip" when you complete your route</li>
            </ol>
            <div className="mt-4 bg-yellow-50 border border-yellow-200 px-4 py-3 rounded-lg text-sm text-yellow-800">
              <strong>Note:</strong> Keep your phone charged and connected to the internet for continuous tracking.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverTracking;
