// import { useState, useEffect } from 'react';
// import { supabase } from '../../../lib/supabase';
// import {
//     Bus,
//     MapPin,
//     Users,
//     Clock,
//     Navigation,
//     Play,
//     Square,
//     AlertCircle,
//     Phone,
//     CheckCircle,
//     XCircle,
//     Info,
//     Route as RouteIcon
// } from 'lucide-react';

// interface VehicleInfo {
//     id: string;
//     vehicle_number: string;
//     vehicle_type: string;
//     capacity: number;
//     driver_name: string;
//     driver_phone: string;
//     is_tracking: boolean;
//     current_speed: number;
//     latitude: number;
//     longitude: number;
// }

// interface RouteInfo {
//     id: string;
//     route_code: string;
//     route_name: string;
//     start_point: string;
//     end_point: string;
//     morning_start_time: string;
//     evening_start_time: string;
//     distance_km: number;
// }

// interface Stop {
//     id: string;
//     stop_name: string;
//     stop_order: number;
//     pickup_time: string;
//     drop_time: string;
//     landmark: string;
// }

// interface Student {
//     id: string;
//     student_id: string;
//     student_name: string;
//     stop_id: string;
//     stop_name: string;
//     pickup_time: string;
//     present: boolean;
// }

// export default function DriverDashboard() {
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [vehicle, setVehicle] = useState<VehicleInfo | null>(null);
//     const [route, setRoute] = useState<RouteInfo | null>(null);
//     const [stops, setStops] = useState<Stop[]>([]);
//     const [students, setStudents] = useState<Student[]>([]);
//     const [isTracking, setIsTracking] = useState(false);
//     const [currentPosition, setCurrentPosition] = useState<GeolocationPosition | null>(null);
//     const [watchId, setWatchId] = useState<number | null>(null);
//     const [tripType, setTripType] = useState<'morning' | 'evening'>('morning');

//     // Get current driver info from auth (you'll need to implement this based on your auth)
//     const driverPhone = '+91-9876543210'; // Replace with actual auth user data

//     useEffect(() => {
//         fetchDriverData();
        
//         return () => {
//             if (watchId !== null) {
//                 navigator.geolocation.clearWatch(watchId);
//             }
//         };
//     }, []);

//     const fetchDriverData = async () => {
//         setLoading(true);
//         setError(null);
        
//         try {
//             // Fetch vehicle assigned to this driver
//             const { data: vehicleData, error: vehicleError } = await supabase
//                 .from('vehicles')
//                 .select('*')
//                 .eq('driver_phone', driverPhone)
//                 .single();

//             if (vehicleError) throw vehicleError;
            
//             if (!vehicleData) {
//                 setError('No vehicle assigned to you. Please contact admin.');
//                 setLoading(false);
//                 return;
//             }

//             setVehicle(vehicleData);
//             setIsTracking(vehicleData.is_tracking);

//             // Fetch route for this vehicle
//             const { data: routeData, error: routeError } = await supabase
//                 .from('routes')
//                 .select('*')
//                 .eq('vehicle_id', vehicleData.id)
//                 .eq('status', 'active')
//                 .single();

//             if (routeError) {
//                 console.log('No route assigned');
//             } else {
//                 setRoute(routeData);
//                 await fetchStops(routeData.id);
//                 await fetchStudents(routeData.id);
//             }
//         } catch (err: any) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchStops = async (routeId: string) => {
//         const { data, error } = await supabase
//             .from('stops')
//             .select('*')
//             .eq('route_id', routeId)
//             .order('stop_order', { ascending: true });

//         if (error) {
//             console.error('Error fetching stops:', error);
//         } else {
//             setStops(data || []);
//         }
//     };

//     const fetchStudents = async (routeId: string) => {
//         const { data, error } = await supabase
//             .from('transport_assignments')
//             .select(`
//                 id,
//                 student_id,
//                 student_name,
//                 stop_id,
//                 stops!stop_id(stop_name, pickup_time)
//             `)
//             .eq('route_id', routeId)
//             .eq('academic_year', new Date().getFullYear().toString());

//         if (error) {
//             console.error('Error fetching students:', error);
//         } else {
//             const formattedStudents = data?.map(s => ({
//                 id: s.id,
//                 student_id: s.student_id,
//                 student_name: s.student_name || 'Unknown',
//                 stop_id: s.stop_id,
//                 stop_name: (s.stops as any)?.stop_name || 'Unknown',
//                 pickup_time: (s.stops as any)?.pickup_time || '00:00',
//                 present: false
//             })) || [];
            
//             setStudents(formattedStudents);
//         }
//     };

//     const startTracking = async () => {
//         if (!navigator.geolocation) {
//             setError('Geolocation is not supported by your browser');
//             return;
//         }

//         if (!vehicle) return;

//         try {
//             // Start watching position
//             const id = navigator.geolocation.watchPosition(
//                 async (position) => {
//                     setCurrentPosition(position);
                    
//                     // Calculate speed (km/h)
//                     const speed = position.coords.speed 
//                         ? (position.coords.speed * 3.6) 
//                         : 0;

//                     // Update vehicle location in database
//                     const { error: updateError } = await supabase
//                         .from('vehicles')
//                         .update({
//                             latitude: position.coords.latitude,
//                             longitude: position.coords.longitude,
//                             current_speed: speed,
//                             heading: position.coords.heading || 0,
//                             is_tracking: true,
//                             last_location_update: new Date().toISOString()
//                         })
//                         .eq('id', vehicle.id);

//                     if (updateError) {
//                         console.error('Error updating location:', updateError);
//                     }
//                 },
//                 (error) => {
//                     console.error('Geolocation error:', error);
//                     setError('Unable to get your location. Please enable GPS.');
//                 },
//                 {
//                     enableHighAccuracy: true,
//                     timeout: 5000,
//                     maximumAge: 0
//                 }
//             );

//             setWatchId(id);
//             setIsTracking(true);
//         } catch (err: any) {
//             setError(err.message);
//         }
//     };

//     const stopTracking = async () => {
//         if (watchId !== null) {
//             navigator.geolocation.clearWatch(watchId);
//             setWatchId(null);
//         }

//         if (!vehicle) return;

//         // Update vehicle tracking status
//         const { error: updateError } = await supabase
//             .from('vehicles')
//             .update({
//                 is_tracking: false
//             })
//             .eq('id', vehicle.id);

//         if (updateError) {
//             console.error('Error stopping tracking:', updateError);
//         }

//         setIsTracking(false);
//     };

//     const toggleStudentAttendance = (studentId: string) => {
//         setStudents(students.map(s => 
//             s.id === studentId ? { ...s, present: !s.present } : s
//         ));
//     };

//     const submitAttendance = async () => {
//         // Here you would create an attendance record table and insert data
//         // For now, just show a success message
//         alert(`Attendance submitted!\nPresent: ${students.filter(s => s.present).length}/${students.length}`);
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//                     <p className="mt-4 text-gray-600">Loading dashboard...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error && !vehicle) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
//                 <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
//                     <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//                     <h2 className="text-xl font-bold text-center mb-2">Access Error</h2>
//                     <p className="text-gray-600 text-center mb-4">{error}</p>
//                     <button
//                         onClick={() => window.location.reload()}
//                         className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
//                     >
//                         Retry
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//             <div className="max-w-7xl mx-auto">
//                 {/* Header */}
//                 <div className="mb-6">
//                     <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
//                         Driver Dashboard
//                     </h1>
//                     <p className="text-gray-600">Welcome, {vehicle?.driver_name}</p>
//                 </div>

//                 {/* Error Alert */}
//                 {error && (
//                     <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
//                         <AlertCircle className="w-5 h-5" />
//                         <span>{error}</span>
//                     </div>
//                 )}

//                 {/* Vehicle Info Card */}
//                 <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//                     <div className="flex items-center justify-between mb-4">
//                         <div className="flex items-center gap-3">
//                             <Bus className="w-8 h-8 text-blue-600" />
//                             <div>
//                                 <h2 className="text-xl font-bold">{vehicle?.vehicle_number}</h2>
//                                 <p className="text-sm text-gray-600">{vehicle?.vehicle_type}</p>
//                             </div>
//                         </div>
//                         <div className="text-right">
//                             <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
//                                 isTracking 
//                                     ? 'bg-green-100 text-green-800' 
//                                     : 'bg-gray-100 text-gray-800'
//                             }`}>
//                                 <div className={`w-2 h-2 rounded-full ${
//                                     isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
//                                 }`}></div>
//                                 {isTracking ? 'Tracking Active' : 'Tracking Inactive'}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Tracking Controls */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {!isTracking ? (
//                             <button
//                                 onClick={startTracking}
//                                 className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
//                             >
//                                 <Play className="w-5 h-5" />
//                                 Start Tracking
//                             </button>
//                         ) : (
//                             <button
//                                 onClick={stopTracking}
//                                 className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
//                             >
//                                 <Square className="w-5 h-5" />
//                                 Stop Tracking
//                             </button>
//                         )}

//                         {/* Trip Type Toggle */}
//                         <div className="flex gap-2">
//                             <button
//                                 onClick={() => setTripType('morning')}
//                                 className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
//                                     tripType === 'morning'
//                                         ? 'bg-blue-600 text-white'
//                                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                                 }`}
//                             >
//                                 Morning Trip
//                             </button>
//                             <button
//                                 onClick={() => setTripType('evening')}
//                                 className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
//                                     tripType === 'evening'
//                                         ? 'bg-blue-600 text-white'
//                                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                                 }`}
//                             >
//                                 Evening Trip
//                             </button>
//                         </div>
//                     </div>

//                     {/* Current Location Info */}
//                     {currentPosition && (
//                         <div className="mt-4 p-4 bg-blue-50 rounded-lg">
//                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                                 <div>
//                                     <p className="text-gray-600">Speed</p>
//                                     <p className="font-bold text-lg">
//                                         {(currentPosition.coords.speed 
//                                             ? currentPosition.coords.speed * 3.6 
//                                             : 0
//                                         ).toFixed(1)} km/h
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <p className="text-gray-600">Latitude</p>
//                                     <p className="font-mono text-sm">
//                                         {currentPosition.coords.latitude.toFixed(6)}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <p className="text-gray-600">Longitude</p>
//                                     <p className="font-mono text-sm">
//                                         {currentPosition.coords.longitude.toFixed(6)}
//                                     </p>
//                                 </div>
//                                 <div>
//                                     <p className="text-gray-600">Accuracy</p>
//                                     <p className="font-bold">
//                                         ±{currentPosition.coords.accuracy.toFixed(0)}m
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     {/* Route Info */}
//                     <div className="bg-white rounded-lg shadow-lg p-6">
//                         <div className="flex items-center gap-2 mb-4">
//                             <RouteIcon className="w-6 h-6 text-blue-600" />
//                             <h2 className="text-xl font-bold">Route Information</h2>
//                         </div>

//                         {route ? (
//                             <div className="space-y-3">
//                                 <div>
//                                     <p className="text-sm text-gray-600">Route Code</p>
//                                     <p className="font-bold text-lg">{route.route_code}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-600">Route Name</p>
//                                     <p className="font-medium">{route.route_name}</p>
//                                 </div>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                         <p className="text-sm text-gray-600">Start Point</p>
//                                         <p className="font-medium">{route.start_point}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-600">End Point</p>
//                                         <p className="font-medium">{route.end_point}</p>
//                                     </div>
//                                 </div>
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                         <p className="text-sm text-gray-600">Morning Start</p>
//                                         <p className="font-bold text-blue-600">
//                                             {route.morning_start_time}
//                                         </p>
//                                     </div>
//                                     <div>
//                                         <p className="text-sm text-gray-600">Evening Start</p>
//                                         <p className="font-bold text-orange-600">
//                                             {route.evening_start_time}
//                                         </p>
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-600">Total Distance</p>
//                                     <p className="font-medium">{route.distance_km} km</p>
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="text-center py-8 text-gray-500">
//                                 <Info className="w-12 h-12 mx-auto mb-2 text-gray-400" />
//                                 <p>No route assigned</p>
//                             </div>
//                         )}
//                     </div>

//                     {/* Stops List */}
//                     <div className="bg-white rounded-lg shadow-lg p-6">
//                         <div className="flex items-center gap-2 mb-4">
//                             <MapPin className="w-6 h-6 text-blue-600" />
//                             <h2 className="text-xl font-bold">Route Stops</h2>
//                             <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                                 {stops.length} stops
//                             </span>
//                         </div>

//                         {stops.length > 0 ? (
//                             <div className="space-y-2 max-h-96 overflow-y-auto">
//                                 {stops.map((stop) => (
//                                     <div
//                                         key={stop.id}
//                                         className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
//                                     >
//                                         <div className="flex items-start justify-between">
//                                             <div className="flex items-start gap-3">
//                                                 <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
//                                                     {stop.stop_order}
//                                                 </div>
//                                                 <div>
//                                                     <p className="font-medium">{stop.stop_name}</p>
//                                                     <p className="text-xs text-gray-600 mt-1">
//                                                         {stop.landmark}
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                             <div className="text-right text-sm">
//                                                 <p className="text-gray-600">
//                                                     {tripType === 'morning' ? 'Pickup' : 'Drop'}
//                                                 </p>
//                                                 <p className="font-bold text-blue-600">
//                                                     {tripType === 'morning' 
//                                                         ? stop.pickup_time 
//                                                         : stop.drop_time}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <div className="text-center py-8 text-gray-500">
//                                 <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
//                                 <p>No stops configured</p>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Student Attendance */}
//                 <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
//                     <div className="flex items-center justify-between mb-4">
//                         <div className="flex items-center gap-2">
//                             <Users className="w-6 h-6 text-blue-600" />
//                             <h2 className="text-xl font-bold">Student Attendance</h2>
//                             <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                                 {students.filter(s => s.present).length}/{students.length}
//                             </span>
//                         </div>
//                         {students.length > 0 && (
//                             <button
//                                 onClick={submitAttendance}
//                                 className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
//                             >
//                                 Submit Attendance
//                             </button>
//                         )}
//                     </div>

//                     {students.length > 0 ? (
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//                             {students.map((student) => (
//                                 <div
//                                     key={student.id}
//                                     onClick={() => toggleStudentAttendance(student.id)}
//                                     className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
//                                         student.present
//                                             ? 'border-green-500 bg-green-50'
//                                             : 'border-gray-200 hover:bg-gray-50'
//                                     }`}
//                                 >
//                                     <div className="flex items-start justify-between">
//                                         <div className="flex-1">
//                                             <p className="font-medium">{student.student_name}</p>
//                                             <p className="text-sm text-gray-600 mt-1">
//                                                 {student.stop_name}
//                                             </p>
//                                             <p className="text-xs text-gray-500 mt-1">
//                                                 {student.pickup_time}
//                                             </p>
//                                         </div>
//                                         <div>
//                                             {student.present ? (
//                                                 <CheckCircle className="w-6 h-6 text-green-600" />
//                                             ) : (
//                                                 <XCircle className="w-6 h-6 text-gray-400" />
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <div className="text-center py-8 text-gray-500">
//                             <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
//                             <p>No students assigned to this route</p>
//                         </div>
//                     )}
//                 </div>

//                 {/* Emergency Contact */}
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
//                     <div className="flex items-center gap-3">
//                         <Phone className="w-6 h-6 text-red-600" />
//                         <div>
//                             <h3 className="font-bold text-red-900">Emergency Contact</h3>
//                             <p className="text-sm text-red-700">School Transport Office: +91-1234567890</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import {
    Bus,
    MapPin,
    Users,
    Clock,
    Navigation,
    Play,
    Square,
    AlertCircle,
    Phone,
    CheckCircle,
    XCircle,
    Info,
    Route as RouteIcon,
    Settings
} from 'lucide-react';

interface VehicleInfo {
    id: string;
    vehicle_number: string;
    vehicle_type: string;
    capacity: number;
    driver_name: string;
    driver_phone: string;
    is_tracking: boolean;
    current_speed: number;
    latitude: number;
    longitude: number;
}

interface RouteInfo {
    id: string;
    route_code: string;
    route_name: string;
    start_point: string;
    end_point: string;
    morning_start_time: string;
    evening_start_time: string;
    distance_km: number;
}

interface Stop {
    id: string;
    stop_name: string;
    stop_order: number;
    pickup_time: string;
    drop_time: string;
    landmark: string;
}

interface Student {
    id: string;
    student_id: string;
    student_name: string;
    stop_id: string;
    stop_name: string;
    pickup_time: string;
    present: boolean;
}

export default function DriverDashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [allVehicles, setAllVehicles] = useState<VehicleInfo[]>([]);
    const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
    const [vehicle, setVehicle] = useState<VehicleInfo | null>(null);
    const [route, setRoute] = useState<RouteInfo | null>(null);
    const [stops, setStops] = useState<Stop[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [isTracking, setIsTracking] = useState(false);
    const [currentPosition, setCurrentPosition] = useState<GeolocationPosition | null>(null);
    const [watchId, setWatchId] = useState<number | null>(null);
    const [tripType, setTripType] = useState<'morning' | 'evening'>('morning');
    const [showVehicleSelector, setShowVehicleSelector] = useState(true);

    useEffect(() => {
        fetchAllVehicles();
        
        return () => {
            if (watchId !== null) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, []);

    useEffect(() => {
        if (selectedVehicleId) {
            fetchDriverData(selectedVehicleId);
        }
    }, [selectedVehicleId]);

    const fetchAllVehicles = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('vehicles')
                .select('*')
                .eq('status', 'active')
                .order('vehicle_number', { ascending: true });

            if (error) throw error;
            
            setAllVehicles(data || []);
            
            // Auto-select first vehicle if available
            if (data && data.length > 0 && !selectedVehicleId) {
                setSelectedVehicleId(data[0].id);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchDriverData = async (vehicleId: string) => {
        setLoading(true);
        setError(null);
        
        try {
            // Fetch selected vehicle
            const { data: vehicleData, error: vehicleError } = await supabase
                .from('vehicles')
                .select('*')
                .eq('id', vehicleId)
                .single();

            if (vehicleError) throw vehicleError;

            setVehicle(vehicleData);
            setIsTracking(vehicleData.is_tracking);
            setShowVehicleSelector(false);

            // Fetch route for this vehicle
            const { data: routeData, error: routeError } = await supabase
                .from('routes')
                .select('*')
                .eq('vehicle_id', vehicleData.id)
                .eq('status', 'active')
                .single();

            if (routeError) {
                console.log('No route assigned');
                setRoute(null);
                setStops([]);
                setStudents([]);
            } else {
                setRoute(routeData);
                await fetchStops(routeData.id);
                await fetchStudents(routeData.id);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchStops = async (routeId: string) => {
        const { data, error } = await supabase
            .from('stops')
            .select('*')
            .eq('route_id', routeId)
            .order('stop_order', { ascending: true });

        if (error) {
            console.error('Error fetching stops:', error);
        } else {
            setStops(data || []);
        }
    };

    const fetchStudents = async (routeId: string) => {
        const { data, error } = await supabase
            .from('transport_assignments')
            .select(`
                id,
                student_id,
                student_name,
                stop_id,
                stops!stop_id(stop_name, pickup_time)
            `)
            .eq('route_id', routeId)
            .eq('academic_year', new Date().getFullYear().toString());

        if (error) {
            console.error('Error fetching students:', error);
        } else {
            const formattedStudents = data?.map(s => ({
                id: s.id,
                student_id: s.student_id,
                student_name: s.student_name || 'Unknown',
                stop_id: s.stop_id,
                stop_name: (s.stops as any)?.stop_name || 'Unknown',
                pickup_time: (s.stops as any)?.pickup_time || '00:00',
                present: false
            })) || [];
            
            setStudents(formattedStudents);
        }
    };

    const startTracking = async () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        if (!vehicle) return;

        try {
            const id = navigator.geolocation.watchPosition(
                async (position) => {
                    setCurrentPosition(position);
                    
                    const speed = position.coords.speed 
                        ? (position.coords.speed * 3.6) 
                        : 0;

                    const { error: updateError } = await supabase
                        .from('vehicles')
                        .update({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            current_speed: speed,
                            heading: position.coords.heading || 0,
                            is_tracking: true,
                            last_location_update: new Date().toISOString()
                        })
                        .eq('id', vehicle.id);

                    if (updateError) {
                        console.error('Error updating location:', updateError);
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setError('Unable to get your location. Please enable GPS.');
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );

            setWatchId(id);
            setIsTracking(true);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const stopTracking = async () => {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(null);
        }

        if (!vehicle) return;

        const { error: updateError } = await supabase
            .from('vehicles')
            .update({
                is_tracking: false
            })
            .eq('id', vehicle.id);

        if (updateError) {
            console.error('Error stopping tracking:', updateError);
        }

        setIsTracking(false);
    };

    const toggleStudentAttendance = (studentId: string) => {
        setStudents(students.map(s => 
            s.id === studentId ? { ...s, present: !s.present } : s
        ));
    };

    const submitAttendance = async () => {
        alert(`Attendance submitted!\nPresent: ${students.filter(s => s.present).length}/${students.length}`);
    };

    const changeVehicle = () => {
        setShowVehicleSelector(true);
        setVehicle(null);
        setRoute(null);
        setStops([]);
        setStudents([]);
        if (isTracking) {
            stopTracking();
        }
    };

    // Vehicle Selection Screen
    if (showVehicleSelector || !vehicle) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Driver Dashboard</h1>
                        <p className="text-gray-600">Select a vehicle to continue</p>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading vehicles...</p>
                        </div>
                    ) : allVehicles.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                            <Bus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h2 className="text-xl font-bold mb-2">No Vehicles Available</h2>
                            <p className="text-gray-600 mb-6">
                                Please add vehicles in the admin panel first.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {allVehicles.map((v) => (
                                <div
                                    key={v.id}
                                    onClick={() => setSelectedVehicleId(v.id)}
                                    className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer transition-all hover:shadow-xl border-2 ${
                                        selectedVehicleId === v.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-transparent'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-100 rounded-lg p-3">
                                            <Bus className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold mb-1">{v.vehicle_number}</h3>
                                            <p className="text-sm text-gray-600 mb-2">{v.vehicle_type}</p>
                                            <div className="space-y-1 text-sm">
                                                <p><span className="text-gray-600">Driver:</span> {v.driver_name}</p>
                                                <p><span className="text-gray-600">Capacity:</span> {v.capacity} seats</p>
                                                <p><span className="text-gray-600">Phone:</span> {v.driver_phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {selectedVehicleId === v.id && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                fetchDriverData(v.id);
                                            }}
                                            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Start Dashboard
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Main Dashboard (existing code with small modifications)
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header with Vehicle Switcher */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Driver Dashboard
                        </h1>
                        <p className="text-gray-600">Welcome, {vehicle?.driver_name}</p>
                    </div>
                    <button
                        onClick={changeVehicle}
                        className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        <Settings className="w-5 h-5" />
                        Change Vehicle
                    </button>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Vehicle Info Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Bus className="w-8 h-8 text-blue-600" />
                            <div>
                                <h2 className="text-xl font-bold">{vehicle?.vehicle_number}</h2>
                                <p className="text-sm text-gray-600">{vehicle?.vehicle_type}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                                isTracking 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                <div className={`w-2 h-2 rounded-full ${
                                    isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                                }`}></div>
                                {isTracking ? 'Tracking Active' : 'Tracking Inactive'}
                            </div>
                        </div>
                    </div>

                    {/* Tracking Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {!isTracking ? (
                            <button
                                onClick={startTracking}
                                className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Play className="w-5 h-5" />
                                Start Tracking
                            </button>
                        ) : (
                            <button
                                onClick={stopTracking}
                                className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <Square className="w-5 h-5" />
                                Stop Tracking
                            </button>
                        )}

                        {/* Trip Type Toggle */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setTripType('morning')}
                                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                                    tripType === 'morning'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Morning Trip
                            </button>
                            <button
                                onClick={() => setTripType('evening')}
                                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                                    tripType === 'evening'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Evening Trip
                            </button>
                        </div>
                    </div>

                    {/* Current Location Info */}
                    {currentPosition && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-600">Speed</p>
                                    <p className="font-bold text-lg">
                                        {(currentPosition.coords.speed 
                                            ? currentPosition.coords.speed * 3.6 
                                            : 0
                                        ).toFixed(1)} km/h
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Latitude</p>
                                    <p className="font-mono text-sm">
                                        {currentPosition.coords.latitude.toFixed(6)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Longitude</p>
                                    <p className="font-mono text-sm">
                                        {currentPosition.coords.longitude.toFixed(6)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Accuracy</p>
                                    <p className="font-bold">
                                        ±{currentPosition.coords.accuracy.toFixed(0)}m
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Route Info */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <RouteIcon className="w-6 h-6 text-blue-600" />
                            <h2 className="text-xl font-bold">Route Information</h2>
                        </div>

                        {route ? (
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-600">Route Code</p>
                                    <p className="font-bold text-lg">{route.route_code}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Route Name</p>
                                    <p className="font-medium">{route.route_name}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Start Point</p>
                                        <p className="font-medium">{route.start_point}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">End Point</p>
                                        <p className="font-medium">{route.end_point}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Morning Start</p>
                                        <p className="font-bold text-blue-600">
                                            {route.morning_start_time}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Evening Start</p>
                                        <p className="font-bold text-orange-600">
                                            {route.evening_start_time}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Distance</p>
                                    <p className="font-medium">{route.distance_km} km</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Info className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                <p>No route assigned to this vehicle</p>
                            </div>
                        )}
                    </div>

                    {/* Stops List */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="w-6 h-6 text-blue-600" />
                            <h2 className="text-xl font-bold">Route Stops</h2>
                            <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {stops.length} stops
                            </span>
                        </div>

                        {stops.length > 0 ? (
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {stops.map((stop) => (
                                    <div
                                        key={stop.id}
                                        className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3">
                                                <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                                                    {stop.stop_order}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{stop.stop_name}</p>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        {stop.landmark}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right text-sm">
                                                <p className="text-gray-600">
                                                    {tripType === 'morning' ? 'Pickup' : 'Drop'}
                                                </p>
                                                <p className="font-bold text-blue-600">
                                                    {tripType === 'morning' 
                                                        ? stop.pickup_time 
                                                        : stop.drop_time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                <p>No stops configured for this route</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Student Attendance */}
                <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Users className="w-6 h-6 text-blue-600" />
                            <h2 className="text-xl font-bold">Student Attendance</h2>
                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {students.filter(s => s.present).length}/{students.length}
                            </span>
                        </div>
                        {students.length > 0 && (
                            <button
                                onClick={submitAttendance}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Submit Attendance
                            </button>
                        )}
                    </div>

                    {students.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {students.map((student) => (
                                <div
                                    key={student.id}
                                    onClick={() => toggleStudentAttendance(student.id)}
                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                        student.present
                                            ? 'border-green-500 bg-green-50'
                                            : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-medium">{student.student_name}</p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {student.stop_name}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {student.pickup_time}
                                            </p>
                                        </div>
                                        <div>
                                            {student.present ? (
                                                <CheckCircle className="w-6 h-6 text-green-600" />
                                            ) : (
                                                <XCircle className="w-6 h-6 text-gray-400" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                            <p>No students assigned to this route</p>
                        </div>
                    )}
                </div>

                {/* Emergency Contact */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
                    <div className="flex items-center gap-3">
                        <Phone className="w-6 h-6 text-red-600" />
                        <div>
                            <h3 className="font-bold text-red-900">Emergency Contact</h3>
                            <p className="text-sm text-red-700">School Transport Office: +91-1234567890</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
