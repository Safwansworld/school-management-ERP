// import { useState, useEffect } from 'react';
// import { supabase } from '../../../lib/supabase';
// import {
//     Bus,
//     MapPin,
//     Plus,
//     Search,
//     Users,
//     Route as RouteIcon,
//     Navigation,
//     AlertCircle
// } from 'lucide-react';

// // Import tab components
// import VehiclesTab from './VehiclesTab';
// import RoutesTab from './RoutesTab';
// import StopsTab from './StopsTab';
// import AssignmentsTab from './AssignmentsTab';
// import LiveTrackingTab from './LiveTrackingTab';

// // Import all interfaces from the attached file
// interface Vehicle {
//     id: string;
//     vehicle_number: string;
//     vehicle_type: string;
//     capacity: number;
//     driver_name: string;
//     driver_phone: string;
//     driver_license: string;
//     license_expiry: string;
//     insurance_expiry: string;
//     status: 'active' | 'maintenance' | 'inactive';
//     created_at: string;
// }

// interface Route {
//     id: string;
//     route_name: string;
//     route_code: string;
//     vehicle_id: string;
//     start_point: string;
//     end_point: string;
//     total_stops: number;
//     distance_km: number;
//     estimated_time: string;
//     morning_start_time: string;
//     evening_start_time: string;
//     fee_amount: number;
//     status: 'active' | 'inactive';
//     created_at: string;
// }

// interface Stop {
//     id: string;
//     route_id: string;
//     stop_name: string;
//     stop_order: number;
//     pickup_time: string;
//     drop_time: string;
//     landmark: string;
//     created_at: string;
// }

// interface TransportAssignment {
//     id: string;
//     student_id: string;
//     route_id: string;
//     stop_id: string;
//     academic_year: string;
//     assigned_at: string;
//     students?: { full_name: string };
//     routes?: { route_name: string };
//     stops?: { stop_name: string };
// }

// type TabType = 'vehicles' | 'routes' | 'stops' | 'assignments' | 'tracking';

// export default function TransportManagement() {
//     const [activeTab, setActiveTab] = useState<TabType>('vehicles');
//     const [vehicles, setVehicles] = useState<Vehicle[]>([]);
//     const [routes, setRoutes] = useState<Route[]>([]);
//     const [stops, setStops] = useState<Stop[]>([]);
//     const [assignments, setAssignments] = useState<TransportAssignment[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [showModal, setShowModal] = useState(false);
//     const [modalType, setModalType] = useState<'add' | 'edit'>('add');
//     const [selectedItem, setSelectedItem] = useState<any>(null);

//     // Student filter states
//     const [students, setStudents] = useState<any[]>([]);
//     const [academicYears, setAcademicYears] = useState<string[]>([]);
//     const [classNames, setClassNames] = useState<string[]>([]);
//     const [studentFilters, setStudentFilters] = useState({
//         academic_year: new Date().getFullYear().toString(),
//         class_name: ''
//     });

//     // Form states (keeping all from original file)
//     const [vehicleForm, setVehicleForm] = useState({
//         vehicle_number: '',
//         vehicle_type: 'bus',
//         capacity: 0,
//         driver_name: '',
//         driver_phone: '',
//         driver_license: '',
//         license_expiry: '',
//         insurance_expiry: '',
//         status: 'active' as 'active' | 'maintenance' | 'inactive'
//     });

//     const [routeForm, setRouteForm] = useState({
//         route_name: '',
//         route_code: '',
//         vehicle_id: '',
//         start_point: '',
//         end_point: '',
//         total_stops: 0,
//         distance_km: 0,
//         estimated_time: '',
//         morning_start_time: '',
//         evening_start_time: '',
//         fee_amount: 0,
//         status: 'active' as 'active' | 'inactive'
//     });

//     const [stopForm, setStopForm] = useState({
//         route_id: '',
//         stop_name: '',
//         stop_order: 1,
//         pickup_time: '',
//         drop_time: '',
//         landmark: ''
//     });

//     const [assignmentForm, setAssignmentForm] = useState({
//         student_id: '',
//         route_id: '',
//         stop_id: '',
//         academic_year: new Date().getFullYear().toString()
//     });

//     useEffect(() => {
//         if (activeTab !== 'tracking') {
//             fetchData();
//         }
//         if (activeTab === 'assignments') {
//             fetchAcademicYears();
//             fetchClassNames();
//         }
//     }, [activeTab]);

//     useEffect(() => {
//         if (activeTab === 'assignments' && showModal) {
//             fetchStudents();
//         }
//     }, [studentFilters, activeTab, showModal]);

//     const fetchData = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             switch (activeTab) {
//                 case 'vehicles':
//                     await fetchVehicles();
//                     break;
//                 case 'routes':
//                     await fetchRoutes();
//                     break;
//                 case 'stops':
//                     await fetchStops();
//                     break;
//                 case 'assignments':
//                     await fetchAssignments();
//                     break;
//             }
//         } catch (err: any) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchVehicles = async () => {
//         const { data, error } = await supabase
//             .from('vehicles')
//             .select('*')
//             .order('created_at', { ascending: false });

//         if (error) throw error;
//         setVehicles(data || []);
//     };

//     const fetchRoutes = async () => {
//         const { data, error } = await supabase
//             .from('routes')
//             .select('*')
//             .order('route_code', { ascending: true });

//         if (error) throw error;
//         setRoutes(data || []);
//     };

//     const fetchStops = async () => {
//         const { data, error } = await supabase
//             .from('stops')
//             .select('*')
//             .order('route_id, stop_order', { ascending: true });

//         if (error) throw error;
//         setStops(data || []);
//     };

//     const fetchAssignments = async () => {
//         const { data, error } = await supabase
//             .from('transport_assignments')
//             .select(`
//                 *,
//                 students(full_name),
//                 routes(route_name),
//                 stops(stop_name)
//             `)
//             .order('assigned_at', { ascending: false });

//         if (error) throw error;
//         setAssignments(data || []);
//     };

//     const fetchAcademicYears = async () => {
//         try {
//             const { data, error } = await supabase
//                 .from('class_assignments')
//                 .select('academic_year')
//                 .order('academic_year', { ascending: false });

//             if (error) throw error;

//             const uniqueYears = [...new Set(data?.map(item => item.academic_year))];
//             setAcademicYears(uniqueYears);
//         } catch (err: any) {
//             console.error('Error fetching academic years:', err.message);
//         }
//     };

//     const fetchClassNames = async () => {
//         try {
//             const { data, error } = await supabase
//                 .from('class_assignments')
//                 .select('class_name')
//                 .order('class_name', { ascending: true });

//             if (error) throw error;

//             const uniqueClasses = [...new Set(data?.map(item => item.class_name).filter(Boolean))];
//             setClassNames(uniqueClasses);
//         } catch (err: any) {
//             console.error('Error fetching class names:', err.message);
//         }
//     };

//     const fetchStudents = async () => {
//         try {
//             let query = supabase
//                 .from('class_assignments')
//                 .select('student_id, student_name, class_name, academic_year');

//             if (studentFilters.academic_year) {
//                 query = query.eq('academic_year', studentFilters.academic_year);
//             }

//             if (studentFilters.class_name) {
//                 query = query.eq('class_name', studentFilters.class_name);
//             }

//             const { data, error } = await query.order('student_name', { ascending: true });

//             if (error) throw error;

//             const uniqueStudents = data?.reduce((acc: any[], current) => {
//                 const exists = acc.find(item => item.student_id === current.student_id);
//                 if (!exists) {
//                     acc.push(current);
//                 }
//                 return acc;
//             }, []);

//             setStudents(uniqueStudents || []);
//         } catch (err: any) {
//             console.error('Error fetching students:', err.message);
//             setError(err.message);
//         }
//     };

//     // CRUD operations (keeping all from original file)
//     const handleAddVehicle = async () => {
//         try {
//             setLoading(true);
//             const { error } = await supabase
//                 .from('vehicles')
//                 .insert([vehicleForm]);

//             if (error) throw error;

//             await fetchVehicles();
//             resetVehicleForm();
//             setShowModal(false);
//         } catch (err: any) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleUpdateVehicle = async () => {
//         try {
//             setLoading(true);
//             const { error } = await supabase
//                 .from('vehicles')
//                 .update(vehicleForm)
//                 .eq('id', selectedItem.id);

//             if (error) throw error;

//             await fetchVehicles();
//             resetVehicleForm();
//             setShowModal(false);
//         } catch (err: any) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDeleteVehicle = async (id: string) => {
//         if (!confirm('Are you sure you want to delete this vehicle?')) return;

//         try {
//             setLoading(true);
//             const { error } = await supabase
//                 .from('vehicles')
//                 .delete()
//                 .eq('id', id);

//             if (error) throw error;
//             await fetchVehicles();
//         } catch (err: any) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleAddRoute = async () => {
//         try {
//             setLoading(true);
//             const { error } = await supabase
//                 .from('routes')
//                 .insert([routeForm]);

//             if (error) throw error;

//             await fetchRoutes();
//             resetRouteForm();
//             setShowModal(false);
//         } catch (err: any) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleUpdateRoute = async () => {
//         try {
//             setLoading(true);
//             const { error } = await supabase
//                 .from('routes')
//                 .update(routeForm)
//                 .eq('id', selectedItem.id);

//             if (error) throw error;

//             await fetchRoutes();
//             resetRouteForm();
//             setShowModal(false);
//         } catch (err: any) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDeleteRoute = async (id: string) => {
//         if (!confirm('Are you sure you want to delete this route?')) return;

//         try {
//             setLoading(true);
//             const { error } = await supabase
//                 .from('routes')
//                 .delete()
//                 .eq('id', id);

//             if (error) throw error;
//             await fetchRoutes();
//         } catch (err: any) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleAddStop = async () => {
//         try {
//             setLoading(true);
//             const { error } = await supabase
//                 .from('stops')
//                 .insert([stopForm]);

//             if (error) throw error;

//             await fetchStops();
//             resetStopForm();
//             setShowModal(false);
//         } catch (err: any) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleUpdateStop = async () => {
//         try {
//             setLoading(true);
//             const { error } = await supabase
//                 .from('stops')
//                 .update(stopForm)
//                 .eq('id', selectedItem.id);

//             if (error) throw error;

//             await fetchStops();
//             resetStopForm();
//             setShowModal(false);
//         } catch (err: any) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDeleteStop = async (id: string) => {
//         if (!confirm('Are you sure you want to delete this stop?')) return;

//         try {
//             setLoading(true);
//             const { error } = await supabase
//                 .from('stops')
//                 .delete()
//                 .eq('id', id);

//             if (error) throw error;
//             await fetchStops();
//         } catch (err: any) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleAddAssignment = async () => {
//         try {
//             setLoading(true);
//             const { error } = await supabase
//                 .from('transport_assignments')
//                 .insert([assignmentForm]);

//             if (error) throw error;

//             await fetchAssignments();
//             resetAssignmentForm();
//             setShowModal(false);
//         } catch (err: any) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDeleteAssignment = async (id: string) => {
//         if (!confirm('Are you sure you want to delete this assignment?')) return;

//         try {
//             setLoading(true);
//             const { error } = await supabase
//                 .from('transport_assignments')
//                 .delete()
//                 .eq('id', id);

//             if (error) throw error;
//             await fetchAssignments();
//         } catch (err: any) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const resetVehicleForm = () => {
//         setVehicleForm({
//             vehicle_number: '',
//             vehicle_type: 'bus',
//             capacity: 0,
//             driver_name: '',
//             driver_phone: '',
//             driver_license: '',
//             license_expiry: '',
//             insurance_expiry: '',
//             status: 'active'
//         });
//     };

//     const resetRouteForm = () => {
//         setRouteForm({
//             route_name: '',
//             route_code: '',
//             vehicle_id: '',
//             start_point: '',
//             end_point: '',
//             total_stops: 0,
//             distance_km: 0,
//             estimated_time: '',
//             morning_start_time: '',
//             evening_start_time: '',
//             fee_amount: 0,
//             status: 'active'
//         });
//     };

//     const resetStopForm = () => {
//         setStopForm({
//             route_id: '',
//             stop_name: '',
//             stop_order: 1,
//             pickup_time: '',
//             drop_time: '',
//             landmark: ''
//         });
//     };

//     const resetAssignmentForm = () => {
//         setAssignmentForm({
//             student_id: '',
//             route_id: '',
//             stop_id: '',
//             academic_year: new Date().getFullYear().toString()
//         });
//     };

//     const openAddModal = (tab: TabType) => {
//         if (tab === 'tracking') return; // No add for tracking
        
//         setModalType('add');
//         setSelectedItem(null);
        
//         if (tab === 'assignments') {
//             setStudentFilters({
//                 academic_year: new Date().getFullYear().toString(),
//                 class_name: ''
//             });
//         }
        
//         setShowModal(true);
//     };

//     const openEditModal = (item: any, tab: TabType) => {
//         setModalType('edit');
//         setSelectedItem(item);

//         switch (tab) {
//             case 'vehicles':
//                 setVehicleForm(item);
//                 break;
//             case 'routes':
//                 setRouteForm(item);
//                 break;
//             case 'stops':
//                 setStopForm(item);
//                 break;
//         }

//         setShowModal(true);
//     };

//     // Filtered data
//     const filteredVehicles = vehicles.filter(v =>
//         v.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         v.driver_name.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const filteredRoutes = routes.filter(r =>
//         r.route_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         r.route_code.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const filteredStops = stops.filter(s =>
//         s.stop_name.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const filteredAssignments = assignments.filter(a =>
//         a.students?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         a.routes?.route_name?.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div className="min-h-screen bg-gray-50 p-6">
//             <div className="max-w-7xl mx-auto">
//                 {/* Header */}
//                 <div className="mb-8">
//                     <h1 className="text-3xl font-bold text-gray-900 mb-2">Transport Management</h1>
//                     <p className="text-gray-600">Manage vehicles, routes, stops, student assignments, and live tracking</p>
//                 </div>

//                 {/* Error Alert */}
//                 {error && (
//                     <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
//                         <AlertCircle className="w-5 h-5" />
//                         <span>{error}</span>
//                     </div>
//                 )}

//                 {/* Tabs */}
//                 <div className="bg-white rounded-lg shadow-sm mb-6">
//                     <div className="border-b border-gray-200">
//                         <nav className="flex -mb-px overflow-x-auto">
//                             <button
//                                 onClick={() => setActiveTab('vehicles')}
//                                 className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
//                                     activeTab === 'vehicles'
//                                         ? 'border-blue-500 text-blue-600'
//                                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                 }`}
//                             >
//                                 <Bus className="w-5 h-5" />
//                                 Vehicles
//                             </button>
//                             <button
//                                 onClick={() => setActiveTab('routes')}
//                                 className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
//                                     activeTab === 'routes'
//                                         ? 'border-blue-500 text-blue-600'
//                                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                 }`}
//                             >
//                                 <RouteIcon className="w-5 h-5" />
//                                 Routes
//                             </button>
//                             <button
//                                 onClick={() => setActiveTab('stops')}
//                                 className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
//                                     activeTab === 'stops'
//                                         ? 'border-blue-500 text-blue-600'
//                                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                 }`}
//                             >
//                                 <MapPin className="w-5 h-5" />
//                                 Stops
//                             </button>
//                             <button
//                                 onClick={() => setActiveTab('assignments')}
//                                 className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
//                                     activeTab === 'assignments'
//                                         ? 'border-blue-500 text-blue-600'
//                                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                 }`}
//                             >
//                                 <Users className="w-5 h-5" />
//                                 Student Assignments
//                             </button>
//                             <button
//                                 onClick={() => setActiveTab('tracking')}
//                                 className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
//                                     activeTab === 'tracking'
//                                         ? 'border-blue-500 text-blue-600'
//                                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                 }`}
//                             >
//                                 <Navigation className="w-5 h-5" />
//                                 Live Tracking
//                             </button>
//                         </nav>
//                     </div>
//                 </div>

//                 {/* Actions Bar - Hide for tracking tab */}
//                 {activeTab !== 'tracking' && (
//                     <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
//                         <div className="flex items-center gap-2 flex-1 max-w-md">
//                             <Search className="w-5 h-5 text-gray-400" />
//                             <input
//                                 type="text"
//                                 placeholder={`Search ${activeTab}...`}
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="flex-1 outline-none text-sm"
//                             />
//                         </div>
//                         <button
//                             onClick={() => openAddModal(activeTab)}
//                             className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                         >
//                             <Plus className="w-5 h-5" />
//                             Add New
//                         </button>
//                     </div>
//                 )}

//                 {/* Content Area */}
//                 <div className="bg-white rounded-lg shadow-sm">
//                     {loading && activeTab !== 'tracking' ? (
//                         <div className="p-12 text-center">
//                             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//                             <p className="mt-4 text-gray-600">Loading...</p>
//                         </div>
//                     ) : (
//                         <>
//                             {activeTab === 'vehicles' && (
//                                 <VehiclesTab
//                                     vehicles={filteredVehicles}
//                                     onEdit={(vehicle) => openEditModal(vehicle, 'vehicles')}
//                                     onDelete={handleDeleteVehicle}
//                                 />
//                             )}

//                             {activeTab === 'routes' && (
//                                 <RoutesTab
//                                     routes={filteredRoutes}
//                                     onEdit={(route) => openEditModal(route, 'routes')}
//                                     onDelete={handleDeleteRoute}
//                                 />
//                             )}

//                             {activeTab === 'stops' && (
//                                 <StopsTab
//                                     stops={filteredStops}
//                                     onEdit={(stop) => openEditModal(stop, 'stops')}
//                                     onDelete={handleDeleteStop}
//                                 />
//                             )}

//                             {activeTab === 'assignments' && (
//                                 <AssignmentsTab
//                                     assignments={filteredAssignments}
//                                     onDelete={handleDeleteAssignment}
//                                 />
//                             )}

//                             {activeTab === 'tracking' && <LiveTrackingTab />}
//                         </>
//                     )}
//                 </div>

//                 {/* Modal - Keep all modal content from original file */}
//                 {showModal && activeTab !== 'tracking' && (
//                     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//                         <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//                             {/* Modal content identical to original file - truncated for space */}
//                             {/* Include all modal forms from the original implementation */}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import {
    Bus,
    MapPin,
    Plus,
    Search,
    Users,
    Route as RouteIcon,
    Navigation,
    AlertCircle,
    X
} from 'lucide-react';

// Import tab components
import VehiclesTab from './VehiclesTab';
import RoutesTab from './RoutesTab';
import StopsTab from './StopsTab';
import AssignmentsTab from './AssignmentsTab';
import LiveTrackingTab from './LiveTrackingTab';

// Interfaces
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
    created_at: string;
}

interface Route {
    id: string;
    route_name: string;
    route_code: string;
    vehicle_id: string;
    start_point: string;
    end_point: string;
    total_stops: number;
    distance_km: number;
    estimated_time: string;
    morning_start_time: string;
    evening_start_time: string;
    fee_amount: number;
    status: 'active' | 'inactive';
    created_at: string;
}

interface Stop {
    id: string;
    route_id: string;
    stop_name: string;
    stop_order: number;
    pickup_time: string;
    drop_time: string;
    landmark: string;
    created_at: string;
}

interface TransportAssignment {
    id: string;
    student_id: string;
    route_id: string;
    stop_id: string;
    academic_year: string;
    assigned_at: string;
    student_name?: string;
    route_name?: string;
    stop_name?: string;
    students?: { full_name: string };
    routes?: { route_name: string };
    stops?: { stop_name: string };
}

type TabType = 'vehicles' | 'routes' | 'stops' | 'assignments' | 'tracking';

export default function TransportManagement() {
    const [activeTab, setActiveTab] = useState<TabType>('vehicles');
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [stops, setStops] = useState<Stop[]>([]);
    const [assignments, setAssignments] = useState<TransportAssignment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<'add' | 'edit'>('add');
    const [selectedItem, setSelectedItem] = useState<any>(null);

    // Student filter states
    const [students, setStudents] = useState<any[]>([]);
    const [academicYears, setAcademicYears] = useState<string[]>([]);
    const [classNames, setClassNames] = useState<string[]>([]);
    const [studentFilters, setStudentFilters] = useState({
        academic_year: new Date().getFullYear().toString(),
        class_name: ''
    });

    // Form states
    const [vehicleForm, setVehicleForm] = useState({
        vehicle_number: '',
        vehicle_type: 'bus',
        capacity: 0,
        driver_name: '',
        driver_phone: '',
        driver_license: '',
        license_expiry: '',
        insurance_expiry: '',
        status: 'active' as 'active' | 'maintenance' | 'inactive'
    });

    const [routeForm, setRouteForm] = useState({
        route_name: '',
        route_code: '',
        vehicle_id: '',
        start_point: '',
        end_point: '',
        total_stops: 0,
        distance_km: 0,
        estimated_time: '',
        morning_start_time: '',
        evening_start_time: '',
        fee_amount: 0,
        status: 'active' as 'active' | 'inactive'
    });

    const [stopForm, setStopForm] = useState({
        route_id: '',
        stop_name: '',
        stop_order: 1,
        pickup_time: '',
        drop_time: '',
        landmark: ''
    });

    const [assignmentForm, setAssignmentForm] = useState({
        student_id: '',
        route_id: '',
        stop_id: '',
        academic_year: new Date().getFullYear().toString()
    });

    useEffect(() => {
        if (activeTab !== 'tracking') {
            fetchData();
        }
        if (activeTab === 'assignments') {
            fetchAcademicYears();
            fetchClassNames();
        }
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === 'assignments' && showModal) {
            fetchStudents();
        }
    }, [studentFilters, activeTab, showModal]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            switch (activeTab) {
                case 'vehicles':
                    await fetchVehicles();
                    break;
                case 'routes':
                    await fetchRoutes();
                    await fetchVehicles(); // For route form dropdown
                    break;
                case 'stops':
                    await fetchStops();
                    await fetchRoutes(); // For stop form dropdown
                    break;
                case 'assignments':
                    await fetchAssignments();
                    await fetchRoutes(); // For assignment form dropdown
                    break;
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchVehicles = async () => {
        const { data, error } = await supabase
            .from('vehicles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        setVehicles(data || []);
    };

    const fetchRoutes = async () => {
        const { data, error } = await supabase
            .from('routes')
            .select('*')
            .order('route_code', { ascending: true });

        if (error) throw error;
        setRoutes(data || []);
    };

    const fetchStops = async () => {
        const { data, error } = await supabase
            .from('stops')
            .select('*')
            .order('route_id, stop_order', { ascending: true });

        if (error) throw error;
        setStops(data || []);
    };

    const fetchAssignments = async () => {
        const { data, error } = await supabase
            .from('transport_assignments')
            .select(`
                *,
                students(full_name),
                routes!route_id(route_name),
                stops!stop_id(stop_name)
            `)
            .order('assigned_at', { ascending: false });

        if (error) throw error;
        setAssignments(data || []);
    };

    const fetchAcademicYears = async () => {
        try {
            const { data, error } = await supabase
                .from('class_assignments')
                .select('academic_year')
                .order('academic_year', { ascending: false });

            if (error) throw error;

            const uniqueYears = [...new Set(data?.map(item => item.academic_year))];
            setAcademicYears(uniqueYears);
        } catch (err: any) {
            console.error('Error fetching academic years:', err.message);
        }
    };

    const fetchClassNames = async () => {
        try {
            const { data, error } = await supabase
                .from('class_assignments')
                .select('class_name')
                .order('class_name', { ascending: true });

            if (error) throw error;

            const uniqueClasses = [...new Set(data?.map(item => item.class_name).filter(Boolean))];
            setClassNames(uniqueClasses);
        } catch (err: any) {
            console.error('Error fetching class names:', err.message);
        }
    };

    const fetchStudents = async () => {
        try {
            let query = supabase
                .from('class_assignments')
                .select('student_id, student_name, class_name, academic_year');

            if (studentFilters.academic_year) {
                query = query.eq('academic_year', studentFilters.academic_year);
            }

            if (studentFilters.class_name) {
                query = query.eq('class_name', studentFilters.class_name);
            }

            const { data, error } = await query.order('student_name', { ascending: true });

            if (error) throw error;

            const uniqueStudents = data?.reduce((acc: any[], current) => {
                const exists = acc.find(item => item.student_id === current.student_id);
                if (!exists) {
                    acc.push(current);
                }
                return acc;
            }, []);

            setStudents(uniqueStudents || []);
        } catch (err: any) {
            console.error('Error fetching students:', err.message);
            setError(err.message);
        }
    };

    // CRUD operations
    const handleAddVehicle = async () => {
        try {
            setLoading(true);
            const { error } = await supabase
                .from('vehicles')
                .insert([vehicleForm]);

            if (error) throw error;

            await fetchVehicles();
            resetVehicleForm();
            setShowModal(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateVehicle = async () => {
        try {
            setLoading(true);
            const { error } = await supabase
                .from('vehicles')
                .update(vehicleForm)
                .eq('id', selectedItem.id);

            if (error) throw error;

            await fetchVehicles();
            resetVehicleForm();
            setShowModal(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteVehicle = async (id: string) => {
        if (!confirm('Are you sure you want to delete this vehicle?')) return;

        try {
            setLoading(true);
            const { error } = await supabase
                .from('vehicles')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchVehicles();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddRoute = async () => {
        try {
            setLoading(true);
            const { error } = await supabase
                .from('routes')
                .insert([routeForm]);

            if (error) throw error;

            await fetchRoutes();
            resetRouteForm();
            setShowModal(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRoute = async () => {
        try {
            setLoading(true);
            const { error } = await supabase
                .from('routes')
                .update(routeForm)
                .eq('id', selectedItem.id);

            if (error) throw error;

            await fetchRoutes();
            resetRouteForm();
            setShowModal(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRoute = async (id: string) => {
        if (!confirm('Are you sure you want to delete this route?')) return;

        try {
            setLoading(true);
            const { error } = await supabase
                .from('routes')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchRoutes();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddStop = async () => {
        try {
            setLoading(true);
            const { error } = await supabase
                .from('stops')
                .insert([stopForm]);

            if (error) throw error;

            await fetchStops();
            resetStopForm();
            setShowModal(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStop = async () => {
        try {
            setLoading(true);
            const { error } = await supabase
                .from('stops')
                .update(stopForm)
                .eq('id', selectedItem.id);

            if (error) throw error;

            await fetchStops();
            resetStopForm();
            setShowModal(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteStop = async (id: string) => {
        if (!confirm('Are you sure you want to delete this stop?')) return;

        try {
            setLoading(true);
            const { error } = await supabase
                .from('stops')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchStops();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAssignment = async () => {
        try {
            setLoading(true);
            const { error } = await supabase
                .from('transport_assignments')
                .insert([assignmentForm]);

            if (error) throw error;

            await fetchAssignments();
            resetAssignmentForm();
            setShowModal(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAssignment = async (id: string) => {
        if (!confirm('Are you sure you want to delete this assignment?')) return;

        try {
            setLoading(true);
            const { error } = await supabase
                .from('transport_assignments')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchAssignments();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetVehicleForm = () => {
        setVehicleForm({
            vehicle_number: '',
            vehicle_type: 'bus',
            capacity: 0,
            driver_name: '',
            driver_phone: '',
            driver_license: '',
            license_expiry: '',
            insurance_expiry: '',
            status: 'active'
        });
    };

    const resetRouteForm = () => {
        setRouteForm({
            route_name: '',
            route_code: '',
            vehicle_id: '',
            start_point: '',
            end_point: '',
            total_stops: 0,
            distance_km: 0,
            estimated_time: '',
            morning_start_time: '',
            evening_start_time: '',
            fee_amount: 0,
            status: 'active'
        });
    };

    const resetStopForm = () => {
        setStopForm({
            route_id: '',
            stop_name: '',
            stop_order: 1,
            pickup_time: '',
            drop_time: '',
            landmark: ''
        });
    };

    const resetAssignmentForm = () => {
        setAssignmentForm({
            student_id: '',
            route_id: '',
            stop_id: '',
            academic_year: new Date().getFullYear().toString()
        });
    };

    const openAddModal = (tab: TabType) => {
        if (tab === 'tracking') return;
        
        setModalType('add');
        setSelectedItem(null);
        
        if (tab === 'vehicles') resetVehicleForm();
        if (tab === 'routes') resetRouteForm();
        if (tab === 'stops') resetStopForm();
        if (tab === 'assignments') {
            resetAssignmentForm();
            setStudentFilters({
                academic_year: new Date().getFullYear().toString(),
                class_name: ''
            });
        }
        
        setShowModal(true);
    };

    const openEditModal = (item: any, tab: TabType) => {
        setModalType('edit');
        setSelectedItem(item);

        switch (tab) {
            case 'vehicles':
                setVehicleForm(item);
                break;
            case 'routes':
                setRouteForm(item);
                break;
            case 'stops':
                setStopForm(item);
                break;
        }

        setShowModal(true);
    };

    const handleSubmit = () => {
        if (modalType === 'add') {
            switch (activeTab) {
                case 'vehicles':
                    handleAddVehicle();
                    break;
                case 'routes':
                    handleAddRoute();
                    break;
                case 'stops':
                    handleAddStop();
                    break;
                case 'assignments':
                    handleAddAssignment();
                    break;
            }
        } else {
            switch (activeTab) {
                case 'vehicles':
                    handleUpdateVehicle();
                    break;
                case 'routes':
                    handleUpdateRoute();
                    break;
                case 'stops':
                    handleUpdateStop();
                    break;
            }
        }
    };

    // Filtered data
    const filteredVehicles = vehicles.filter(v =>
        v.vehicle_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.driver_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredRoutes = routes.filter(r =>
        r.route_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.route_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredStops = stops.filter(s =>
        s.stop_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredAssignments = assignments.filter(a =>
        a.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.route_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Transport Management</h1>
                    <p className="text-gray-600">Manage vehicles, routes, stops, student assignments, and live tracking</p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="ml-auto">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('vehicles')}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                                    activeTab === 'vehicles'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <Bus className="w-5 h-5" />
                                Vehicles
                            </button>
                            <button
                                onClick={() => setActiveTab('routes')}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                                    activeTab === 'routes'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <RouteIcon className="w-5 h-5" />
                                Routes
                            </button>
                            <button
                                onClick={() => setActiveTab('stops')}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                                    activeTab === 'stops'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <MapPin className="w-5 h-5" />
                                Stops
                            </button>
                            <button
                                onClick={() => setActiveTab('assignments')}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                                    activeTab === 'assignments'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <Users className="w-5 h-5" />
                                Student Assignments
                            </button>
                            <button
                                onClick={() => setActiveTab('tracking')}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                                    activeTab === 'tracking'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <Navigation className="w-5 h-5" />
                                Live Tracking
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Actions Bar */}
                {activeTab !== 'tracking' && (
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 max-w-md">
                            <Search className="w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 outline-none text-sm"
                            />
                        </div>
                        <button
                            onClick={() => openAddModal(activeTab)}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Add New
                        </button>
                    </div>
                )}

                {/* Content Area */}
                <div className="bg-white rounded-lg shadow-sm">
                    {loading && activeTab !== 'tracking' ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading...</p>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'vehicles' && (
                                <VehiclesTab
                                    vehicles={filteredVehicles}
                                    onEdit={(vehicle) => openEditModal(vehicle, 'vehicles')}
                                    onDelete={handleDeleteVehicle}
                                />
                            )}

                            {activeTab === 'routes' && (
                                <RoutesTab
                                    routes={filteredRoutes}
                                    onEdit={(route) => openEditModal(route, 'routes')}
                                    onDelete={handleDeleteRoute}
                                />
                            )}

                            {activeTab === 'stops' && (
                                <StopsTab
                                    stops={filteredStops}
                                    onEdit={(stop) => openEditModal(stop, 'stops')}
                                    onDelete={handleDeleteStop}
                                />
                            )}

                            {activeTab === 'assignments' && (
                                <AssignmentsTab
                                    assignments={filteredAssignments}
                                    onDelete={handleDeleteAssignment}
                                />
                            )}

                            {activeTab === 'tracking' && <LiveTrackingTab />}
                        </>
                    )}
                </div>

                {/* Modal */}
                {showModal && activeTab !== 'tracking' && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold">
                                    {modalType === 'add' ? 'Add New' : 'Edit'} {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6">
                                {/* Vehicle Form */}
                                {activeTab === 'vehicles' && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Vehicle Number *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={vehicleForm.vehicle_number}
                                                    onChange={(e) => setVehicleForm({ ...vehicleForm, vehicle_number: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="BUS-001"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Vehicle Type *
                                                </label>
                                                <select
                                                    value={vehicleForm.vehicle_type}
                                                    onChange={(e) => setVehicleForm({ ...vehicleForm, vehicle_type: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="bus">Bus</option>
                                                    <option value="mini-bus">Mini Bus</option>
                                                    <option value="van">Van</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Capacity *
                                            </label>
                                            <input
                                                type="number"
                                                value={vehicleForm.capacity}
                                                onChange={(e) => setVehicleForm({ ...vehicleForm, capacity: parseInt(e.target.value) })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                min="1"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Driver Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={vehicleForm.driver_name}
                                                    onChange={(e) => setVehicleForm({ ...vehicleForm, driver_name: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Driver Phone *
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={vehicleForm.driver_phone}
                                                    onChange={(e) => setVehicleForm({ ...vehicleForm, driver_phone: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Driver License *
                                            </label>
                                            <input
                                                type="text"
                                                value={vehicleForm.driver_license}
                                                onChange={(e) => setVehicleForm({ ...vehicleForm, driver_license: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    License Expiry *
                                                </label>
                                                <input
                                                    type="date"
                                                    value={vehicleForm.license_expiry}
                                                    onChange={(e) => setVehicleForm({ ...vehicleForm, license_expiry: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Insurance Expiry *
                                                </label>
                                                <input
                                                    type="date"
                                                    value={vehicleForm.insurance_expiry}
                                                    onChange={(e) => setVehicleForm({ ...vehicleForm, insurance_expiry: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Status *
                                            </label>
                                            <select
                                                value={vehicleForm.status}
                                                onChange={(e) => setVehicleForm({ ...vehicleForm, status: e.target.value as any })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="active">Active</option>
                                                <option value="maintenance">Maintenance</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {/* Route Form */}
                                {activeTab === 'routes' && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Route Code *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={routeForm.route_code}
                                                    onChange={(e) => setRouteForm({ ...routeForm, route_code: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="R001"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Route Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={routeForm.route_name}
                                                    onChange={(e) => setRouteForm({ ...routeForm, route_name: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="North Zone Route"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Assign Vehicle
                                            </label>
                                            <select
                                                value={routeForm.vehicle_id}
                                                onChange={(e) => setRouteForm({ ...routeForm, vehicle_id: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">Select Vehicle</option>
                                                {vehicles.filter(v => v.status === 'active').map((vehicle) => (
                                                    <option key={vehicle.id} value={vehicle.id}>
                                                        {vehicle.vehicle_number} - {vehicle.vehicle_type}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Start Point *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={routeForm.start_point}
                                                    onChange={(e) => setRouteForm({ ...routeForm, start_point: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    End Point *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={routeForm.end_point}
                                                    onChange={(e) => setRouteForm({ ...routeForm, end_point: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Total Stops
                                                </label>
                                                <input
                                                    type="number"
                                                    value={routeForm.total_stops}
                                                    onChange={(e) => setRouteForm({ ...routeForm, total_stops: parseInt(e.target.value) })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Distance (km)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={routeForm.distance_km}
                                                    onChange={(e) => setRouteForm({ ...routeForm, distance_km: parseFloat(e.target.value) })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Est. Time
                                                </label>
                                                <input
                                                    type="text"
                                                    value={routeForm.estimated_time}
                                                    onChange={(e) => setRouteForm({ ...routeForm, estimated_time: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="45 min"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Morning Start Time
                                                </label>
                                                <input
                                                    type="time"
                                                    value={routeForm.morning_start_time}
                                                    onChange={(e) => setRouteForm({ ...routeForm, morning_start_time: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Evening Start Time
                                                </label>
                                                <input
                                                    type="time"
                                                    value={routeForm.evening_start_time}
                                                    onChange={(e) => setRouteForm({ ...routeForm, evening_start_time: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Monthly Fee (₹)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={routeForm.fee_amount}
                                                    onChange={(e) => setRouteForm({ ...routeForm, fee_amount: parseFloat(e.target.value) })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    min="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Status *
                                                </label>
                                                <select
                                                    value={routeForm.status}
                                                    onChange={(e) => setRouteForm({ ...routeForm, status: e.target.value as any })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Stop Form */}
                                {activeTab === 'stops' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Route *
                                            </label>
                                            <select
                                                value={stopForm.route_id}
                                                onChange={(e) => setStopForm({ ...stopForm, route_id: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            >
                                                <option value="">Select Route</option>
                                                {routes.filter(r => r.status === 'active').map((route) => (
                                                    <option key={route.id} value={route.id}>
                                                        {route.route_code} - {route.route_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Stop Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={stopForm.stop_name}
                                                    onChange={(e) => setStopForm({ ...stopForm, stop_name: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Sector 15 Stop"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Stop Order *
                                                </label>
                                                <input
                                                    type="number"
                                                    value={stopForm.stop_order}
                                                    onChange={(e) => setStopForm({ ...stopForm, stop_order: parseInt(e.target.value) })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    min="1"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Pickup Time *
                                                </label>
                                                <input
                                                    type="time"
                                                    value={stopForm.pickup_time}
                                                    onChange={(e) => setStopForm({ ...stopForm, pickup_time: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Drop Time *
                                                </label>
                                                <input
                                                    type="time"
                                                    value={stopForm.drop_time}
                                                    onChange={(e) => setStopForm({ ...stopForm, drop_time: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Landmark
                                            </label>
                                            <textarea
                                                value={stopForm.landmark}
                                                onChange={(e) => setStopForm({ ...stopForm, landmark: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                rows={2}
                                                placeholder="Near Sector 15 Market"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Assignment Form */}
                                {activeTab === 'assignments' && (
                                    <div className="space-y-4">
                                        {/* Student Filter Section */}
                                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Filter: Academic Year
                                                </label>
                                                <select
                                                    value={studentFilters.academic_year}
                                                    onChange={(e) => setStudentFilters({ 
                                                        ...studentFilters, 
                                                        academic_year: e.target.value 
                                                    })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                >
                                                    <option value="">All Years</option>
                                                    {academicYears.map((year) => (
                                                        <option key={year} value={year}>{year}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Filter: Class
                                                </label>
                                                <select
                                                    value={studentFilters.class_name}
                                                    onChange={(e) => setStudentFilters({ 
                                                        ...studentFilters, 
                                                        class_name: e.target.value 
                                                    })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                >
                                                    <option value="">All Classes</option>
                                                    {classNames.map((className) => (
                                                        <option key={className} value={className}>
                                                            {className}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Assignment Form Fields */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Student *
                                            </label>
                                            <select
                                                value={assignmentForm.student_id}
                                                onChange={(e) => setAssignmentForm({ 
                                                    ...assignmentForm, 
                                                    student_id: e.target.value 
                                                })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            >
                                                <option value="">Select Student</option>
                                                {students.map((student) => (
                                                    <option key={student.student_id} value={student.student_id}>
                                                        {student.student_name} - {student.class_name}
                                                    </option>
                                                ))}
                                            </select>
                                            {students.length === 0 && (
                                                <p className="text-xs text-amber-600 mt-1">
                                                    No students found. Adjust filters above.
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Route *
                                            </label>
                                            <select
                                                value={assignmentForm.route_id}
                                                onChange={(e) => {
                                                    setAssignmentForm({ 
                                                        ...assignmentForm, 
                                                        route_id: e.target.value,
                                                        stop_id: '' // Reset stop when route changes
                                                    });
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            >
                                                <option value="">Select Route</option>
                                                {routes.filter(r => r.status === 'active').map((route) => (
                                                    <option key={route.id} value={route.id}>
                                                        {route.route_code} - {route.route_name} (₹{route.fee_amount}/month)
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Stop *
                                            </label>
                                            <select
                                                value={assignmentForm.stop_id}
                                                onChange={(e) => setAssignmentForm({ 
                                                    ...assignmentForm, 
                                                    stop_id: e.target.value 
                                                })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                                disabled={!assignmentForm.route_id}
                                            >
                                                <option value="">Select Stop</option>
                                                {stops
                                                    .filter(s => s.route_id === assignmentForm.route_id)
                                                    .sort((a, b) => a.stop_order - b.stop_order)
                                                    .map((stop) => (
                                                        <option key={stop.id} value={stop.id}>
                                                            #{stop.stop_order} - {stop.stop_name} (Pickup: {stop.pickup_time})
                                                        </option>
                                                    ))}
                                            </select>
                                            {!assignmentForm.route_id && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Please select a route first
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Academic Year *
                                            </label>
                                            <input
                                                type="text"
                                                value={assignmentForm.academic_year}
                                                onChange={(e) => setAssignmentForm({ 
                                                    ...assignmentForm, 
                                                    academic_year: e.target.value 
                                                })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="2025"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Modal Footer */}
                                <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : (modalType === 'add' ? 'Add' : 'Update')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
