// // // import { useState, useEffect, useCallback, useMemo } from 'react';
// // // import { useAuth } from '../../context/AuthContext'; // Adjust path as needed
// // // import { supabase } from '../../lib/supabase';
// // // import {
// // //     CalendarIcon,
// // //     PlusIcon,
// // //     FilterIcon,
// // //     SearchIcon,
// // //     EyeIcon,
// // //     EditIcon,
// // //     TrashIcon,
// // //     UsersIcon,
// // //     MapPinIcon,
// // //     ClockIcon,
// // //     UserIcon,
// // //     CheckCircleIcon,
// // //     XCircleIcon,
// // // } from 'lucide-react';

// // // // Interfaces (keep the same as before)
// // // interface Event {
// // //     id: string;
// // //     title: string;
// // //     description: string;
// // //     event_date: string;
// // //     event_time: string;
// // //     end_time?: string;
// // //     location: string;
// // //     event_type: 'academic' | 'sports' | 'cultural' | 'meeting' | 'holiday' | 'other';
// // //     target_roles: ('admin' | 'teacher' | 'student' | 'parent' | 'staff')[];
// // //     target_specific_users?: string[];
// // //     created_by: string; // Changed from UUID to string
// // //     created_at: string;
// // //     updated_at: string;
// // //     is_published: boolean;
// // //     max_participants?: number;
// // //     current_participants?: number;
// // //     image_url?: string;
// // // }

// // // interface EventParticipant {
// // //     id: string;
// // //     event_id: string;
// // //     user_id: string;
// // //     user_role: string;
// // //     status: 'registered' | 'attended' | 'cancelled';
// // //     registered_at: string;
// // // }

// // // interface UserProfile {
// // //     id: string;
// // //     full_name: string;
// // //     email: string;
// // //     role: 'admin' | 'teacher' | 'student' | 'parent' | 'staff';
// // //     avatar_url?: string;
// // // }

// // // const EventsPage: React.FC = () => {
// // //     // Use AuthContext to get user information
// // //     const { user, isAdmin, isTeacher, isStudent, isStaff, isParent, loading: authLoading } = useAuth();

// // //     // State management
// // //     const [events, setEvents] = useState<Event[]>([]);
// // //     const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
// // //     const [loading, setLoading] = useState(true);
// // //     const [showCreateModal, setShowCreateModal] = useState(false);
// // //     const [showEventModal, setShowEventModal] = useState<string | null>(null);
// // //     const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
// // //     const [participants, setParticipants] = useState<EventParticipant[]>([]);
// // //     const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>({});

// // //     // Filters and search
// // //     const [searchTerm, setSearchTerm] = useState('');
// // //     const [eventTypeFilter, setEventTypeFilter] = useState<Event['event_type'] | 'all'>('all');
// // //     const [dateFilter, setDateFilter] = useState<'all' | 'upcoming' | 'past' | 'today'>('upcoming');
// // //     const [roleFilter, setRoleFilter] = useState<'all' | string>('all');

// // //     // Edit Form State
// // //     const [editingEvent, setEditingEvent] = useState<Event | null>(null);
// // //     const [showEditModal, setShowEditModal] = useState(false);




// // //     // Form state
// // //     const [eventForm, setEventForm] = useState<Partial<Event>>({
// // //         title: '',
// // //         description: '',
// // //         event_date: new Date().toISOString().split('T')[0],
// // //         event_time: '09:00',
// // //         end_time: '17:00',
// // //         location: '',
// // //         event_type: 'academic',
// // //         target_roles: [],
// // //         is_published: true,
// // //         max_participants: undefined,
// // //         created_by: user?.name || '', // Pre-fill with current user's name
// // //     });

// // //     const startEditEvent = (event: Event) => {
// // //         setEditingEvent(event);
// // //         setEventForm({
// // //             title: event.title,
// // //             description: event.description,
// // //             event_date: event.event_date,
// // //             event_time: event.event_time,
// // //             end_time: event.end_time,
// // //             location: event.location,
// // //             event_type: event.event_type,
// // //             target_roles: event.target_roles,
// // //             is_published: event.is_published,
// // //             max_participants: event.max_participants,
// // //             created_by: event.created_by,
// // //         });
// // //         setShowEditModal(true);
// // //         setShowEventModal(null); // Close the details modal
// // //     };


// // //     // Update event function
// // //     const updateEvent = async () => {
// // //         if (!editingEvent) return;

// // //         try {
// // //             const { error } = await supabase
// // //                 .from('events')
// // //                 .update({
// // //                     title: eventForm.title,
// // //                     description: eventForm.description,
// // //                     event_date: eventForm.event_date,
// // //                     event_time: eventForm.event_time,
// // //                     end_time: eventForm.end_time,
// // //                     location: eventForm.location,
// // //                     event_type: eventForm.event_type,
// // //                     target_roles: eventForm.target_roles,
// // //                     is_published: eventForm.is_published,
// // //                     max_participants: eventForm.max_participants,
// // //                     created_by: eventForm.created_by,
// // //                     updated_at: new Date().toISOString(),
// // //                 })
// // //                 .eq('id', editingEvent.id);

// // //             if (error) throw error;

// // //             setShowEditModal(false);
// // //             setEditingEvent(null);
// // //             setEventForm({
// // //                 title: '',
// // //                 description: '',
// // //                 event_date: new Date().toISOString().split('T')[0],
// // //                 event_time: '09:00',
// // //                 end_time: '17:00',
// // //                 location: '',
// // //                 event_type: 'academic',
// // //                 target_roles: [],
// // //                 is_published: true,
// // //                 max_participants: undefined,
// // //                 created_by: user?.name || '',
// // //             });

// // //             fetchEvents();
// // //             alert('Event updated successfully!');
// // //         } catch (error) {
// // //             console.error('Error updating event:', error);
// // //             alert('Error updating event. Please try again.');
// // //         }
// // //     };

// // //     // Get current user role from auth context
// // //     const userRole = user?.role || 'student';
// // //     const userId = user?.id || '';

// // //     // Permissions based on user role - using your AuthContext properties
// // //     const permissions = useMemo(() => {
// // //         const canCreate = isAdmin || isTeacher || isStaff;
// // //         const canEdit = (event: Event) =>
// // //             isAdmin || event.created_by === userId;
// // //         const canDelete = (event: Event) =>
// // //             isAdmin || event.created_by === userId;
// // //         const canViewAll = isAdmin;
// // //         const canManageParticipants = isAdmin || isTeacher;

// // //         return { canCreate, canEdit, canDelete, canViewAll, canManageParticipants };
// // //     }, [isAdmin, isTeacher, isStaff, userId]);

// // //     // Fetch events based on user role
// // //     const fetchEvents = useCallback(async () => {
// // //         if (!user) return; // Don't fetch if no user is logged in

// // //         setLoading(true);
// // //         try {
// // //             let query = supabase
// // //                 .from('events')
// // //                 .select('*')
// // //                 .eq('is_published', true);

// // //             // Non-admin users only see events targeted to their role
// // //             if (!isAdmin) {
// // //                 query = query.contains('target_roles', [userRole]);
// // //             }

// // //             const { data, error } = await query.order('event_date', { ascending: true });

// // //             if (error) throw error;
// // //             setEvents(data || []);
// // //         } catch (error) {
// // //             console.error('Error fetching events:', error);
// // //         } finally {
// // //             setLoading(false);
// // //         }
// // //     }, [user, userRole, isAdmin]);

// // //     // Fetch participants for selected event
// // //     const fetchParticipants = useCallback(async (eventId: string) => {
// // //         try {
// // //             const { data, error } = await supabase
// // //                 .from('event_participants')
// // //                 .select('*')
// // //                 .eq('event_id', eventId);

// // //             if (error) throw error;
// // //             setParticipants(data || []);

// // //             // Fetch user profiles for participants
// // //             if (data && data.length > 0) {
// // //                 const userIds = data.map(p => p.user_id);
// // //                 const { data: profiles, error: profileError } = await supabase
// // //                     .from('profiles')
// // //                     .select('id, full_name, email, role, avatar_url')
// // //                     .in('id', userIds);

// // //                 if (!profileError && profiles) {
// // //                     const profilesMap = profiles.reduce((acc, profile) => {
// // //                         acc[profile.id] = profile;
// // //                         return acc;
// // //                     }, {} as Record<string, UserProfile>);
// // //                     setUserProfiles(profilesMap);
// // //                 }
// // //             }
// // //         } catch (error) {
// // //             console.error('Error fetching participants:', error);
// // //         }
// // //     }, []);

// // //     // Register for event
// // //     const registerForEvent = async (eventId: string) => {
// // //         if (!user) {
// // //             alert('Please log in to register for events');
// // //             return;
// // //         }

// // //         try {
// // //             const { error } = await supabase
// // //                 .from('event_participants')
// // //                 .insert({
// // //                     event_id: eventId,
// // //                     user_id: user?.name || '',
// // //                     user_role: userRole,
// // //                     status: 'registered',
// // //                 });

// // //             if (error) throw error;

// // //             // Refresh events to update participant count
// // //             fetchEvents();
// // //             if (selectedEvent) {
// // //                 fetchParticipants(selectedEvent.id);
// // //             }

// // //             alert('Successfully registered for the event!');
// // //         } catch (error) {
// // //             console.error('Error registering for event:', error);
// // //             alert('Error registering for event. Please try again.');
// // //         }
// // //     };

// // //     // Create new event
// // //     const createEvent = async () => {
// // //         if (!user) {
// // //             alert('Please log in to create events');
// // //             return;
// // //         }

// // //         try {
// // //             const { error } = await supabase
// // //                 .from('events')
// // //                 .insert({
// // //                     ...eventForm,
// // //                     created_by: eventForm.created_by || user.name, // Use form value or fallback to user name
// // //                 });

// // //             if (error) throw error;

// // //             setShowCreateModal(false);
// // //             setEventForm({
// // //                 title: '',
// // //                 description: '',
// // //                 event_date: new Date().toISOString().split('T')[0],
// // //                 event_time: '09:00',
// // //                 end_time: '17:00',
// // //                 location: '',
// // //                 event_type: 'academic',
// // //                 target_roles: [],
// // //                 is_published: true,
// // //                 max_participants: undefined,
// // //                 created_by: user.name, // Reset to current user

// // //             });

// // //             fetchEvents();
// // //             alert('Event created successfully!');
// // //         } catch (error) {
// // //             console.error('Error creating event:', error);
// // //             alert('Error creating event. Please try again.');
// // //         }
// // //     };

// // //     // Delete event
// // //     const deleteEvent = async (eventId: string) => {
// // //         if (!confirm('Are you sure you want to delete this event?')) return;

// // //         try {
// // //             const { error } = await supabase
// // //                 .from('events')
// // //                 .delete()
// // //                 .eq('id', eventId);

// // //             if (error) throw error;

// // //             fetchEvents();
// // //             setShowEventModal(null);
// // //             alert('Event deleted successfully!');
// // //         } catch (error) {
// // //             console.error('Error deleting event:', error);
// // //             alert('Error deleting event. Please try again.');
// // //         }
// // //     };

// // //     // Filter events based on search and filters
// // //     useEffect(() => {
// // //         let filtered = events;

// // //         // Search filter
// // //         if (searchTerm) {
// // //             filtered = filtered.filter(event =>
// // //                 event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //                 event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //                 event.location.toLowerCase().includes(searchTerm.toLowerCase())
// // //             );
// // //         }

// // //         // Event type filter
// // //         if (eventTypeFilter !== 'all') {
// // //             filtered = filtered.filter(event => event.event_type === eventTypeFilter);
// // //         }

// // //         // Date filter
// // //         const today = new Date().toISOString().split('T')[0];
// // //         switch (dateFilter) {
// // //             case 'upcoming':
// // //                 filtered = filtered.filter(event => event.event_date >= today);
// // //                 break;
// // //             case 'past':
// // //                 filtered = filtered.filter(event => event.event_date < today);
// // //                 break;
// // //             case 'today':
// // //                 filtered = filtered.filter(event => event.event_date === today);
// // //                 break;
// // //         }

// // //         // Role filter (for admin view)
// // //         if (roleFilter !== 'all' && isAdmin) {
// // //             filtered = filtered.filter(event => event.target_roles.includes(roleFilter as any));
// // //         }

// // //         setFilteredEvents(filtered);
// // //     }, [events, searchTerm, eventTypeFilter, dateFilter, roleFilter, isAdmin]);

// // //     // Load events when user is available
// // //     useEffect(() => {
// // //         if (user) {
// // //             fetchEvents();
// // //         }
// // //     }, [user, fetchEvents]);

// // //     // Set default target roles in form based on user role
// // //     useEffect(() => {
// // //         if (user) {
// // //             setEventForm(prev => ({
// // //                 ...prev,
// // //                 target_roles: [userRole], // Default to user's own role
// // //             }));
// // //         }
// // //     }, [user, userRole]);

// // //     // Show loading while auth is initializing
// // //     if (authLoading) {
// // //         return (
// // //             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// // //                 <div className="text-center">
// // //                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
// // //                     <p className="mt-4 text-gray-600">Loading...</p>
// // //                 </div>
// // //             </div>
// // //         );
// // //     }

// // //     // Show login prompt if no user
// // //     if (!user) {
// // //         return (
// // //             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// // //                 <div className="text-center">
// // //                     <CalendarIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
// // //                     <h3 className="text-lg font-medium text-gray-900 mb-2">Please Log In</h3>
// // //                     <p className="text-gray-600">You need to be logged in to view events.</p>
// // //                 </div>
// // //             </div>
// // //         );
// // //     }

// // //     // Helper functions (keep the same as before)
// // //     const getEventTypeColor = (type: Event['event_type']) => {
// // //         const colors = {
// // //             academic: 'bg-blue-100 text-blue-800',
// // //             sports: 'bg-green-100 text-green-800',
// // //             cultural: 'bg-purple-100 text-purple-800',
// // //             meeting: 'bg-orange-100 text-orange-800',
// // //             holiday: 'bg-red-100 text-red-800',
// // //             other: 'bg-gray-100 text-gray-800',
// // //         };
// // //         return colors[type];
// // //     };

// // //     const getRoleColor = (role: string) => {
// // //         const colors = {
// // //             admin: 'bg-red-100 text-red-800',
// // //             teacher: 'bg-blue-100 text-blue-800',
// // //             student: 'bg-green-100 text-green-800',
// // //             parent: 'bg-purple-100 text-purple-800',
// // //             staff: 'bg-orange-100 text-orange-800',
// // //         };
// // //         return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
// // //     };

// // //     const isUserRegistered = (eventId: string) => {
// // //         return participants.some(p => p.event_id === eventId && p.user_id === userId);
// // //     };

// // //     const formatDate = (dateString: string) => {
// // //         return new Date(dateString).toLocaleDateString('en-US', {
// // //             weekday: 'long',
// // //             year: 'numeric',
// // //             month: 'long',
// // //             day: 'numeric',
// // //         });
// // //     };

// // //     return (
// // //         <div className="min-h-screen bg-gray-50 py-8">
// // //             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// // //                 {/* Header */}
// // //                 <div className="mb-8">
// // //                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
// // //                         <div>
// // //                             <h1 className="text-3xl font-bold text-gray-900">School Events</h1>
// // //                             <p className="mt-2 text-sm text-gray-600">
// // //                                 Welcome, {user.name}! Stay updated with all school activities and events
// // //                             </p>
// // //                         </div>

// // //                         {permissions.canCreate && (
// // //                             <button
// // //                                 onClick={() => setShowCreateModal(true)}
// // //                                 className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
// // //                             >
// // //                                 <PlusIcon className="w-4 h-4 mr-2" />
// // //                                 Create Event
// // //                             </button>
// // //                         )}
// // //                     </div>
// // //                 </div>
// // //                 {/* Filters */}
// // //                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
// // //                     {/* Search */}            <div className="lg:col-span-2">               <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
// // //                         Search Events
// // //                     </label>
// // //                         <div className="relative rounded-md shadow-sm">
// // //                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// // //                                 <SearchIcon className="h-4 w-4 text-gray-400" />
// // //                             </div>
// // //                             <input
// // //                                 type="text"
// // //                                 id="search"
// // //                                 className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
// // //                                 placeholder="Search by title, description..."
// // //                                 value={searchTerm}
// // //                                 onChange={(e) => setSearchTerm(e.target.value)}
// // //                             />
// // //                         </div>
// // //                     </div>

// // //                     {/* Event Type Filter */}
// // //                     <div>
// // //                         <label htmlFor="event-type" className="block text-sm font-medium text-gray-700 mb-1">
// // //                             Event Type
// // //                         </label>
// // //                         <select
// // //                             id="event-type"
// // //                             className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
// // //                             value={eventTypeFilter}
// // //                             onChange={(e) => setEventTypeFilter(e.target.value as Event['event_type'] | 'all')}
// // //                         >
// // //                             <option value="all">All Types</option>
// // //                             <option value="academic">Academic</option>
// // //                             <option value="sports">Sports</option>
// // //                             <option value="cultural">Cultural</option>
// // //                             <option value="meeting">Meeting</option>
// // //                             <option value="holiday">Holiday</option>
// // //                             <option value="other">Other</option>
// // //                         </select>
// // //                     </div>

// // //                     {/* Date Filter */}
// // //                     <div>
// // //                         <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
// // //                             Date
// // //                         </label>
// // //                         <select
// // //                             id="date-filter"
// // //                             className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
// // //                             value={dateFilter}
// // //                             onChange={(e) => setDateFilter(e.target.value as any)}
// // //                         >
// // //                             <option value="upcoming">Upcoming</option>
// // //                             <option value="today">Today</option>
// // //                             <option value="past">Past</option>
// // //                             <option value="all">All Dates</option>
// // //                         </select>
// // //                     </div>

// // //                     {/* Role Filter (Admin only) */}
// // //                     {permissions.canViewAll && (
// // //                         <div>
// // //                             <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">
// // //                                 Target Role
// // //                             </label>
// // //                             <select
// // //                                 id="role-filter"
// // //                                 className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
// // //                                 value={roleFilter}
// // //                                 onChange={(e) => setRoleFilter(e.target.value)}
// // //                             >
// // //                                 <option value="all">All Roles</option>
// // //                                 <option value="admin">Admin</option>
// // //                                 <option value="teacher">Teacher</option>
// // //                                 <option value="student">Student</option>
// // //                                 <option value="parent">Parent</option>
// // //                                 <option value="staff">Staff</option>
// // //                             </select>
// // //                         </div>
// // //                     )}
// // //                 </div>
// // //                 </div>

// // //                 {/* Events Grid */}
// // //                 {loading ? (
// // //                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
// // //                         <div className="animate-pulse">Loading events...</div>
// // //                     </div>
// // //                 ) : filteredEvents.length === 0 ? (
// // //                     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
// // //                         <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
// // //                         <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
// // //                         <p className="mt-1 text-sm text-gray-500">
// // //                             {searchTerm || eventTypeFilter !== 'all' || dateFilter !== 'upcoming'
// // //                                 ? 'Try changing your filters or search term.'
// // //                                 : 'No events have been scheduled yet.'}
// // //                         </p>
// // //                     </div>
// // //                 ) : (
// // //                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// // //                         {filteredEvents.map((event) => (
// // //                             <div
// // //                                 key={event.id}
// // //                                 className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
// // //                             >
// // //                                 {event.image_url && (
// // //                                     <img
// // //                                         src={event.image_url}
// // //                                         alt={event.title}
// // //                                         className="w-full h-48 object-cover"
// // //                                     />
// // //                                 )}

// // //                                 <div className="p-6">
// // //                                     <div className="flex items-start justify-between mb-3">
// // //                                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(event.event_type)}`}>
// // //                                             {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
// // //                                         </span>
// // //                                         <div className="flex items-center space-x-1">
// // //                                             {event.target_roles.map(role => (
// // //                                                 <span
// // //                                                     key={role}
// // //                                                     className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(role)}`}
// // //                                                     title={`Visible to ${role}s`}
// // //                                                 >
// // //                                                     <UserIcon className="w-3 h-3 mr-1" />
// // //                                                     {role}
// // //                                                 </span>
// // //                                             ))}
// // //                                         </div>
// // //                                     </div>

// // //                                     <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
// // //                                         {event.title}
// // //                                     </h3>

// // //                                     <p className="text-gray-600 text-sm mb-4 line-clamp-2">
// // //                                         {event.description}
// // //                                     </p>

// // //                                     <div className="space-y-2 mb-4">
// // //                                         <div className="flex items-center text-sm text-gray-500">
// // //                                             <CalendarIcon className="w-4 h-4 mr-2" />
// // //                                             {formatDate(event.event_date)}
// // //                                         </div>
// // //                                         <div className="flex items-center text-sm text-gray-500">
// // //                                             <ClockIcon className="w-4 h-4 mr-2" />
// // //                                             {event.event_time} {event.end_time && `- ${event.end_time}`}
// // //                                         </div>
// // //                                         <div className="flex items-center text-sm text-gray-500">
// // //                                             <MapPinIcon className="w-4 h-4 mr-2" />
// // //                                             {event.location}
// // //                                         </div>
// // //                                         {event.max_participants && (
// // //                                             <div className="flex items-center text-sm text-gray-500">
// // //                                                 <UsersIcon className="w-4 h-4 mr-2" />
// // //                                                 {event.current_participants || 0} / {event.max_participants} participants
// // //                                             </div>
// // //                                         )}
// // //                                     </div>

// // //                                     <div className="flex items-center justify-between">
// // //                                         <button
// // //                                             onClick={() => {
// // //                                                 setSelectedEvent(event);
// // //                                                 setShowEventModal(event.id);
// // //                                                 fetchParticipants(event.id);
// // //                                             }}
// // //                                             className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
// // //                                         >
// // //                                             <EyeIcon className="w-4 h-4 mr-2" />
// // //                                             View Details
// // //                                         </button>

// // //                                         {!isUserRegistered(event.id) &&
// // //                                             event.event_date >= new Date().toISOString().split('T')[0] && (
// // //                                                 <button
// // //                                                     onClick={() => registerForEvent(event.id)}
// // //                                                     className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
// // //                                                 >
// // //                                                     Register
// // //                                                 </button>
// // //                                             )}

// // //                                         {isUserRegistered(event.id) && (
// // //                                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
// // //                                                 <CheckCircleIcon className="w-4 h-4 mr-1" />
// // //                                                 Registered
// // //                                             </span>
// // //                                         )}
// // //                                     </div>
// // //                                 </div>
// // //                             </div>
// // //                         ))}
// // //                     </div>
// // //                 )}

// // //                 {/* Create Event Modal */}
// // //                 {/* Create Event Modal */}
// // //                 {showCreateModal && (
// // //                     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
// // //                         <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
// // //                             <div className="mt-3">
// // //                                 <div className="flex items-center justify-between mb-4">
// // //                                     <h3 className="text-lg font-medium text-gray-900">Create New Event</h3>
// // //                                     <button
// // //                                         onClick={() => setShowCreateModal(false)}
// // //                                         className="text-gray-400 hover:text-gray-600"
// // //                                     >
// // //                                         <XCircleIcon className="w-6 h-6" />
// // //                                     </button>
// // //                                 </div>

// // //                                 <div className="grid grid-cols-1 gap-4 mb-4">
// // //                                     <div>
// // //                                         <label className="block text-sm font-medium text-gray-700">Event Title</label>
// // //                                         <input
// // //                                             type="text"
// // //                                             className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // //                                             value={eventForm.title}
// // //                                             onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
// // //                                         />
// // //                                     </div>

// // //                                     <div>
// // //                                         <label className="block text-sm font-medium text-gray-700">Description</label>
// // //                                         <textarea
// // //                                             className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // //                                             rows={3}
// // //                                             value={eventForm.description}
// // //                                             onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
// // //                                         />
// // //                                     </div>

// // //                                     <div className="grid grid-cols-2 gap-4">
// // //                                         <div>
// // //                                             <label className="block text-sm font-medium text-gray-700">Date</label>
// // //                                             <input
// // //                                                 type="date"
// // //                                                 className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // //                                                 value={eventForm.event_date}
// // //                                                 onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
// // //                                             />
// // //                                         </div>

// // //                                         <div>
// // //                                             <label className="block text-sm font-medium text-gray-700">Time</label>
// // //                                             <input
// // //                                                 type="time"
// // //                                                 className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // //                                                 value={eventForm.event_time}
// // //                                                 onChange={(e) => setEventForm({ ...eventForm, event_time: e.target.value })}
// // //                                             />
// // //                                         </div>
// // //                                     </div>

// // //                                     <div className="grid grid-cols-2 gap-4">
// // //                                         <div>
// // //                                             <label className="block text-sm font-medium text-gray-700">End Time (Optional)</label>
// // //                                             <input
// // //                                                 type="time"
// // //                                                 className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // //                                                 value={eventForm.end_time}
// // //                                                 onChange={(e) => setEventForm({ ...eventForm, end_time: e.target.value })}
// // //                                             />
// // //                                         </div>

// // //                                         <div>
// // //                                             <label className="block text-sm font-medium text-gray-700">Event Type</label>
// // //                                             <select
// // //                                                 className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // //                                                 value={eventForm.event_type}
// // //                                                 onChange={(e) => setEventForm({ ...eventForm, event_type: e.target.value as Event['event_type'] })}
// // //                                             >
// // //                                                 <option value="academic">Academic</option>
// // //                                                 <option value="sports">Sports</option>
// // //                                                 <option value="cultural">Cultural</option>
// // //                                                 <option value="meeting">Meeting</option>
// // //                                                 <option value="holiday">Holiday</option>
// // //                                                 <option value="other">Other</option>
// // //                                             </select>
// // //                                         </div>
// // //                                     </div>

// // //                                     <div>
// // //                                         <label className="block text-sm font-medium text-gray-700">Location</label>
// // //                                         <input
// // //                                             type="text"
// // //                                             className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // //                                             value={eventForm.location}
// // //                                             onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
// // //                                         />
// // //                                     </div>

// // //                                     {/* NEW: Created By Input Field */}
// // //                                     <div>
// // //                                         <label className="block text-sm font-medium text-gray-700">Created By</label>
// // //                                         <input
// // //                                             type="text"
// // //                                             className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // //                                             placeholder="Enter creator name"
// // //                                             value={eventForm.created_by || ''}
// // //                                             onChange={(e) => setEventForm({ ...eventForm, created_by: e.target.value })}
// // //                                         />
// // //                                         <p className="mt-1 text-xs text-gray-500">
// // //                                             Name of the person creating this event
// // //                                         </p>
// // //                                     </div>

// // //                                     <div>
// // //                                         <label className="block text-sm font-medium text-gray-700">Target Roles</label>
// // //                                         <div className="mt-2 space-y-2">
// // //                                             {['admin', 'teacher', 'student', 'parent', 'staff'].map(role => (
// // //                                                 <label key={role} className="inline-flex items-center mr-4">
// // //                                                     <input
// // //                                                         type="checkbox"
// // //                                                         className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
// // //                                                         checked={eventForm.target_roles?.includes(role as any)}
// // //                                                         onChange={(e) => {
// // //                                                             const currentRoles = eventForm.target_roles || [];
// // //                                                             if (e.target.checked) {
// // //                                                                 setEventForm({
// // //                                                                     ...eventForm,
// // //                                                                     target_roles: [...currentRoles, role as any],
// // //                                                                 });
// // //                                                             } else {
// // //                                                                 setEventForm({
// // //                                                                     ...eventForm,
// // //                                                                     target_roles: currentRoles.filter(r => r !== role),
// // //                                                                 });
// // //                                                             }
// // //                                                         }}
// // //                                                     />
// // //                                                     <span className="ml-2 text-sm text-gray-700 capitalize">{role}</span>
// // //                                                 </label>
// // //                                             ))}
// // //                                         </div>
// // //                                     </div>

// // //                                     <div>
// // //                                         <label className="block text-sm font-medium text-gray-700">
// // //                                             Maximum Participants (Optional)
// // //                                         </label>
// // //                                         <input
// // //                                             type="number"
// // //                                             className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // //                                             value={eventForm.max_participants || ''}
// // //                                             onChange={(e) => setEventForm({
// // //                                                 ...eventForm,
// // //                                                 max_participants: e.target.value ? parseInt(e.target.value) : undefined,
// // //                                             })}
// // //                                         />
// // //                                     </div>
// // //                                 </div>

// // //                                 <div className="flex justify-end space-x-3">
// // //                                     <button
// // //                                         onClick={() => setShowCreateModal(false)}
// // //                                         className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
// // //                                     >
// // //                                         Cancel
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={createEvent}
// // //                                         className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
// // //                                     >
// // //                                         Create Event
// // //                                     </button>
// // //                                 </div>
// // //                             </div>
// // //                         </div>
// // //                     </div>
// // //                 )}{/* Edit Event Modal */}
// // //                 {showEditModal && editingEvent && (
// // //                     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
// // //                         <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
// // //                             <div className="mt-3">
// // //                                 <div className="flex items-center justify-between mb-4">
// // //                                     <h3 className="text-lg font-medium text-gray-900">Edit Event</h3>
// // //                                     <button
// // //                                         onClick={() => {
// // //                                             setShowEditModal(false);
// // //                                             setEditingEvent(null);
// // //                                         }}
// // //                                         className="text-gray-400 hover:text-gray-600"
// // //                                     >
// // //                                         <XCircleIcon className="w-6 h-6" />
// // //                                     </button>
// // //                                 </div>

// // //                                 <div className="grid grid-cols-1 gap-4 mb-4">
// // //                                     <div>
// // //                                         <label className="block text-sm font-medium text-gray-700">Event Title</label>
// // //                                         <input
// // //                                             type="text"
// // //                                             className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // //                                             value={eventForm.title}
// // //                                             onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
// // //                                         />
// // //                                     </div>

// // //                                     <div>
// // //                                         <label className="block text-sm font-medium text-gray-700">Description</label>
// // //                                         <textarea
// // //                                             className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // //                                             rows={3}
// // //                                             value={eventForm.description}
// // //                                             onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
// // //                                         />
// // //                                     </div>

// // //                                     <div className="grid grid-cols-2 gap-4">
// // //                                         <div>
// // //                                             <label className="block text-sm font-medium text-gray-700">Date</label>
// // //                                             <input
// // //                                                 type="date"
// // //                                                 className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // //                                                 value={eventForm.event_date}
// // //                                                 onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
// // //                                             />
// // //                                         </div>

// // //                                         <div>
// // //                                             <label className="block text-sm font-medium text-gray-700">Time</label>
// // //                                             <input
// // //                                                 type="time"
// // //                                                 className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // //                                                 value={eventForm.event_time}
// // //                                                 onChange={(e) => setEventForm({ ...eventForm, event_time: e.target.value })}
// // //                                             />
// // //                                         </div>
// // //                                     </div>

// // //                                     <div className="grid grid-cols-2 gap-4">
// // //                                         <div>
// // //                                             <label className="block text-sm font-medium text-gray-700">End Time (Optional)</label>
// // //                                             <input
// // //                                                 type="time"
// // //                                                 className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // //                                                 value={eventForm.end_time}
// // //                                                 onChange={(e) => setEventForm({ ...eventForm, end_time: e.target.value })}
// // //                                             />
// // //                                         </div>

// // //                                         <div>
// // //                                             <label className="block text-sm font-medium text-gray-700">Event Type</label>
// // //                                             <select
// // //                                                 className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // //                                                 value={eventForm.event_type}
// // //                                                 onChange={(e) => setEventForm({ ...eventForm, event_type: e.target.value as Event['event_type'] })}
// // //                                             >
// // //                                                 <option value="academic">Academic</option>
// // //                                                 <option value="sports">Sports</option>
// // //                                                 <option value="cultural">Cultural</option>
// // //                                                 <option value="meeting">Meeting</option>
// // //                                                 <option value="holiday">Holiday</option>
// // //                                                 <option value="other">Other</option>
// // //                                             </select>
// // //                                         </div>
// // //                                     </div>

// // //                                     <div>
// // //                                         <label className="block text-sm font-medium text-gray-700">Location</label>
// // //                                         <input
// // //                                             type="text"
// // //                                             className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // //                                             value={eventForm.location}
// // //                                             onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
// // //                                         />
// // //                                     </div>

// // //                                     {/* Created By Input Field */}
// // //                                     <div>
// // //                                         <label className="block text-sm font-medium text-gray-700">Created By</label>
// // //                                         <input
// // //                                             type="text"
// // //                                             className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // //                                             placeholder="Enter creator name"
// // //                                             value={eventForm.created_by || ''}
// // //                                             onChange={(e) => setEventForm({ ...eventForm, created_by: e.target.value })}
// // //                                         />
// // //                                         <p className="mt-1 text-xs text-gray-500">
// // //                                             Name of the person creating this event
// // //                                         </p>
// // //                                     </div>

// // //                                     <div>
// // //                                         <label className="block text-sm font-medium text-gray-700">Target Roles</label>
// // //                                         <div className="mt-2 space-y-2">
// // //                                             {['admin', 'teacher', 'student', 'parent', 'staff'].map(role => (
// // //                                                 <label key={role} className="inline-flex items-center mr-4">
// // //                                                     <input
// // //                                                         type="checkbox"
// // //                                                         className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
// // //                                                         checked={eventForm.target_roles?.includes(role as any)}
// // //                                                         onChange={(e) => {
// // //                                                             const currentRoles = eventForm.target_roles || [];
// // //                                                             if (e.target.checked) {
// // //                                                                 setEventForm({
// // //                                                                     ...eventForm,
// // //                                                                     target_roles: [...currentRoles, role as any],
// // //                                                                 });
// // //                                                             } else {
// // //                                                                 setEventForm({
// // //                                                                     ...eventForm,
// // //                                                                     target_roles: currentRoles.filter(r => r !== role),
// // //                                                                 });
// // //                                                             }
// // //                                                         }}
// // //                                                     />
// // //                                                     <span className="ml-2 text-sm text-gray-700 capitalize">{role}</span>
// // //                                                 </label>
// // //                                             ))}
// // //                                         </div>
// // //                                     </div>

// // //                                     <div>
// // //                                         <label className="block text-sm font-medium text-gray-700">
// // //                                             Maximum Participants (Optional)
// // //                                         </label>
// // //                                         <input
// // //                                             type="number"
// // //                                             className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
// // //                                             value={eventForm.max_participants || ''}
// // //                                             onChange={(e) => setEventForm({
// // //                                                 ...eventForm,
// // //                                                 max_participants: e.target.value ? parseInt(e.target.value) : undefined,
// // //                                             })}
// // //                                         />
// // //                                     </div>

// // //                                     <div>
// // //                                         <label className="block text-sm font-medium text-gray-700">Published Status</label>
// // //                                         <div className="mt-2">
// // //                                             <label className="inline-flex items-center">
// // //                                                 <input
// // //                                                     type="checkbox"
// // //                                                     className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
// // //                                                     checked={eventForm.is_published}
// // //                                                     onChange={(e) => setEventForm({
// // //                                                         ...eventForm,
// // //                                                         is_published: e.target.checked
// // //                                                     })}
// // //                                                 />
// // //                                                 <span className="ml-2 text-sm text-gray-700">Published (visible to users)</span>
// // //                                             </label>
// // //                                         </div>
// // //                                     </div>
// // //                                 </div>

// // //                                 <div className="flex justify-end space-x-3">
// // //                                     <button
// // //                                         onClick={() => {
// // //                                             setShowEditModal(false);
// // //                                             setEditingEvent(null);
// // //                                         }}
// // //                                         className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
// // //                                     >
// // //                                         Cancel
// // //                                     </button>
// // //                                     <button
// // //                                         onClick={updateEvent}
// // //                                         className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
// // //                                     >
// // //                                         Update Event
// // //                                     </button>
// // //                                 </div>
// // //                             </div>
// // //                         </div>
// // //                     </div>
// // //                 )}

// // //                 {/* Event Details Modal */}
// // //                 {showEventModal && selectedEvent && (
// // //                     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
// // //                         <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
// // //                             <div className="mt-3">
// // //                                 <div className="flex items-center justify-between mb-4">
// // //                                     <h3 className="text-lg font-medium text-gray-900">{selectedEvent.title}</h3>
// // //                                     <button
// // //                                         onClick={() => {
// // //                                             setShowEventModal(null);
// // //                                             setSelectedEvent(null);
// // //                                         }}
// // //                                         className="text-gray-400 hover:text-gray-600"
// // //                                     >
// // //                                         <XCircleIcon className="w-6 h-6" />
// // //                                     </button>
// // //                                 </div>

// // //                                 <div className="space-y-4">
// // //                                     <div className="flex items-center space-x-4">
// // //                                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(selectedEvent.event_type)}`}>
// // //                                             {selectedEvent.event_type.charAt(0).toUpperCase() + selectedEvent.event_type.slice(1)}
// // //                                         </span>
// // //                                         <div className="flex items-center space-x-1">
// // //                                             {selectedEvent.target_roles.map(role => (
// // //                                                 <span
// // //                                                     key={role}
// // //                                                     className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(role)}`}
// // //                                                 >
// // //                                                     <UserIcon className="w-3 h-3 mr-1" />
// // //                                                     {role}
// // //                                                 </span>
// // //                                             ))}
// // //                                         </div>
// // //                                     </div>

// // //                                     <div>
// // //                                         <h4 className="text-sm font-medium text-gray-700">Description</h4>
// // //                                         <p className="mt-1 text-sm text-gray-600">{selectedEvent.description}</p>
// // //                                     </div>

// // //                                     <div className="grid grid-cols-2 gap-4">
// // //                                         <div className="flex items-center text-sm text-gray-600">
// // //                                             <CalendarIcon className="w-4 h-4 mr-2" />
// // //                                             {formatDate(selectedEvent.event_date)}
// // //                                         </div>
// // //                                         <div className="flex items-center text-sm text-gray-600">
// // //                                             <ClockIcon className="w-4 h-4 mr-2" />
// // //                                             {selectedEvent.event_time} {selectedEvent.end_time && `- ${selectedEvent.end_time}`}
// // //                                         </div>
// // //                                         <div className="flex items-center text-sm text-gray-600 col-span-2">
// // //                                             <MapPinIcon className="w-4 h-4 mr-2" />
// // //                                             {selectedEvent.location}
// // //                                         </div>
// // //                                     </div>

// // //                                     {permissions.canManageParticipants && participants.length > 0 && (
// // //                                         <div>
// // //                                             <h4 className="text-sm font-medium text-gray-700 mb-2">Participants ({participants.length})</h4>
// // //                                             <div className="space-y-2 max-h-40 overflow-y-auto">
// // //                                                 {participants.map(participant => (
// // //                                                     <div key={participant.id} className="flex items-center justify-between text-sm">
// // //                                                         <div className="flex items-center">
// // //                                                             <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(participant.user_role)} mr-2`}>
// // //                                                                 {participant.user_role}
// // //                                                             </span>
// // //                                                             <span>
// // //                                                                 {participant.user_id || 'Unknown User'}
// // //                                                             </span>
// // //                                                         </div>
// // //                                                         <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${participant.status === 'registered' ? 'bg-yellow-100 text-yellow-800' :
// // //                                                             participant.status === 'attended' ? 'bg-green-100 text-green-800' :
// // //                                                                 'bg-red-100 text-red-800'
// // //                                                             }`}>
// // //                                                             {participant.status}
// // //                                                         </span>
// // //                                                     </div>
// // //                                                 ))}
// // //                                             </div>
// // //                                         </div>
// // //                                     )}

// // //                                     <div className="flex justify-between pt-4 border-t border-gray-200">
// // //                                         <div className="flex space-x-2">
// // //                                             {!isUserRegistered(selectedEvent.id) &&
// // //                                                 selectedEvent.event_date >= new Date().toISOString().split('T')[0] && (
// // //                                                     <button
// // //                                                         onClick={() => registerForEvent(selectedEvent.id)}
// // //                                                         className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
// // //                                                     >
// // //                                                         Register for Event
// // //                                                     </button>
// // //                                                 )}
// // //                                             {isUserRegistered(selectedEvent.id) && (
// // //                                                 <span className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-green-800 bg-green-100">
// // //                                                     <CheckCircleIcon className="w-4 h-4 mr-2" />
// // //                                                     Registered
// // //                                                 </span>
// // //                                             )}
// // //                                         </div>

// // //                                         {(permissions.canEdit(selectedEvent) || permissions.canDelete(selectedEvent)) && (
// // //                                             <div className="flex space-x-2">
// // //                                                 {permissions.canEdit(selectedEvent) && (
// // //                                                     <button
// // //                                                         onClick={() => startEditEvent(selectedEvent)}
// // //                                                         className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
// // //                                                     >
// // //                                                         <EditIcon className="w-4 h-4 mr-2" />
// // //                                                         Edit
// // //                                                     </button>
// // //                                                 )}
// // //                                                 {permissions.canDelete(selectedEvent) && (
// // //                                                     <button
// // //                                                         onClick={() => deleteEvent(selectedEvent.id)}
// // //                                                         className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
// // //                                                     >
// // //                                                         <TrashIcon className="w-4 h-4 mr-2" />
// // //                                                         Delete
// // //                                                     </button>
// // //                                                 )}
// // //                                             </div>
// // //                                         )}
// // //                                     </div>
// // //                                 </div>
// // //                             </div>
// // //                         </div>
// // //                     </div>
// // //                 )}
// // //             </div>
// // //         </div>
// // //     );
// // // };



// // // export default EventsPage;
// // import { useState, useEffect, useCallback, useMemo } from 'react';
// // import { useAuth } from '../../context/AuthContext';
// // import { supabase } from '../../lib/supabase';
// // import {
// //     CalendarIcon,
// //     PlusIcon,
// //     FilterIcon,
// //     SearchIcon,
// //     EyeIcon,
// //     EditIcon,
// //     TrashIcon,
// //     UsersIcon,
// //     MapPinIcon,
// //     ClockIcon,
// //     UserIcon,
// //     CheckCircleIcon,
// //     XCircleIcon,
// //     XIcon,
// //     AlertCircleIcon,
// //     TrendingUpIcon,
// // } from 'lucide-react';

// // // Interfaces
// // interface Event {
// //     id: string;
// //     title: string;
// //     description: string;
// //     event_date: string;
// //     event_time: string;
// //     end_time?: string;
// //     location: string;
// //     event_type: 'academic' | 'sports' | 'cultural' | 'meeting' | 'holiday' | 'other';
// //     target_roles: ('admin' | 'teacher' | 'student' | 'parent' | 'staff')[];
// //     target_specific_users?: string[];
// //     created_by: string;
// //     created_at: string;
// //     updated_at: string;
// //     is_published: boolean;
// //     max_participants?: number;
// //     current_participants?: number;
// //     image_url?: string;
// // }

// // interface EventParticipant {
// //     id: string;
// //     event_id: string;
// //     user_id: string;
// //     user_role: string;
// //     status: 'registered' | 'attended' | 'cancelled';
// //     registered_at: string;
// // }

// // interface UserProfile {
// //     id: string;
// //     full_name: string;
// //     email: string;
// //     role: 'admin' | 'teacher' | 'student' | 'parent' | 'staff';
// //     avatar_url?: string;
// // }

// // const EventsPage: React.FC = () => {
// //     const { user, isAdmin, isTeacher, isStudent, isStaff, isParent, loading: authLoading } = useAuth();

// //     // State management
// //     const [events, setEvents] = useState<Event[]>([]);
// //     const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
// //     const [loading, setLoading] = useState(true);
// //     const [showCreateModal, setShowCreateModal] = useState(false);
// //     const [showEventModal, setShowEventModal] = useState<string | null>(null);
// //     const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
// //     const [participants, setParticipants] = useState<EventParticipant[]>([]);
// //     const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>({});

// //     // Filters and search
// //     const [searchTerm, setSearchTerm] = useState('');
// //     const [eventTypeFilter, setEventTypeFilter] = useState<Event['event_type'] | 'all'>('all');
// //     const [dateFilter, setDateFilter] = useState<'all' | 'upcoming' | 'past' | 'today'>('upcoming');
// //     const [roleFilter, setRoleFilter] = useState<'all' | string>('all');

// //     // Edit Form State
// //     const [editingEvent, setEditingEvent] = useState<Event | null>(null);
// //     const [showEditModal, setShowEditModal] = useState(false);

// //     // Form state
// //     const [eventForm, setEventForm] = useState<Partial<Event>>({
// //         title: '',
// //         description: '',
// //         event_date: new Date().toISOString().split('T')[0],
// //         event_time: '09:00',
// //         end_time: '17:00',
// //         location: '',
// //         event_type: 'academic',
// //         target_roles: [],
// //         is_published: true,
// //         max_participants: undefined,
// //         created_by: user?.name || '',
// //     });

// //     const startEditEvent = (event: Event) => {
// //         setEditingEvent(event);
// //         setEventForm({
// //             title: event.title,
// //             description: event.description,
// //             event_date: event.event_date,
// //             event_time: event.event_time,
// //             end_time: event.end_time,
// //             location: event.location,
// //             event_type: event.event_type,
// //             target_roles: event.target_roles,
// //             is_published: event.is_published,
// //             max_participants: event.max_participants,
// //             created_by: event.created_by,
// //         });
// //         setShowEditModal(true);
// //         setShowEventModal(null);
// //     };

// //     const updateEvent = async () => {
// //         if (!editingEvent) return;

// //         try {
// //             const { error } = await supabase
// //                 .from('events')
// //                 .update({
// //                     title: eventForm.title,
// //                     description: eventForm.description,
// //                     event_date: eventForm.event_date,
// //                     event_time: eventForm.event_time,
// //                     end_time: eventForm.end_time,
// //                     location: eventForm.location,
// //                     event_type: eventForm.event_type,
// //                     target_roles: eventForm.target_roles,
// //                     is_published: eventForm.is_published,
// //                     max_participants: eventForm.max_participants,
// //                     created_by: eventForm.created_by,
// //                     updated_at: new Date().toISOString(),
// //                 })
// //                 .eq('id', editingEvent.id);

// //             if (error) throw error;

// //             setShowEditModal(false);
// //             setEditingEvent(null);
// //             setEventForm({
// //                 title: '',
// //                 description: '',
// //                 event_date: new Date().toISOString().split('T')[0],
// //                 event_time: '09:00',
// //                 end_time: '17:00',
// //                 location: '',
// //                 event_type: 'academic',
// //                 target_roles: [],
// //                 is_published: true,
// //                 max_participants: undefined,
// //                 created_by: user?.name || '',
// //             });

// //             fetchEvents();
// //             alert('Event updated successfully!');
// //         } catch (error) {
// //             console.error('Error updating event:', error);
// //             alert('Error updating event. Please try again.');
// //         }
// //     };

// //     const userRole = user?.role || 'student';
// //     const userId = user?.id || '';

// //     const permissions = useMemo(() => {
// //         const canCreate = isAdmin || isTeacher || isStaff;
// //         const canEdit = (event: Event) => isAdmin || event.created_by === userId;
// //         const canDelete = (event: Event) => isAdmin || event.created_by === userId;
// //         const canViewAll = isAdmin;
// //         const canManageParticipants = isAdmin || isTeacher;

// //         return { canCreate, canEdit, canDelete, canViewAll, canManageParticipants };
// //     }, [isAdmin, isTeacher, isStaff, userId]);

// //     const fetchEvents = useCallback(async () => {
// //         if (!user) return;

// //         setLoading(true);
// //         try {
// //             let query = supabase
// //                 .from('events')
// //                 .select('*')
// //                 .eq('is_published', true);

// //             if (!isAdmin) {
// //                 query = query.contains('target_roles', [userRole]);
// //             }

// //             const { data, error } = await query.order('event_date', { ascending: true });

// //             if (error) throw error;
// //             setEvents(data || []);
// //         } catch (error) {
// //             console.error('Error fetching events:', error);
// //         } finally {
// //             setLoading(false);
// //         }
// //     }, [user, userRole, isAdmin]);

// //     const fetchParticipants = useCallback(async (eventId: string) => {
// //         try {
// //             const { data, error } = await supabase
// //                 .from('event_participants')
// //                 .select('*')
// //                 .eq('event_id', eventId);

// //             if (error) throw error;
// //             setParticipants(data || []);

// //             if (data && data.length > 0) {
// //                 const userIds = data.map(p => p.user_id);
// //                 const { data: profiles, error: profileError } = await supabase
// //                     .from('profiles')
// //                     .select('id, full_name, email, role, avatar_url')
// //                     .in('id', userIds);

// //                 if (!profileError && profiles) {
// //                     const profilesMap = profiles.reduce((acc, profile) => {
// //                         acc[profile.id] = profile;
// //                         return acc;
// //                     }, {} as Record<string, UserProfile>);
// //                     setUserProfiles(profilesMap);
// //                 }
// //             }
// //         } catch (error) {
// //             console.error('Error fetching participants:', error);
// //         }
// //     }, []);

// //     const registerForEvent = async (eventId: string) => {
// //         if (!user) {
// //             alert('Please log in to register for events');
// //             return;
// //         }

// //         try {
// //             const { error } = await supabase
// //                 .from('event_participants')
// //                 .insert({
// //                     event_id: eventId,
// //                     user_id: user?.name || '',
// //                     user_role: userRole,
// //                     status: 'registered',
// //                 });

// //             if (error) throw error;

// //             fetchEvents();
// //             if (selectedEvent) {
// //                 fetchParticipants(selectedEvent.id);
// //             }
// //             alert('Successfully registered for the event!');
// //         } catch (error) {
// //             console.error('Error registering for event:', error);
// //             alert('Error registering for event. Please try again.');
// //         }
// //     };

// //     const createEvent = async () => {
// //         if (!user) {
// //             alert('Please log in to create events');
// //             return;
// //         }

// //         try {
// //             const { error } = await supabase
// //                 .from('events')
// //                 .insert({
// //                     ...eventForm,
// //                     created_by: eventForm.created_by || user.name,
// //                 });

// //             if (error) throw error;

// //             setShowCreateModal(false);
// //             setEventForm({
// //                 title: '',
// //                 description: '',
// //                 event_date: new Date().toISOString().split('T')[0],
// //                 event_time: '09:00',
// //                 end_time: '17:00',
// //                 location: '',
// //                 event_type: 'academic',
// //                 target_roles: [],
// //                 is_published: true,
// //                 max_participants: undefined,
// //                 created_by: user.name,
// //             });

// //             fetchEvents();
// //             alert('Event created successfully!');
// //         } catch (error) {
// //             console.error('Error creating event:', error);
// //             alert('Error creating event. Please try again.');
// //         }
// //     };

// //     const deleteEvent = async (eventId: string) => {
// //         if (!confirm('Are you sure you want to delete this event?')) return;

// //         try {
// //             const { error } = await supabase
// //                 .from('events')
// //                 .delete()
// //                 .eq('id', eventId);

// //             if (error) throw error;

// //             fetchEvents();
// //             setShowEventModal(null);
// //             alert('Event deleted successfully!');
// //         } catch (error) {
// //             console.error('Error deleting event:', error);
// //             alert('Error deleting event. Please try again.');
// //         }
// //     };

// //     useEffect(() => {
// //         let filtered = events;

// //         if (searchTerm) {
// //             filtered = filtered.filter(event =>
// //                 event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //                 event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //                 event.location.toLowerCase().includes(searchTerm.toLowerCase())
// //             );
// //         }

// //         if (eventTypeFilter !== 'all') {
// //             filtered = filtered.filter(event => event.event_type === eventTypeFilter);
// //         }

// //         const today = new Date().toISOString().split('T')[0];
// //         switch (dateFilter) {
// //             case 'upcoming':
// //                 filtered = filtered.filter(event => event.event_date >= today);
// //                 break;
// //             case 'past':
// //                 filtered = filtered.filter(event => event.event_date < today);
// //                 break;
// //             case 'today':
// //                 filtered = filtered.filter(event => event.event_date === today);
// //                 break;
// //         }

// //         if (roleFilter !== 'all' && isAdmin) {
// //             filtered = filtered.filter(event => event.target_roles.includes(roleFilter as any));
// //         }

// //         setFilteredEvents(filtered);
// //     }, [events, searchTerm, eventTypeFilter, dateFilter, roleFilter, isAdmin]);

// //     useEffect(() => {
// //         if (user) {
// //             fetchEvents();
// //         }
// //     }, [user, fetchEvents]);

// //     useEffect(() => {
// //         if (user) {
// //             setEventForm(prev => ({
// //                 ...prev,
// //                 target_roles: [userRole],
// //             }));
// //         }
// //     }, [user, userRole]);

// //     if (authLoading) {
// //         return (
// //             <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
// //                 <div className="text-center">
// //                     <div className="relative">
// //                         <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
// //                         <CalendarIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-indigo-600" />
// //                     </div>
// //                     <p className="mt-4 text-gray-600 font-medium">Loading Events...</p>
// //                 </div>
// //             </div>
// //         );
// //     }

// //     if (!user) {
// //         return (
// //             <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
// //                 <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
// //                     <div className="mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
// //                         <CalendarIcon className="h-8 w-8 text-indigo-600" />
// //                     </div>
// //                     <h3 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h3>
// //                     <p className="text-gray-600">You need to be logged in to view and manage school events.</p>
// //                 </div>
// //             </div>
// //         );
// //     }

// //     const getEventTypeColor = (type: Event['event_type']) => {
// //         const colors = {
// //             academic: 'bg-blue-100 text-blue-800 border-blue-200',
// //             sports: 'bg-green-100 text-green-800 border-green-200',
// //             cultural: 'bg-purple-100 text-purple-800 border-purple-200',
// //             meeting: 'bg-orange-100 text-orange-800 border-orange-200',
// //             holiday: 'bg-red-100 text-red-800 border-red-200',
// //             other: 'bg-gray-100 text-gray-800 border-gray-200',
// //         };
// //         return colors[type];
// //     };

// //     const getEventTypeGradient = (type: Event['event_type']) => {
// //         const gradients = {
// //             academic: 'from-blue-500 to-blue-600',
// //             sports: 'from-green-500 to-green-600',
// //             cultural: 'from-purple-500 to-purple-600',
// //             meeting: 'from-orange-500 to-orange-600',
// //             holiday: 'from-red-500 to-red-600',
// //             other: 'from-gray-500 to-gray-600',
// //         };
// //         return gradients[type];
// //     };

// //     const getRoleColor = (role: string) => {
// //         const colors = {
// //             admin: 'bg-red-100 text-red-800 border-red-200',
// //             teacher: 'bg-blue-100 text-blue-800 border-blue-200',
// //             student: 'bg-green-100 text-green-800 border-green-200',
// //             parent: 'bg-purple-100 text-purple-800 border-purple-200',
// //             staff: 'bg-orange-100 text-orange-800 border-orange-200',
// //         };
// //         return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
// //     };

// //     const isUserRegistered = (eventId: string) => {
// //         return participants.some(p => p.event_id === eventId && p.user_id === userId);
// //     };

// //     const formatDate = (dateString: string) => {
// //         return new Date(dateString).toLocaleDateString('en-US', {
// //             weekday: 'long',
// //             year: 'numeric',
// //             month: 'long',
// //             day: 'numeric',
// //         });
// //     };

// //     const getEventStats = () => {
// //         const today = new Date().toISOString().split('T')[0];
// //         const upcoming = events.filter(e => e.event_date >= today).length;
// //         const today_events = events.filter(e => e.event_date === today).length;
// //         const total = events.length;

// //         return { upcoming, today: today_events, total };
// //     };

// //     const stats = getEventStats();

// //     return (
// //         <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
// //             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //                 {/* Header Section */}
// //                 <div className="mb-8">
// //                     <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
// //                         <div>
// //                             <div className="flex items-center gap-3 mb-2">
// //                                 <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
// //                                     <CalendarIcon className="h-6 w-6 text-white" />
// //                                 </div>
// //                                 <div>
// //                                     <h1 className="text-3xl font-bold text-gray-900">School Events</h1>
// //                                     <p className="text-sm text-gray-600 mt-1">
// //                                         Welcome, <span className="font-semibold text-indigo-600">{user.name}</span>! Stay updated with all activities
// //                                     </p>
// //                                 </div>
// //                             </div>
// //                         </div>

// //                         {permissions.canCreate && (
// //                             <button
// //                                 onClick={() => setShowCreateModal(true)}
// //                                 className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
// //                             >
// //                                 <PlusIcon className="w-5 h-5 mr-2" />
// //                                 Create Event
// //                             </button>
// //                         )}
// //                     </div>

// //                     {/* Stats Cards */}
// //                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
// //                         <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-5 hover:shadow-md transition-shadow">
// //                             <div className="flex items-center justify-between">
// //                                 <div>
// //                                     <p className="text-sm font-medium text-gray-600">Total Events</p>
// //                                     <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
// //                                 </div>
// //                                 <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
// //                                     <CalendarIcon className="h-6 w-6 text-indigo-600" />
// //                                 </div>
// //                             </div>
// //                         </div>

// //                         <div className="bg-white rounded-xl shadow-sm border border-green-100 p-5 hover:shadow-md transition-shadow">
// //                             <div className="flex items-center justify-between">
// //                                 <div>
// //                                     <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
// //                                     <p className="text-3xl font-bold text-gray-900 mt-1">{stats.upcoming}</p>
// //                                 </div>
// //                                 <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
// //                                     <TrendingUpIcon className="h-6 w-6 text-green-600" />
// //                                 </div>
// //                             </div>
// //                         </div>

// //                         <div className="bg-white rounded-xl shadow-sm border border-orange-100 p-5 hover:shadow-md transition-shadow">
// //                             <div className="flex items-center justify-between">
// //                                 <div>
// //                                     <p className="text-sm font-medium text-gray-600">Today's Events</p>
// //                                     <p className="text-3xl font-bold text-gray-900 mt-1">{stats.today}</p>
// //                                 </div>
// //                                 <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
// //                                     <AlertCircleIcon className="h-6 w-6 text-orange-600" />
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>

// //                 {/* Filters Section */}
// //                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
// //                     <div className="flex items-center gap-2 mb-4">
// //                         <FilterIcon className="h-5 w-5 text-gray-600" />
// //                         <h2 className="text-lg font-semibold text-gray-900">Filter Events</h2>
// //                     </div>

// //                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
// //                         {/* Search */}
// //                         <div className="lg:col-span-2">
// //                             <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
// //                                 Search Events
// //                             </label>
// //                             <div className="relative">
// //                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //                                     <SearchIcon className="h-5 w-5 text-gray-400" />
// //                                 </div>
// //                                 <input
// //                                     type="text"
// //                                     id="search"
// //                                     className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
// //                                     placeholder="Search by title, description, location..."
// //                                     value={searchTerm}
// //                                     onChange={(e) => setSearchTerm(e.target.value)}
// //                                 />
// //                             </div>
// //                         </div>

// //                         {/* Event Type Filter */}
// //                         <div>
// //                             <label htmlFor="event-type" className="block text-sm font-medium text-gray-700 mb-2">
// //                                 Event Type
// //                             </label>
// //                             <select
// //                                 id="event-type"
// //                                 className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
// //                                 value={eventTypeFilter}
// //                                 onChange={(e) => setEventTypeFilter(e.target.value as Event['event_type'] | 'all')}
// //                             >
// //                                 <option value="all">All Types</option>
// //                                 <option value="academic">Academic</option>
// //                                 <option value="sports">Sports</option>
// //                                 <option value="cultural">Cultural</option>
// //                                 <option value="meeting">Meeting</option>
// //                                 <option value="holiday">Holiday</option>
// //                                 <option value="other">Other</option>
// //                             </select>
// //                         </div>

// //                         {/* Date Filter */}
// //                         <div>
// //                             <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-2">
// //                                 Date
// //                             </label>
// //                             <select
// //                                 id="date-filter"
// //                                 className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
// //                                 value={dateFilter}
// //                                 onChange={(e) => setDateFilter(e.target.value as any)}
// //                             >
// //                                 <option value="upcoming">Upcoming</option>
// //                                 <option value="today">Today</option>
// //                                 <option value="past">Past</option>
// //                                 <option value="all">All Dates</option>
// //                             </select>
// //                         </div>

// //                         {/* Role Filter (Admin only) */}
// //                         {permissions.canViewAll && (
// //                             <div>
// //                                 <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-2">
// //                                     Target Role
// //                                 </label>
// //                                 <select
// //                                     id="role-filter"
// //                                     className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
// //                                     value={roleFilter}
// //                                     onChange={(e) => setRoleFilter(e.target.value)}
// //                                 >
// //                                     <option value="all">All Roles</option>
// //                                     <option value="admin">Admin</option>
// //                                     <option value="teacher">Teacher</option>
// //                                     <option value="student">Student</option>
// //                                     <option value="parent">Parent</option>
// //                                     <option value="staff">Staff</option>
// //                                 </select>
// //                             </div>
// //                         )}
// //                     </div>
// //                 </div>

// //                 {/* Events Grid */}
// //                 {loading ? (
// //                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                         {[1, 2, 3, 4, 5, 6].map((i) => (
// //                             <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
// //                                 <div className="animate-pulse">
// //                                     <div className="h-48 bg-gray-200"></div>
// //                                     <div className="p-6 space-y-3">
// //                                         <div className="h-4 bg-gray-200 rounded w-3/4"></div>
// //                                         <div className="h-4 bg-gray-200 rounded"></div>
// //                                         <div className="h-4 bg-gray-200 rounded w-5/6"></div>
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                         ))}
// //                     </div>
// //                 ) : filteredEvents.length === 0 ? (
// //                     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
// //                         <div className="mx-auto h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
// //                             <CalendarIcon className="h-10 w-10 text-gray-400" />
// //                         </div>
// //                         <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
// //                         <p className="text-gray-600">
// //                             {searchTerm || eventTypeFilter !== 'all' || dateFilter !== 'upcoming'
// //                                 ? 'Try changing your filters or search term.'
// //                                 : 'No events have been scheduled yet.'}
// //                         </p>
// //                     </div>
// //                 ) : (
// //                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                         {filteredEvents.map((event) => (
// //                             <div
// //                                 key={event.id}
// //                                 className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
// //                             >
// //                                 {/* Event Header with Gradient */}
// //                                 <div className={`h-2 bg-gradient-to-r ${getEventTypeGradient(event.event_type)}`}></div>

// //                                 {event.image_url && (
// //                                     <div className="relative h-48 overflow-hidden">
// //                                         <img
// //                                             src={event.image_url}
// //                                             alt={event.title}
// //                                             className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
// //                                         />
// //                                     </div>
// //                                 )}

// //                                 <div className="p-6">
// //                                     {/* Type and Roles Badges */}
// //                                     <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
// //                                         <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.event_type)}`}>
// //                                             {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
// //                                         </span>
// //                                         <div className="flex items-center gap-1 flex-wrap">
// //                                             {event.target_roles.slice(0, 2).map(role => (
// //                                                 <span
// //                                                     key={role}
// //                                                     className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getRoleColor(role)}`}
// //                                                     title={`Visible to ${role}s`}
// //                                                 >
// //                                                     <UserIcon className="w-3 h-3 mr-1" />
// //                                                     {role}
// //                                                 </span>
// //                                             ))}
// //                                             {event.target_roles.length > 2 && (
// //                                                 <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
// //                                                     +{event.target_roles.length - 2}
// //                                                 </span>
// //                                             )}
// //                                         </div>
// //                                     </div>

// //                                     {/* Event Title */}
// //                                     <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-indigo-600 transition-colors">
// //                                         {event.title}
// //                                     </h3>

// //                                     {/* Description */}
// //                                     <p className="text-gray-600 text-sm mb-4 line-clamp-2">
// //                                         {event.description}
// //                                     </p>

// //                                     {/* Event Details */}
// //                                     <div className="space-y-2 mb-5">
// //                                         <div className="flex items-center text-sm text-gray-700">
// //                                             <CalendarIcon className="w-4 h-4 mr-2 text-indigo-500 flex-shrink-0" />
// //                                             <span className="truncate">{formatDate(event.event_date)}</span>
// //                                         </div>
// //                                         <div className="flex items-center text-sm text-gray-700">
// //                                             <ClockIcon className="w-4 h-4 mr-2 text-indigo-500 flex-shrink-0" />
// //                                             {event.event_time} {event.end_time && `- ${event.end_time}`}
// //                                         </div>
// //                                         <div className="flex items-center text-sm text-gray-700">
// //                                             <MapPinIcon className="w-4 h-4 mr-2 text-indigo-500 flex-shrink-0" />
// //                                             <span className="truncate">{event.location}</span>
// //                                         </div>
// //                                         {event.max_participants && (
// //                                             <div className="flex items-center text-sm text-gray-700">
// //                                                 <UsersIcon className="w-4 h-4 mr-2 text-indigo-500 flex-shrink-0" />
// //                                                 {event.current_participants || 0} / {event.max_participants} participants
// //                                             </div>
// //                                         )}
// //                                     </div>

// //                                     {/* Action Buttons */}
// //                                     <div className="flex items-center justify-between pt-4 border-t border-gray-100">
// //                                         <button
// //                                             onClick={() => {
// //                                                 setSelectedEvent(event);
// //                                                 setShowEventModal(event.id);
// //                                                 fetchParticipants(event.id);
// //                                             }}
// //                                             className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
// //                                         >
// //                                             <EyeIcon className="w-4 h-4 mr-2" />
// //                                             View
// //                                         </button>

// //                                         {!isUserRegistered(event.id) &&
// //                                             event.event_date >= new Date().toISOString().split('T')[0] && (
// //                                                 <button
// //                                                     onClick={() => registerForEvent(event.id)}
// //                                                     className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-md transition-all"
// //                                                 >
// //                                                     Register
// //                                                 </button>
// //                                             )}

// //                                         {isUserRegistered(event.id) && (
// //                                             <span className="inline-flex items-center px-3 py-2 rounded-lg text-xs font-medium bg-green-100 text-green-800 border border-green-200">
// //                                                 <CheckCircleIcon className="w-4 h-4 mr-1" />
// //                                                 Registered
// //                                             </span>
// //                                         )}
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                         ))}
// //                     </div>
// //                 )}

// //                 {/* Create Event Modal */}
// //                 {showCreateModal && (
// //                     <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
// //                         <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
// //                             <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl z-10">
// //                                 <div className="flex items-center justify-between">
// //                                     <div className="flex items-center gap-3">
// //                                         <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
// //                                             <PlusIcon className="h-5 w-5 text-white" />
// //                                         </div>
// //                                         <h3 className="text-xl font-bold text-gray-900">Create New Event</h3>
// //                                     </div>
// //                                     <button
// //                                         onClick={() => setShowCreateModal(false)}
// //                                         className="text-gray-400 hover:text-gray-600 transition-colors"
// //                                     >
// //                                         <XIcon className="w-6 h-6" />
// //                                     </button>
// //                                 </div>
// //                             </div>

// //                             <div className="px-6 py-6 space-y-5">
// //                                 {/* Event Title */}
// //                                 <div>
// //                                     <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title *</label>
// //                                     <input
// //                                         type="text"
// //                                         className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
// //                                         placeholder="Enter event title"
// //                                         value={eventForm.title}
// //                                         onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
// //                                     />
// //                                 </div>

// //                                 {/* Description */}
// //                                 <div>
// //                                     <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
// //                                     <textarea
// //                                         className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
// //                                         rows={4}
// //                                         placeholder="Describe the event details..."
// //                                         value={eventForm.description}
// //                                         onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
// //                                     />
// //                                 </div>

// //                                 {/* Date and Time */}
// //                                 <div className="grid grid-cols-2 gap-4">
// //                                     <div>
// //                                         <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
// //                                         <input
// //                                             type="date"
// //                                             className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
// //                                             value={eventForm.event_date}
// //                                             onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
// //                                         />
// //                                     </div>

// //                                     <div>
// //                                         <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time *</label>
// //                                         <input
// //                                             type="time"
// //                                             className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
// //                                             value={eventForm.event_time}
// //                                             onChange={(e) => setEventForm({ ...eventForm, event_time: e.target.value })}
// //                                         />
// //                                     </div>
// //                                 </div>

// //                                 {/* End Time and Event Type */}
// //                                 <div className="grid grid-cols-2 gap-4">
// //                                     <div>
// //                                         <label className="block text-sm font-semibold text-gray-700 mb-2">End Time (Optional)</label>
// //                                         <input
// //                                             type="time"
// //                                             className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
// //                                             value={eventForm.end_time}
// //                                             onChange={(e) => setEventForm({ ...eventForm, end_time: e.target.value })}
// //                                         />
// //                                     </div>

// //                                     <div>
// //                                         <label className="block text-sm font-semibold text-gray-700 mb-2">Event Type *</label>
// //                                         <select
// //                                             className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
// //                                             value={eventForm.event_type}
// //                                             onChange={(e) => setEventForm({ ...eventForm, event_type: e.target.value as Event['event_type'] })}
// //                                         >
// //                                             <option value="academic">Academic</option>
// //                                             <option value="sports">Sports</option>
// //                                             <option value="cultural">Cultural</option>
// //                                             <option value="meeting">Meeting</option>
// //                                             <option value="holiday">Holiday</option>
// //                                             <option value="other">Other</option>
// //                                         </select>
// //                                     </div>
// //                                 </div>

// //                                 {/* Location */}
// //                                 <div>
// //                                     <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
// //                                     <input
// //                                         type="text"
// //                                         className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
// //                                         placeholder="Enter event location"
// //                                         value={eventForm.location}
// //                                         onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
// //                                     />
// //                                 </div>

// //                                 {/* Created By */}
// //                                 <div>
// //                                     <label className="block text-sm font-semibold text-gray-700 mb-2">Created By *</label>
// //                                     <input
// //                                         type="text"
// //                                         className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
// //                                         placeholder="Enter creator name"
// //                                         value={eventForm.created_by || ''}
// //                                         onChange={(e) => setEventForm({ ...eventForm, created_by: e.target.value })}
// //                                     />
// //                                     <p className="mt-1 text-xs text-gray-500">Name of the person creating this event</p>
// //                                 </div>

// //                                 {/* Target Roles */}
// //                                 <div>
// //                                     <label className="block text-sm font-semibold text-gray-700 mb-3">Target Roles *</label>
// //                                     <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
// //                                         {['admin', 'teacher', 'student', 'parent', 'staff'].map(role => (
// //                                             <label key={role} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
// //                                                 <input
// //                                                     type="checkbox"
// //                                                     className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
// //                                                     checked={eventForm.target_roles?.includes(role as any)}
// //                                                     onChange={(e) => {
// //                                                         const currentRoles = eventForm.target_roles || [];
// //                                                         if (e.target.checked) {
// //                                                             setEventForm({
// //                                                                 ...eventForm,
// //                                                                 target_roles: [...currentRoles, role as any],
// //                                                             });
// //                                                         } else {
// //                                                             setEventForm({
// //                                                                 ...eventForm,
// //                                                                 target_roles: currentRoles.filter(r => r !== role),
// //                                                             });
// //                                                         }
// //                                                     }}
// //                                                 />
// //                                                 <span className="ml-3 text-sm font-medium text-gray-700 capitalize">{role}</span>
// //                                             </label>
// //                                         ))}
// //                                     </div>
// //                                 </div>

// //                                 {/* Max Participants */}
// //                                 <div>
// //                                     <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                                         Maximum Participants (Optional)
// //                                     </label>
// //                                     <input
// //                                         type="number"
// //                                         min="1"
// //                                         className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
// //                                         placeholder="No limit"
// //                                         value={eventForm.max_participants || ''}
// //                                         onChange={(e) => setEventForm({
// //                                             ...eventForm,
// //                                             max_participants: e.target.value ? parseInt(e.target.value) : undefined,
// //                                         })}
// //                                     />
// //                                 </div>
// //                             </div>

// //                             {/* Modal Footer */}
// //                             <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-2xl flex justify-end gap-3">
// //                                 <button
// //                                     onClick={() => setShowCreateModal(false)}
// //                                     className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
// //                                 >
// //                                     Cancel
// //                                 </button>
// //                                 <button
// //                                     onClick={createEvent}
// //                                     className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all"
// //                                 >
// //                                     Create Event
// //                                 </button>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 )}

// //                 {/* Edit Event Modal */}
// //                 {showEditModal && editingEvent && (
// //                     <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
// //                         <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
// //                             <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl z-10">
// //                                 <div className="flex items-center justify-between">
// //                                     <div className="flex items-center gap-3">
// //                                         <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
// //                                             <EditIcon className="h-5 w-5 text-white" />
// //                                         </div>
// //                                         <h3 className="text-xl font-bold text-gray-900">Edit Event</h3>
// //                                     </div>
// //                                     <button
// //                                         onClick={() => {
// //                                             setShowEditModal(false);
// //                                             setEditingEvent(null);
// //                                         }}
// //                                         className="text-gray-400 hover:text-gray-600 transition-colors"
// //                                     >
// //                                         <XIcon className="w-6 h-6" />
// //                                     </button>
// //                                 </div>
// //                             </div>

// //                             <div className="px-6 py-6 space-y-5">
// //                                 {/* Same form fields as Create Modal */}
// //                                 <div>
// //                                     <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title *</label>
// //                                     <input
// //                                         type="text"
// //                                         className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
// //                                         value={eventForm.title}
// //                                         onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
// //                                     />
// //                                 </div>

// //                                 <div>
// //                                     <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
// //                                     <textarea
// //                                         className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
// //                                         rows={4}
// //                                         value={eventForm.description}
// //                                         onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
// //                                     />
// //                                 </div>

// //                                 <div className="grid grid-cols-2 gap-4">
// //                                     <div>
// //                                         <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
// //                                         <input
// //                                             type="date"
// //                                             className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
// //                                             value={eventForm.event_date}
// //                                             onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
// //                                         />
// //                                     </div>

// //                                     <div>
// //                                         <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time *</label>
// //                                         <input
// //                                             type="time"
// //                                             className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
// //                                             value={eventForm.event_time}
// //                                             onChange={(e) => setEventForm({ ...eventForm, event_time: e.target.value })}
// //                                         />
// //                                     </div>
// //                                 </div>

// //                                 <div className="grid grid-cols-2 gap-4">
// //                                     <div>
// //                                         <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
// //                                         <input
// //                                             type="time"
// //                                             className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
// //                                             value={eventForm.end_time}
// //                                             onChange={(e) => setEventForm({ ...eventForm, end_time: e.target.value })}
// //                                         />
// //                                     </div>

// //                                     <div>
// //                                         <label className="block text-sm font-semibold text-gray-700 mb-2">Event Type *</label>
// //                                         <select
// //                                             className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
// //                                             value={eventForm.event_type}
// //                                             onChange={(e) => setEventForm({ ...eventForm, event_type: e.target.value as Event['event_type'] })}
// //                                         >
// //                                             <option value="academic">Academic</option>
// //                                             <option value="sports">Sports</option>
// //                                             <option value="cultural">Cultural</option>
// //                                             <option value="meeting">Meeting</option>
// //                                             <option value="holiday">Holiday</option>
// //                                             <option value="other">Other</option>
// //                                         </select>
// //                                     </div>
// //                                 </div>

// //                                 <div>
// //                                     <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
// //                                     <input
// //                                         type="text"
// //                                         className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
// //                                         value={eventForm.location}
// //                                         onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
// //                                     />
// //                                 </div>

// //                                 <div>
// //                                     <label className="block text-sm font-semibold text-gray-700 mb-2">Created By *</label>
// //                                     <input
// //                                         type="text"
// //                                         className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
// //                                         value={eventForm.created_by || ''}
// //                                         onChange={(e) => setEventForm({ ...eventForm, created_by: e.target.value })}
// //                                     />
// //                                 </div>

// //                                 <div>
// //                                     <label className="block text-sm font-semibold text-gray-700 mb-3">Target Roles *</label>
// //                                     <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
// //                                         {['admin', 'teacher', 'student', 'parent', 'staff'].map(role => (
// //                                             <label key={role} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
// //                                                 <input
// //                                                     type="checkbox"
// //                                                     className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
// //                                                     checked={eventForm.target_roles?.includes(role as any)}
// //                                                     onChange={(e) => {
// //                                                         const currentRoles = eventForm.target_roles || [];
// //                                                         if (e.target.checked) {
// //                                                             setEventForm({
// //                                                                 ...eventForm,
// //                                                                 target_roles: [...currentRoles, role as any],
// //                                                             });
// //                                                         } else {
// //                                                             setEventForm({
// //                                                                 ...eventForm,
// //                                                                 target_roles: currentRoles.filter(r => r !== role),
// //                                                             });
// //                                                         }
// //                                                     }}
// //                                                 />
// //                                                 <span className="ml-3 text-sm font-medium text-gray-700 capitalize">{role}</span>
// //                                             </label>
// //                                         ))}
// //                                     </div>
// //                                 </div>

// //                                 <div>
// //                                     <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Participants</label>
// //                                     <input
// //                                         type="number"
// //                                         min="1"
// //                                         className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
// //                                         value={eventForm.max_participants || ''}
// //                                         onChange={(e) => setEventForm({
// //                                             ...eventForm,
// //                                             max_participants: e.target.value ? parseInt(e.target.value) : undefined,
// //                                         })}
// //                                     />
// //                                 </div>

// //                                 <div>
// //                                     <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
// //                                         <input
// //                                             type="checkbox"
// //                                             className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
// //                                             checked={eventForm.is_published}
// //                                             onChange={(e) => setEventForm({
// //                                                 ...eventForm,
// //                                                 is_published: e.target.checked
// //                                             })}
// //                                         />
// //                                         <div>
// //                                             <span className="text-sm font-semibold text-gray-700">Published</span>
// //                                             <p className="text-xs text-gray-500">Make this event visible to users</p>
// //                                         </div>
// //                                     </label>
// //                                 </div>
// //                             </div>

// //                             <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-2xl flex justify-end gap-3">
// //                                 <button
// //                                     onClick={() => {
// //                                         setShowEditModal(false);
// //                                         setEditingEvent(null);
// //                                     }}
// //                                     className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
// //                                 >
// //                                     Cancel
// //                                 </button>
// //                                 <button
// //                                     onClick={updateEvent}
// //                                     className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all"
// //                                 >
// //                                     Update Event
// //                                 </button>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 )}

// //                 {/* Event Details Modal */}
// //                 {showEventModal && selectedEvent && (
// //                     <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
// //                         <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
// //                             {/* Modal Header */}
// //                             <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-2xl z-10">
// //                                 <div className={`h-32 bg-gradient-to-r ${getEventTypeGradient(selectedEvent.event_type)} rounded-t-2xl`}></div>
// //                                 <div className="px-6 pb-4 -mt-12">
// //                                     <div className="flex items-start justify-between">
// //                                         <div className="h-20 w-20 bg-white rounded-xl shadow-lg flex items-center justify-center border-4 border-white">
// //                                             <CalendarIcon className={`h-10 w-10 bg-gradient-to-r ${getEventTypeGradient(selectedEvent.event_type)} bg-clip-text text-transparent`} />
// //                                         </div>
// //                                         <button
// //                                             onClick={() => {
// //                                                 setShowEventModal(null);
// //                                                 setSelectedEvent(null);
// //                                             }}
// //                                             className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
// //                                         >
// //                                             <XIcon className="w-5 h-5 text-gray-600" />
// //                                         </button>
// //                                     </div>
// //                                     <h3 className="text-2xl font-bold text-gray-900 mt-4">{selectedEvent.title}</h3>
// //                                 </div>
// //                             </div>

// //                             <div className="px-6 py-6 space-y-6">
// //                                 {/* Badges */}
// //                                 <div className="flex items-center flex-wrap gap-2">
// //                                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(selectedEvent.event_type)}`}>
// //                                         {selectedEvent.event_type.charAt(0).toUpperCase() + selectedEvent.event_type.slice(1)}
// //                                     </span>
// //                                     {selectedEvent.target_roles.map(role => (
// //                                         <span
// //                                             key={role}
// //                                             className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(role)}`}
// //                                         >
// //                                             <UserIcon className="w-3 h-3 mr-1" />
// //                                             {role}
// //                                         </span>
// //                                     ))}
// //                                 </div>

// //                                 {/* Description */}
// //                                 <div>
// //                                     <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
// //                                     <p className="text-gray-600 leading-relaxed">{selectedEvent.description}</p>
// //                                 </div>

// //                                 {/* Event Details Grid */}
// //                                 <div className="bg-gray-50 rounded-xl p-4 space-y-3">
// //                                     <div className="flex items-center gap-3">
// //                                         <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
// //                                             <CalendarIcon className="h-5 w-5 text-indigo-600" />
// //                                         </div>
// //                                         <div>
// //                                             <p className="text-xs text-gray-500 font-medium">Date</p>
// //                                             <p className="text-sm font-semibold text-gray-900">{formatDate(selectedEvent.event_date)}</p>
// //                                         </div>
// //                                     </div>

// //                                     <div className="flex items-center gap-3">
// //                                         <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
// //                                             <ClockIcon className="h-5 w-5 text-purple-600" />
// //                                         </div>
// //                                         <div>
// //                                             <p className="text-xs text-gray-500 font-medium">Time</p>
// //                                             <p className="text-sm font-semibold text-gray-900">
// //                                                 {selectedEvent.event_time} {selectedEvent.end_time && `- ${selectedEvent.end_time}`}
// //                                             </p>
// //                                         </div>
// //                                     </div>

// //                                     <div className="flex items-center gap-3">
// //                                         <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
// //                                             <MapPinIcon className="h-5 w-5 text-green-600" />
// //                                         </div>
// //                                         <div>
// //                                             <p className="text-xs text-gray-500 font-medium">Location</p>
// //                                             <p className="text-sm font-semibold text-gray-900">{selectedEvent.location}</p>
// //                                         </div>
// //                                     </div>
// //                                 </div>

// //                                 {/* Participants Section */}
// //                                 {permissions.canManageParticipants && participants.length > 0 && (
// //                                     <div>
// //                                         <h4 className="text-sm font-semibold text-gray-900 mb-3">
// //                                             Participants ({participants.length})
// //                                         </h4>
// //                                         <div className="space-y-2 max-h-48 overflow-y-auto">
// //                                             {participants.map(participant => (
// //                                                 <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
// //                                                     <div className="flex items-center gap-3">
// //                                                         <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
// //                                                             <UserIcon className="h-5 w-5 text-white" />
// //                                                         </div>
// //                                                         <div>
// //                                                             <p className="text-sm font-medium text-gray-900">
// //                                                                 {userProfiles[participant.user_id]?.full_name || participant.user_id}
// //                                                             </p>
// //                                                             <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${getRoleColor(participant.user_role)}`}>
// //                                                                 {participant.user_role}
// //                                                             </span>
// //                                                         </div>
// //                                                     </div>
// //                                                     <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
// //                                                         participant.status === 'registered' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
// //                                                         participant.status === 'attended' ? 'bg-green-100 text-green-800 border border-green-200' :
// //                                                         'bg-red-100 text-red-800 border border-red-200'
// //                                                     }`}>
// //                                                         {participant.status}
// //                                                     </span>
// //                                                 </div>
// //                                             ))}
// //                                         </div>
// //                                     </div>
// //                                 )}
// //                             </div>

// //                             {/* Modal Footer */}
// //                             <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-2xl flex items-center justify-between">
// //                                 <div>
// //                                     {!isUserRegistered(selectedEvent.id) &&
// //                                         selectedEvent.event_date >= new Date().toISOString().split('T')[0] && (
// //                                             <button
// //                                                 onClick={() => registerForEvent(selectedEvent.id)}
// //                                                 className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all"
// //                                             >
// //                                                 <CheckCircleIcon className="w-4 h-4 mr-2" />
// //                                                 Register for Event
// //                                             </button>
// //                                         )}
// //                                     {isUserRegistered(selectedEvent.id) && (
// //                                         <span className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-800 border border-green-200">
// //                                             <CheckCircleIcon className="w-5 h-5 mr-2" />
// //                                             Already Registered
// //                                         </span>
// //                                     )}
// //                                 </div>

// //                                 {(permissions.canEdit(selectedEvent) || permissions.canDelete(selectedEvent)) && (
// //                                     <div className="flex gap-2">
// //                                         {permissions.canEdit(selectedEvent) && (
// //                                             <button
// //                                                 onClick={() => startEditEvent(selectedEvent)}
// //                                                 className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
// //                                             >
// //                                                 <EditIcon className="w-4 h-4 mr-2" />
// //                                                 Edit
// //                                             </button>
// //                                         )}
// //                                         {permissions.canDelete(selectedEvent) && (
// //                                             <button
// //                                                 onClick={() => deleteEvent(selectedEvent.id)}
// //                                                 className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
// //                                             >
// //                                                 <TrashIcon className="w-4 h-4 mr-2" />
// //                                                 Delete
// //                                             </button>
// //                                         )}
// //                                     </div>
// //                                 )}
// //                             </div>
// //                         </div>
// //                     </div>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // };

// // export default EventsPage;
// import { useState, useEffect, useCallback, useMemo } from 'react';
// import { motion } from 'framer-motion';
// import { useAuth } from '../../context/AuthContext';
// import { supabase } from '../../lib/supabase';
// import {
//     Calendar as CalendarIcon,
//     Plus,
//     Filter,
//     Search,
//     Eye,
//     Edit,
//     Trash,
//     Users as UsersIcon,
//     MapPin,
//     Clock,
//     User as UserIcon,
//     CheckCircle,
//     XCircle,
//     X,
//     AlertCircle,
//     TrendingUp,
//     ChevronLeft,
//     ChevronRight,
// } from 'lucide-react';

// // Interfaces
// interface Event {
//     id: string;
//     title: string;
//     description: string;
//     event_date: string;
//     event_time: string;
//     end_time?: string;
//     location: string;
//     event_type: 'academic' | 'sports' | 'cultural' | 'meeting' | 'holiday' | 'other';
//     target_roles: ('admin' | 'teacher' | 'student' | 'parent' | 'staff')[];
//     target_specific_users?: string[];
//     created_by: string;
//     created_at: string;
//     updated_at: string;
//     is_published: boolean;
//     max_participants?: number;
//     current_participants?: number;
//     image_url?: string;
// }

// interface EventParticipant {
//     id: string;
//     event_id: string;
//     user_id: string;
//     user_role: string;
//     status: 'registered' | 'attended' | 'cancelled';
//     registered_at: string;
// }

// interface UserProfile {
//     id: string;
//     full_name: string;
//     email: string;
//     role: 'admin' | 'teacher' | 'student' | 'parent' | 'staff';
//     avatar_url?: string;
// }

// // Event type configuration
// const eventConfig = {
//     meeting: { icon: '👥', label: 'Meeting', color: '#1E88E5', colorLight: '#1E88E515' },
//     academic: { icon: '🎓', label: 'Academic', color: '#7B1FA2', colorLight: '#7B1FA215' },
//     sports: { icon: '⚽', label: 'Sports', color: '#43A047', colorLight: '#43A04715' },
//     cultural: { icon: '🎭', label: 'Cultural', color: '#F57C00', colorLight: '#F57C0015' },
//     holiday: { icon: '📝', label: 'Exam', color: '#E53935', colorLight: '#E5393515' },
//     other: { icon: '💡', label: 'Workshop', color: '#5B9FFF', colorLight: '#5B9FFF15' },
// };

// const EventsPage: React.FC = () => {
//     const { user, isAdmin, isTeacher, isStudent, isStaff, isParent, loading: authLoading } = useAuth();

//     // State management
//     const [events, setEvents] = useState<Event[]>([]);
//     const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [showCreateModal, setShowCreateModal] = useState(false);
//     const [showEventModal, setShowEventModal] = useState<string | null>(null);
//     const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
//     const [participants, setParticipants] = useState<EventParticipant[]>([]);
//     const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>({});

//     // Calendar state
//     const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 6)); // Nov 6, 2025

//     // Filters and search
//     const [searchTerm, setSearchTerm] = useState('');
//     const [eventTypeFilter, setEventTypeFilter] = useState<Event['event_type'] | 'all'>('all');
//     const [dateFilter, setDateFilter] = useState<'all' | 'upcoming' | 'past' | 'today'>('upcoming');
//     const [roleFilter, setRoleFilter] = useState<'all' | string>('all');

//     // Edit Form State
//     const [editingEvent, setEditingEvent] = useState<Event | null>(null);
//     const [showEditModal, setShowEditModal] = useState(false);

//     // Form state
//     const [eventForm, setEventForm] = useState<Partial<Event>>({
//         title: '',
//         description: '',
//         event_date: new Date().toISOString().split('T')[0],
//         event_time: '09:00',
//         end_time: '17:00',
//         location: '',
//         event_type: 'academic',
//         target_roles: [],
//         is_published: true,
//         max_participants: undefined,
//         created_by: user?.username || '',
//     });

//     const startEditEvent = (event: Event) => {
//         setEditingEvent(event);
//         setEventForm({
//             title: event.title,
//             description: event.description,
//             event_date: event.event_date,
//             event_time: event.event_time,
//             end_time: event.end_time,
//             location: event.location,
//             event_type: event.event_type,
//             target_roles: event.target_roles,
//             is_published: event.is_published,
//             max_participants: event.max_participants,
//             created_by: event.created_by,
//         });
//         setShowEditModal(true);
//         setShowEventModal(null);
//     };

//     const updateEvent = async () => {
//         if (!editingEvent) return;

//         try {
//             const { error } = await supabase
//                 .from('events')
//                 .update({
//                     title: eventForm.title,
//                     description: eventForm.description,
//                     event_date: eventForm.event_date,
//                     event_time: eventForm.event_time,
//                     end_time: eventForm.end_time,
//                     location: eventForm.location,
//                     event_type: eventForm.event_type,
//                     target_roles: eventForm.target_roles,
//                     is_published: eventForm.is_published,
//                     max_participants: eventForm.max_participants,
//                     created_by: eventForm.created_by,
//                     updated_at: new Date().toISOString(),
//                 })
//                 .eq('id', editingEvent.id);

//             if (error) throw error;

//             setShowEditModal(false);
//             setEditingEvent(null);
//             setEventForm({
//                 title: '',
//                 description: '',
//                 event_date: new Date().toISOString().split('T')[0],
//                 event_time: '09:00',
//                 end_time: '17:00',
//                 location: '',
//                 event_type: 'academic',
//                 target_roles: [],
//                 is_published: true,
//                 max_participants: undefined,
//                 created_by: user?.username || '',
//             });

//             fetchEvents();
//             alert('Event updated successfully!');
//         } catch (error) {
//             console.error('Error updating event:', error);
//             alert('Error updating event. Please try again.');
//         }
//     };

//     const userRole = user?.role || 'student';
//     const userId = user?.id || '';

//     const permissions = useMemo(() => {
//         const canCreate = isAdmin || isTeacher || isStaff;
//         const canEdit = (event: Event) => isAdmin || event.created_by === userId;
//         const canDelete = (event: Event) => isAdmin || event.created_by === userId;
//         const canViewAll = isAdmin;
//         const canManageParticipants = isAdmin || isTeacher;

//         return { canCreate, canEdit, canDelete, canViewAll, canManageParticipants };
//     }, [isAdmin, isTeacher, isStaff, userId]);

//     const fetchEvents = useCallback(async () => {
//         if (!user) return;

//         setLoading(true);
//         try {
//             let query = supabase
//                 .from('events')
//                 .select('*')
//                 .eq('is_published', true);

//             if (!isAdmin) {
//                 query = query.contains('target_roles', [userRole]);
//             }

//             const { data, error } = await query.order('event_date', { ascending: true });

//             if (error) throw error;
//             setEvents(data || []);
//         } catch (error) {
//             console.error('Error fetching events:', error);
//         } finally {
//             setLoading(false);
//         }
//     }, [user, userRole, isAdmin]);

//     const fetchParticipants = useCallback(async (eventId: string) => {
//         try {
//             const { data, error } = await supabase
//                 .from('event_participants')
//                 .select('*')
//                 .eq('event_id', eventId);

//             if (error) throw error;
//             setParticipants(data || []);

//             if (data && data.length > 0) {
//                 const userIds = data.map(p => p.user_id);
//                 const { data: profiles, error: profileError } = await supabase
//                     .from('profiles')
//                     .select('id, full_name, email, role, avatar_url')
//                     .in('id', userIds);

//                 if (!profileError && profiles) {
//                     const profilesMap = profiles.reduce((acc, profile) => {
//                         acc[profile.id] = profile;
//                         return acc;
//                     }, {} as Record<string, UserProfile>);
//                     setUserProfiles(profilesMap);
//                 }
//             }
//         } catch (error) {
//             console.error('Error fetching participants:', error);
//         }
//     }, []);

//     const registerForEvent = async (eventId: string) => {
//         if (!user) {
//             alert('Please log in to register for events');
//             return;
//         }

//         try {
//             const { error } = await supabase
//                 .from('event_participants')
//                 .insert({
//                     event_id: eventId,
//                     user_id: user.username || '',
//                     user_role: userRole,
//                     status: 'registered',
//                 });

//             if (error) throw error;

//             fetchEvents();
//             if (selectedEvent) {
//                 fetchParticipants(selectedEvent.id);
//             }
//             alert('Successfully registered for the event!');
//         } catch (error) {
//             console.error('Error registering for event:', error);
//             alert('Error registering for event. Please try again.');
//         }
//     };

//     const createEvent = async () => {
//         if (!user) {
//             alert('Please log in to create events');
//             return;
//         }

//         try {
//             const { error } = await supabase
//                 .from('events')
//                 .insert({
//                     ...eventForm,
//                     created_by: eventForm.created_by || user.username,
//                 });

//             if (error) throw error;

//             setShowCreateModal(false);
//             setEventForm({
//                 title: '',
//                 description: '',
//                 event_date: new Date().toISOString().split('T')[0],
//                 event_time: '09:00',
//                 end_time: '17:00',
//                 location: '',
//                 event_type: 'academic',
//                 target_roles: [],
//                 is_published: true,
//                 max_participants: undefined,
//                 created_by: user.username,
//             });

//             fetchEvents();
//             alert('Event created successfully!');
//         } catch (error) {
//             console.error('Error creating event:', error);
//             alert('Error creating event. Please try again.');
//         }
//     };

//     const deleteEvent = async (eventId: string) => {
//         if (!confirm('Are you sure you want to delete this event?')) return;

//         try {
//             const { error } = await supabase
//                 .from('events')
//                 .delete()
//                 .eq('id', eventId);

//             if (error) throw error;

//             fetchEvents();
//             setShowEventModal(null);
//             alert('Event deleted successfully!');
//         } catch (error) {
//             console.error('Error deleting event:', error);
//             alert('Error deleting event. Please try again.');
//         }
//     };

//     useEffect(() => {
//         let filtered = events;

//         if (searchTerm) {
//             filtered = filtered.filter(event =>
//                 event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 event.location.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//         }

//         if (eventTypeFilter !== 'all') {
//             filtered = filtered.filter(event => event.event_type === eventTypeFilter);
//         }

//         const today = new Date().toISOString().split('T')[0];
//         switch (dateFilter) {
//             case 'upcoming':
//                 filtered = filtered.filter(event => event.event_date >= today);
//                 break;
//             case 'past':
//                 filtered = filtered.filter(event => event.event_date < today);
//                 break;
//             case 'today':
//                 filtered = filtered.filter(event => event.event_date === today);
//                 break;
//         }

//         if (roleFilter !== 'all' && isAdmin) {
//             filtered = filtered.filter(event => event.target_roles.includes(roleFilter as any));
//         }

//         setFilteredEvents(filtered);
//     }, [events, searchTerm, eventTypeFilter, dateFilter, roleFilter, isAdmin]);

//     useEffect(() => {
//         if (user) {
//             fetchEvents();
//         }
//     }, [user, fetchEvents]);

//     useEffect(() => {
//         if (user) {
//             setEventForm(prev => ({
//                 ...prev,
//                 target_roles: [userRole],
//             }));
//         }
//     }, [user, userRole]);

//     // Calendar calculations
//     const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
//     const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

//     const isUserRegistered = (eventId: string) => {
//         return participants.some(p => p.event_id === eventId && p.user_id === userId);
//     };

//     const formatDate = (dateString: string) => {
//         return new Date(dateString).toLocaleDateString('en-US', {
//             month: 'short',
//             day: 'numeric',
//             year: 'numeric',
//         });
//     };

//     if (authLoading || loading) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="relative">
//                         <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
//                         <CalendarIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-indigo-600" />
//                     </div>
//                     <p className="mt-4 text-gray-600 font-medium">Loading Events...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (!user) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
//                 <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
//                     <div className="mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
//                         <CalendarIcon className="h-8 w-8 text-indigo-600" />
//                     </div>
//                     <h3 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h3>
//                     <p className="text-gray-600">You need to be logged in to view and manage school events.</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="p-8 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
//             {/* Header */}
//             <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="flex items-center justify-between"
//             >
//                 <div>
//                     <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
//                         Events
//                     </h1>
//                     <p className="text-gray-600">School calendar and upcoming events</p>
//                 </div>
//                 {permissions.canCreate && (
//                     <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={() => setShowCreateModal(true)}
//                         className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl rounded-xl h-11 px-6 gap-2 flex items-center transition-all duration-300"
//                     >
//                         <Plus className="w-5 h-5" />
//                         Add Event
//                     </motion.button>
//                 )}
//             </motion.div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Calendar */}
//                 <motion.div
//                     initial={{ opacity: 0, x: -40 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.1 }}
//                     className="lg:col-span-2 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50"
//                 >
//                     <div className="flex items-center justify-between mb-6">
//                         <h3 className="text-xl font-semibold text-gray-800">
//                             {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
//                         </h3>
//                         <div className="flex gap-2">
//                             <button
//                                 onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
//                                 className="p-2 rounded-xl hover:bg-white/60 transition-colors"
//                             >
//                                 <ChevronLeft className="w-5 h-5" />
//                             </button>
//                             <button
//                                 onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
//                                 className="p-2 rounded-xl hover:bg-white/60 transition-colors"
//                             >
//                                 <ChevronRight className="w-5 h-5" />
//                             </button>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-7 gap-2">
//                         {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
//                             <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
//                                 {day}
//                             </div>
//                         ))}
//                         {Array.from({ length: firstDayOfMonth }).map((_, index) => (
//                             <div key={`empty-${index}`} className="aspect-square"></div>
//                         ))}
//                         {Array.from({ length: daysInMonth }).map((_, index) => {
//                             const day = index + 1;
//                             const dateStr = `2025-11-${day.toString().padStart(2, '0')}`;
//                             const hasEvent = events.some(event => event.event_date === dateStr);
//                             const isToday = day === 6;

//                             return (
//                                 <motion.div
//                                     key={day}
//                                     whileHover={{ scale: 1.05, y: -2 }}
//                                     className={`
//                                         aspect-square rounded-xl flex items-center justify-center text-sm cursor-pointer
//                                         transition-all duration-300 relative
//                                         ${isToday
//                                             ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg font-semibold'
//                                             : hasEvent
//                                                 ? 'bg-white text-indigo-600 shadow-md font-medium'
//                                                 : 'bg-white/40 text-gray-700 hover:bg-white/80'
//                                         }
//                                     `}
//                                 >
//                                     {day}
//                                     {hasEvent && !isToday && (
//                                         <div className="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-600"></div>
//                                     )}
//                                 </motion.div>
//                             );
//                         })}
//                     </div>
//                 </motion.div>

//                 {/* Event Types */}
//                 <motion.div
//                     initial={{ opacity: 0, x: 40 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.2 }}
//                     className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50"
//                 >
//                     <h3 className="text-xl font-semibold text-gray-800 mb-4">Event Types</h3>
//                     <div className="space-y-3">
//                         {Object.entries(eventConfig).map(([type, config], index) => {
//                             const count = events.filter(e => e.event_type === type).length;
//                             return (
//                                 <motion.div
//                                     key={type}
//                                     initial={{ opacity: 0, x: 20 }}
//                                     animate={{ opacity: 1, x: 0 }}
//                                     transition={{ delay: 0.3 + index * 0.05 }}
//                                     whileHover={{ x: 4 }}
//                                     className="flex items-center justify-between p-3 rounded-xl bg-white/60 hover:bg-white transition-all duration-300 cursor-pointer"
//                                 >
//                                     <div className="flex items-center gap-3">
//                                         <span className="text-2xl">{config.icon}</span>
//                                         <span className="font-medium text-gray-700 capitalize">{config.label}</span>
//                                     </div>
//                                     <span
//                                         className="px-3 py-1 rounded-full text-sm font-semibold"
//                                         style={{
//                                             backgroundColor: config.colorLight,
//                                             color: config.color,
//                                             border: `1px solid ${config.color}20`
//                                         }}
//                                     >
//                                         {count}
//                                     </span>
//                                 </motion.div>
//                             );
//                         })}
//                     </div>
//                 </motion.div>
//             </div>

//             {/* Upcoming Events */}
//             <motion.div
//                 initial={{ opacity: 0, y: 40 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//             >
//                 <h3 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Events</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {filteredEvents.map((event, index) => {
//                         const config = eventConfig[event.event_type as keyof typeof eventConfig] || eventConfig.other;
//                         return (
//                             <motion.div
//                                 key={event.id}
//                                 initial={{ opacity: 0, scale: 0.9 }}
//                                 animate={{ opacity: 1, scale: 1 }}
//                                 transition={{ delay: 0.4 + index * 0.05 }}
//                                 whileHover={{ y: -6, scale: 1.02 }}
//                                 className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer relative overflow-hidden border border-white/50"
//                             >
//                                 <div
//                                     className="absolute top-0 left-0 right-0 h-1"
//                                     style={{ background: config.color }}
//                                 ></div>

//                                 <div className="flex items-start gap-3 mb-4">
//                                     <div
//                                         className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
//                                         style={{ backgroundColor: config.colorLight }}
//                                     >
//                                         {config.icon}
//                                     </div>
//                                     <div className="flex-1 min-w-0">
//                                         <h4 className="text-lg font-semibold text-gray-800 mb-1 truncate">{event.title}</h4>
//                                         <span
//                                             className="text-xs px-3 py-1 rounded-full font-medium capitalize"
//                                             style={{
//                                                 backgroundColor: config.colorLight,
//                                                 color: config.color,
//                                             }}
//                                         >
//                                             {config.label}
//                                         </span>
//                                     </div>
//                                 </div>

//                                 <div className="space-y-2">
//                                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                                         <CalendarIcon className="w-4 h-4" style={{ color: config.color }} />
//                                         <span>{formatDate(event.event_date)}</span>
//                                     </div>
//                                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                                         <Clock className="w-4 h-4" style={{ color: config.color }} />
//                                         <span>{event.event_time}</span>
//                                     </div>
//                                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                                         <MapPin className="w-4 h-4" style={{ color: config.color }} />
//                                         <span className="truncate">{event.location}</span>
//                                     </div>
//                                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                                         <UsersIcon className="w-4 h-4" style={{ color: config.color }} />
//                                         <span>{event.max_participants || 'Unlimited'} Expected</span>
//                                     </div>
//                                 </div>

//                                 <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
//                                     <button
//                                         onClick={() => {
//                                             setSelectedEvent(event);
//                                             setShowEventModal(event.id);
//                                             fetchParticipants(event.id);
//                                         }}
//                                         className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
//                                     >
//                                         <Eye className="w-4 h-4" />
//                                         View
//                                     </button>
//                                     {permissions.canEdit(event) && (
//                                         <button
//                                             onClick={() => startEditEvent(event)}
//                                             className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
//                                         >
//                                             <Edit className="w-4 h-4" />
//                                         </button>
//                                     )}
//                                     {permissions.canDelete(event) && (
//                                         <button
//                                             onClick={() => deleteEvent(event.id)}
//                                             className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
//                                         >
//                                             <Trash className="w-4 h-4" />
//                                         </button>
//                                     )}
//                                 </div>
//                             </motion.div>
//                         );
//                     })}
//                 </div>
//             </motion.div>

//             {/* Create Event Modal */}
//             {showCreateModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
//                     <motion.div
//                         initial={{ opacity: 0, scale: 0.9 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
//                     >
//                         <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl z-10">
//                             <div className="flex items-center justify-between">
//                                 <div className="flex items-center gap-3">
//                                     <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
//                                         <Plus className="h-5 w-5 text-white" />
//                                     </div>
//                                     <h3 className="text-xl font-bold text-gray-900">Create New Event</h3>
//                                 </div>
//                                 <button
//                                     onClick={() => setShowCreateModal(false)}
//                                     className="text-gray-400 hover:text-gray-600 transition-colors"
//                                 >
//                                     <X className="w-6 h-6" />
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="px-6 py-6 space-y-5">
//                             <div>
//                                 <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title *</label>
//                                 <input
//                                     type="text"
//                                     className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                                     placeholder="Enter event title"
//                                     value={eventForm.title}
//                                     onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
//                                 <textarea
//                                     className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
//                                     rows={4}
//                                     placeholder="Describe the event details..."
//                                     value={eventForm.description}
//                                     onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
//                                 />
//                             </div>

//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
//                                     <input
//                                         type="date"
//                                         className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                                         value={eventForm.event_date}
//                                         onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time *</label>
//                                     <input
//                                         type="time"
//                                         className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                                         value={eventForm.event_time}
//                                         onChange={(e) => setEventForm({ ...eventForm, event_time: e.target.value })}
//                                     />
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">End Time (Optional)</label>
//                                     <input
//                                         type="time"
//                                         className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                                         value={eventForm.end_time}
//                                         onChange={(e) => setEventForm({ ...eventForm, end_time: e.target.value })}
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">Event Type *</label>
//                                     <select
//                                         className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                                         value={eventForm.event_type}
//                                         onChange={(e) => setEventForm({ ...eventForm, event_type: e.target.value as Event['event_type'] })}
//                                     >
//                                         <option value="academic">Academic</option>
//                                         <option value="sports">Sports</option>
//                                         <option value="cultural">Cultural</option>
//                                         <option value="meeting">Meeting</option>
//                                         <option value="holiday">Holiday</option>
//                                         <option value="other">Other</option>
//                                     </select>
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
//                                 <input
//                                     type="text"
//                                     className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                                     placeholder="Enter event location"
//                                     value={eventForm.location}
//                                     onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-semibold text-gray-700 mb-2">Created By *</label>
//                                 <input
//                                     type="text"
//                                     className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                                     placeholder="Enter creator name"
//                                     value={eventForm.created_by || ''}
//                                     onChange={(e) => setEventForm({ ...eventForm, created_by: e.target.value })}
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-semibold text-gray-700 mb-3">Target Roles *</label>
//                                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                                     {['admin', 'teacher', 'student', 'parent', 'staff'].map(role => (
//                                         <label key={role} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
//                                             <input
//                                                 type="checkbox"
//                                                 className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
//                                                 checked={eventForm.target_roles?.includes(role as any)}
//                                                 onChange={(e) => {
//                                                     const currentRoles = eventForm.target_roles || [];
//                                                     if (e.target.checked) {
//                                                         setEventForm({
//                                                             ...eventForm,
//                                                             target_roles: [...currentRoles, role as any],
//                                                         });
//                                                     } else {
//                                                         setEventForm({
//                                                             ...eventForm,
//                                                             target_roles: currentRoles.filter(r => r !== role),
//                                                         });
//                                                     }
//                                                 }}
//                                             />
//                                             <span className="ml-3 text-sm font-medium text-gray-700 capitalize">{role}</span>
//                                         </label>
//                                     ))}
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                     Maximum Participants (Optional)
//                                 </label>
//                                 <input
//                                     type="number"
//                                     min="1"
//                                     className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                                     placeholder="No limit"
//                                     value={eventForm.max_participants || ''}
//                                     onChange={(e) => setEventForm({
//                                         ...eventForm,
//                                         max_participants: e.target.value ? parseInt(e.target.value) : undefined,
//                                     })}
//                                 />
//                             </div>
//                         </div>

//                         <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-2xl flex justify-end gap-3">
//                             <button
//                                 onClick={() => setShowCreateModal(false)}
//                                 className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={createEvent}
//                                 className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all"
//                             >
//                                 Create Event
//                             </button>
//                         </div>
//                     </motion.div>
//                 </div>
//             )}

//             {/* Edit Event Modal - Similar structure to Create Modal */}
//             {showEditModal && editingEvent && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
//                     <motion.div
//                         initial={{ opacity: 0, scale: 0.9 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
//                     >
//                         <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl z-10">
//                             <div className="flex items-center justify-between">
//                                 <div className="flex items-center gap-3">
//                                     <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
//                                         <Edit className="h-5 w-5 text-white" />
//                                     </div>
//                                     <h3 className="text-xl font-bold text-gray-900">Edit Event</h3>
//                                 </div>
//                                 <button
//                                     onClick={() => {
//                                         setShowEditModal(false);
//                                         setEditingEvent(null);
//                                     }}
//                                     className="text-gray-400 hover:text-gray-600 transition-colors"
//                                 >
//                                     <X className="w-6 h-6" />
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Same form fields as Create Modal - reuse the same structure */}
//                         <div className="px-6 py-6 space-y-5">
//                             {/* Copy all form fields from Create Modal */}
//                             {/* I'll abbreviate here for space, but include all the same fields */}
//                             <div>
//                                 <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title *</label>
//                                 <input
//                                     type="text"
//                                     className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//                                     value={eventForm.title}
//                                     onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
//                                 />
//                             </div>
//                             {/* ... rest of the form fields ... */}
//                         </div>

//                         <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-2xl flex justify-end gap-3">
//                             <button
//                                 onClick={() => {
//                                     setShowEditModal(false);
//                                     setEditingEvent(null);
//                                 }}
//                                 className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={updateEvent}
//                                 className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all"
//                             >
//                                 Update Event
//                             </button>
//                         </div>
//                     </motion.div>
//                 </div>
//             )}

//             {/* Event Details Modal */}
//             {showEventModal && selectedEvent && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
//                     <motion.div
//                         initial={{ opacity: 0, scale: 0.9 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
//                     >
//                         <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-2xl z-10">
//                             <div
//                                 className="h-32 rounded-t-2xl"
//                                 style={{
//                                     background: `linear-gradient(135deg, ${eventConfig[selectedEvent.event_type as keyof typeof eventConfig]?.color || '#5B9FFF'} 0%, ${eventConfig[selectedEvent.event_type as keyof typeof eventConfig]?.color || '#5B9FFF'}dd 100%)`
//                                 }}
//                             ></div>
//                             <div className="px-6 pb-4 -mt-12">
//                                 <div className="flex items-start justify-between">
//                                     <div
//                                         className="h-20 w-20 rounded-xl shadow-lg flex items-center justify-center border-4 border-white text-4xl"
//                                         style={{
//                                             backgroundColor: eventConfig[selectedEvent.event_type as keyof typeof eventConfig]?.colorLight
//                                         }}
//                                     >
//                                         {eventConfig[selectedEvent.event_type as keyof typeof eventConfig]?.icon}
//                                     </div>
//                                     <button
//                                         onClick={() => {
//                                             setShowEventModal(null);
//                                             setSelectedEvent(null);
//                                         }}
//                                         className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
//                                     >
//                                         <X className="w-5 h-5 text-gray-600" />
//                                     </button>
//                                 </div>
//                                 <h3 className="text-2xl font-bold text-gray-900 mt-4">{selectedEvent.title}</h3>
//                             </div>
//                         </div>

//                         <div className="px-6 py-6 space-y-6">
//                             <div>
//                                 <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
//                                 <p className="text-gray-600 leading-relaxed">{selectedEvent.description}</p>
//                             </div>

//                             <div className="bg-gray-50 rounded-xl p-4 space-y-3">
//                                 <div className="flex items-center gap-3">
//                                     <div
//                                         className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
//                                         style={{
//                                             backgroundColor: eventConfig[selectedEvent.event_type as keyof typeof eventConfig]?.colorLight
//                                         }}
//                                     >
//                                         <CalendarIcon
//                                             className="h-5 w-5"
//                                             style={{
//                                                 color: eventConfig[selectedEvent.event_type as keyof typeof eventConfig]?.color
//                                             }}
//                                         />
//                                     </div>
//                                     <div>
//                                         <p className="text-xs text-gray-500 font-medium">Date</p>
//                                         <p className="text-sm font-semibold text-gray-900">{formatDate(selectedEvent.event_date)}</p>
//                                     </div>
//                                 </div>

//                                 <div className="flex items-center gap-3">
//                                     <div
//                                         className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
//                                         style={{
//                                             backgroundColor: eventConfig[selectedEvent.event_type as keyof typeof eventConfig]?.colorLight
//                                         }}
//                                     >
//                                         <Clock
//                                             className="h-5 w-5"
//                                             style={{
//                                                 color: eventConfig[selectedEvent.event_type as keyof typeof eventConfig]?.color
//                                             }}
//                                         />
//                                     </div>
//                                     <div>
//                                         <p className="text-xs text-gray-500 font-medium">Time</p>
//                                         <p className="text-sm font-semibold text-gray-900">
//                                             {selectedEvent.event_time} {selectedEvent.end_time && `- ${selectedEvent.end_time}`}
//                                         </p>
//                                     </div>
//                                 </div>

//                                 <div className="flex items-center gap-3">
//                                     <div
//                                         className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
//                                         style={{
//                                             backgroundColor: eventConfig[selectedEvent.event_type as keyof typeof eventConfig]?.colorLight
//                                         }}
//                                     >
//                                         <MapPin
//                                             className="h-5 w-5"
//                                             style={{
//                                                 color: eventConfig[selectedEvent.event_type as keyof typeof eventConfig]?.color
//                                             }}
//                                         />
//                                     </div>
//                                     <div>
//                                         <p className="text-xs text-gray-500 font-medium">Location</p>
//                                         <p className="text-sm font-semibold text-gray-900">{selectedEvent.location}</p>
//                                     </div>
//                                 </div>
//                             </div>

//                             {permissions.canManageParticipants && participants.length > 0 && (
//                                 <div>
//                                     <h4 className="text-sm font-semibold text-gray-900 mb-3">
//                                         Participants ({participants.length})
//                                     </h4>
//                                     <div className="space-y-2 max-h-48 overflow-y-auto">
//                                         {participants.map(participant => (
//                                             <div key={participant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                                                 <div className="flex items-center gap-3">
//                                                     <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
//                                                         <UserIcon className="h-5 w-5 text-white" />
//                                                     </div>
//                                                     <div>
//                                                         <p className="text-sm font-medium text-gray-900">
//                                                             {userProfiles[participant.user_id]?.full_name || participant.user_id}
//                                                         </p>
//                                                         <span className="text-xs text-gray-500 capitalize">
//                                                             {participant.user_role}
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                                 <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
//                                                     participant.status === 'registered' ? 'bg-yellow-100 text-yellow-800' :
//                                                         participant.status === 'attended' ? 'bg-green-100 text-green-800' :
//                                                             'bg-red-100 text-red-800'
//                                                 }`}>
//                                                     {participant.status}
//                                                 </span>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-2xl flex items-center justify-between">
//                             <div>
//                                 {!isUserRegistered(selectedEvent.id) &&
//                                     selectedEvent.event_date >= new Date().toISOString().split('T')[0] && (
//                                         <button
//                                             onClick={() => registerForEvent(selectedEvent.id)}
//                                             className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
//                                         >
//                                             <CheckCircle className="w-4 h-4" />
//                                             Register for Event
//                                         </button>
//                                     )}
//                                 {isUserRegistered(selectedEvent.id) && (
//                                     <span className="px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-800 flex items-center gap-2">
//                                         <CheckCircle className="w-5 h-5" />
//                                         Already Registered
//                                     </span>
//                                 )}
//                             </div>

//                             {(permissions.canEdit(selectedEvent) || permissions.canDelete(selectedEvent)) && (
//                                 <div className="flex gap-2">
//                                     {permissions.canEdit(selectedEvent) && (
//                                         <button
//                                             onClick={() => startEditEvent(selectedEvent)}
//                                             className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors flex items-center gap-2"
//                                         >
//                                             <Edit className="w-4 h-4" />
//                                             Edit
//                                         </button>
//                                     )}
//                                     {permissions.canDelete(selectedEvent) && (
//                                         <button
//                                             onClick={() => deleteEvent(selectedEvent.id)}
//                                             className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
//                                         >
//                                             <Trash className="w-4 h-4" />
//                                             Delete
//                                         </button>
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//                     </motion.div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default EventsPage;
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import {
    Calendar as CalendarIcon,
    Plus,
    Filter,
    Search,
    Eye,
    Edit,
    Trash,
    Users as UsersIcon,
    MapPin,
    Clock,
    User as UserIcon,
    CheckCircle,
    XCircle,
    X,
    AlertCircle,
    TrendingUp,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

// Interfaces
interface Event {
    id: string;
    title: string;
    description: string;
    event_date: string;
    event_time: string;
    end_time?: string;
    location: string;
    event_type: 'academic' | 'sports' | 'cultural' | 'meeting' | 'holiday' | 'other';
    target_roles: ('admin' | 'teacher' | 'student' | 'parent' | 'staff')[];
    target_specific_users?: string[];
    created_by: string;
    created_at: string;
    updated_at: string;
    is_published: boolean;
    max_participants?: number;
    current_participants?: number;
    image_url?: string;
}

interface EventParticipant {
    id: string;
    event_id: string;
    user_id: string;
    user_role: string;
    status: 'registered' | 'attended' | 'cancelled';
    registered_at: string;
}

interface UserProfile {
    id: string;
    full_name: string;
    email: string;
    role: 'admin' | 'teacher' | 'student' | 'parent' | 'staff';
    avatar_url?: string;
}

// Event type configuration with your color scheme
const eventConfig = {
    meeting: { icon: '👥', label: 'Meeting', color: '#1E88E5', colorLight: 'rgba(30, 136, 229, 0.1)' },
    academic: { icon: '🎓', label: 'Academic', color: '#1E88E5', colorLight: 'rgba(30, 136, 229, 0.1)' },
    sports: { icon: '⚽', label: 'Sports', color: '#1E88E5', colorLight: 'rgba(30, 136, 229, 0.1)' },
    cultural: { icon: '🎭', label: 'Cultural', color: '#1E88E5', colorLight: 'rgba(30, 136, 229, 0.1)' },
    holiday: { icon: '📝', label: 'Exam', color: '#1E88E5', colorLight: 'rgba(30, 136, 229, 0.1)' },
    other: { icon: '💡', label: 'Workshop', color: '#1E88E5', colorLight: 'rgba(30, 136, 229, 0.1)' },
};

const EventsPage: React.FC = () => {
    const { user, isAdmin, isTeacher, isStudent, loading: authLoading } = useAuth();

    // State management
    const [events, setEvents] = useState<Event[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEventModal, setShowEventModal] = useState<string | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [participants, setParticipants] = useState<EventParticipant[]>([]);
    const [userProfiles, setUserProfiles] = useState<Record<string, UserProfile>>({});

    // Calendar state
    const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 6)); // Nov 6, 2025

    // Filters and search
    const [searchTerm, setSearchTerm] = useState('');
    const [eventTypeFilter, setEventTypeFilter] = useState<Event['event_type'] | 'all'>('all');
    const [dateFilter, setDateFilter] = useState<'all' | 'upcoming' | 'past' | 'today'>('upcoming');
    const [roleFilter, setRoleFilter] = useState<'all' | string>('all');

    // Edit Form State
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    // Form state
    const [eventForm, setEventForm] = useState<Partial<Event>>({
        title: '',
        description: '',
        event_date: new Date().toISOString().split('T')[0],
        event_time: '09:00',
        end_time: '17:00',
        location: '',
        event_type: 'academic',
        target_roles: [],
        is_published: true,
        max_participants: undefined,
        created_by: user?.email || '',
    });

    const startEditEvent = (event: Event) => {
        setEditingEvent(event);
        setEventForm({
            title: event.title,
            description: event.description,
            event_date: event.event_date,
            event_time: event.event_time,
            end_time: event.end_time,
            location: event.location,
            event_type: event.event_type,
            target_roles: event.target_roles,
            is_published: event.is_published,
            max_participants: event.max_participants,
            created_by: event.created_by,
        });
        setShowEditModal(true);
        setShowEventModal(null);
    };

    const updateEvent = async () => {
        if (!editingEvent) return;

        try {
            const { error } = await supabase
                .from('events')
                .update({
                    title: eventForm.title,
                    description: eventForm.description,
                    event_date: eventForm.event_date,
                    event_time: eventForm.event_time,
                    end_time: eventForm.end_time,
                    location: eventForm.location,
                    event_type: eventForm.event_type,
                    target_roles: eventForm.target_roles,
                    is_published: eventForm.is_published,
                    max_participants: eventForm.max_participants,
                    created_by: eventForm.created_by,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', editingEvent.id);

            if (error) throw error;

            setShowEditModal(false);
            setEditingEvent(null);
            setEventForm({
                title: '',
                description: '',
                event_date: new Date().toISOString().split('T')[0],
                event_time: '09:00',
                end_time: '17:00',
                location: '',
                event_type: 'academic',
                target_roles: [],
                is_published: true,
                max_participants: undefined,
                created_by: user?.email || '',
            });

            fetchEvents();
            alert('Event updated successfully!');
        } catch (error) {
            console.error('Error updating event:', error);
            alert('Error updating event. Please try again.');
        }
    };

    const userRole = user?.role || 'student';
    const userId = user?.id || '';

    const permissions = useMemo(() => {
        const canCreate = isAdmin || isTeacher || isStaff;
        const canEdit = (event: Event) => isAdmin || event.created_by === userId;
        const canDelete = (event: Event) => isAdmin || event.created_by === userId;
        const canViewAll = isAdmin;
        const canManageParticipants = isAdmin || isTeacher;

        return { canCreate, canEdit, canDelete, canViewAll, canManageParticipants };
    }, [isAdmin, isTeacher, isStaff, userId]);

    const fetchEvents = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        try {
            let query = supabase
                .from('events')
                .select('*')
                .eq('is_published', true);

            if (!isAdmin) {
                query = query.contains('target_roles', [userRole]);
            }

            const { data, error } = await query.order('event_date', { ascending: true });

            if (error) throw error;
            setEvents(data || []);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    }, [user, userRole, isAdmin]);

    const fetchParticipants = useCallback(async (eventId: string) => {
        try {
            const { data, error } = await supabase
                .from('event_participants')
                .select('*')
                .eq('event_id', eventId);

            if (error) throw error;
            setParticipants(data || []);

            if (data && data.length > 0) {
                const userIds = data.map(p => p.user_id);
                const { data: profiles, error: profileError } = await supabase
                    .from('profiles')
                    .select('id, full_name, email, role, avatar_url')
                    .in('id', userIds);

                if (!profileError && profiles) {
                    const profilesMap = profiles.reduce((acc, profile) => {
                        acc[profile.id] = profile;
                        return acc;
                    }, {} as Record<string, UserProfile>);
                    setUserProfiles(profilesMap);
                }
            }
        } catch (error) {
            console.error('Error fetching participants:', error);
        }
    }, []);

    const registerForEvent = async (eventId: string) => {
        if (!user) {
            alert('Please log in to register for events');
            return;
        }

        try {
            const { error } = await supabase
                .from('event_participants')
                .insert({
                    event_id: eventId,
                    user_id: user?.email || '',
                    user_role: userRole,
                    status: 'registered',
                });

            if (error) throw error;

            fetchEvents();
            if (selectedEvent) {
                fetchParticipants(selectedEvent.id);
            }
            alert('Successfully registered for the event!');
        } catch (error) {
            console.error('Error registering for event:', error);
            alert('Error registering for event. Please try again.');
        }
    };

    const createEvent = async () => {
        if (!user) {
            alert('Please log in to create events');
            return;
        }

        try {
            const { error } = await supabase
                .from('events')
                .insert({
                    ...eventForm,
                    created_by: eventForm.created_by || user.email,
                });

            if (error) throw error;

            setShowCreateModal(false);
            setEventForm({
                title: '',
                description: '',
                event_date: new Date().toISOString().split('T')[0],
                event_time: '09:00',
                end_time: '17:00',
                location: '',
                event_type: 'academic',
                target_roles: [],
                is_published: true,
                max_participants: undefined,
                created_by: user.email,
            });

            fetchEvents();
            alert('Event created successfully!');
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Error creating event. Please try again.');
        }
    };

    const deleteEvent = async (eventId: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', eventId);

            if (error) throw error;

            fetchEvents();
            setShowEventModal(null);
            alert('Event deleted successfully!');
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Error deleting event. Please try again.');
        }
    };

    useEffect(() => {
        let filtered = events;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(event =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Event type filter
        if (eventTypeFilter !== 'all') {
            filtered = filtered.filter(event => event.event_type === eventTypeFilter);
        }

        // Date filter - DEFAULT TO UPCOMING
        const today = new Date().toISOString().split('T')[0];
        if (dateFilter === 'upcoming') {
            filtered = filtered.filter(event => event.event_date >= today);
        } else if (dateFilter === 'past') {
            filtered = filtered.filter(event => event.event_date < today);
        } else if (dateFilter === 'today') {
            filtered = filtered.filter(event => event.event_date === today);
        }

        // Role filter
        if (roleFilter !== 'all' && isAdmin) {
            filtered = filtered.filter(event => event.target_roles.includes(roleFilter as any));
        }

        setFilteredEvents(filtered);
    }, [events, searchTerm, eventTypeFilter, dateFilter, roleFilter, isAdmin]);

    useEffect(() => {
        if (user) {
            fetchEvents();
        }
    }, [user, fetchEvents]);

    useEffect(() => {
        if (user) {
            setEventForm(prev => ({
                ...prev,
                target_roles: [userRole],
            }));
        }
    }, [user, userRole]);

    // Calendar calculations
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const isUserRegistered = (eventId: string) => {
        return participants.some(p => p.event_id === eventId && p.user_id === userId);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-[#F6F9FC] flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#E5E7EB] border-t-primary mx-auto"></div>
                        <CalendarIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
                    </div>
                    <p className="mt-4 text-foreground font-medium">Loading Events...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-[#F6F9FC] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-soft p-8 text-center">
                    <div className="mx-auto h-16 w-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                        <CalendarIcon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">Please Log In</h3>
                    <p className="text-muted-foreground">You need to be logged in to view and manage school events.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6 bg-[#F6F9FC] min-h-screen">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-foreground mb-2">Events</h1>
                    <p className="text-muted-foreground">School calendar and upcoming events</p>
                </div>
                {permissions.canCreate && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCreateModal(true)}
                        className="gradient-primary text-white shadow-glow hover:shadow-float rounded-xl h-11 px-6 gap-2 flex items-center transition-all duration-300"
                    >
                        <Plus className="w-5 h-5" />
                        Add Event
                    </motion.button>
                )}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 glass-strong rounded-2xl p-6 shadow-soft"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-foreground">
                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                                className="p-2 rounded-xl hover:bg-white/60 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-foreground" />
                            </button>
                            <button
                                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                                className="p-2 rounded-xl hover:bg-white/60 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-foreground" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
                                {day}
                            </div>
                        ))}
                        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                            <div key={`empty-${index}`} className="aspect-square"></div>
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, index) => {
                            const day = index + 1;
                            const dateStr = `2025-11-${day.toString().padStart(2, '0')}`;
                            const hasEvent = events.some(event => event.event_date === dateStr);
                            const isToday = day === 6;

                            return (
                                <motion.div
                                    key={day}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    className={`
                                        aspect-square rounded-xl flex items-center justify-center text-sm cursor-pointer
                                        transition-all duration-300 relative
                                        ${isToday
                                            ? 'gradient-primary text-white shadow-glow font-semibold'
                                            : hasEvent
                                                ? 'bg-white text-primary shadow-soft font-medium'
                                                : 'bg-white/40 text-foreground hover:bg-white/80'
                                        }
                                    `}
                                >
                                    {day}
                                    {hasEvent && !isToday && (
                                        <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary"></div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Event Types */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-strong rounded-2xl p-6 shadow-soft"
                >
                    <h3 className="text-foreground mb-4">Event Types</h3>
                    <div className="space-y-3">
                        {Object.entries(eventConfig).map(([type, config], index) => {
                            const count = events.filter(e => e.event_type === type).length;
                            return (
                                <motion.div
                                    key={type}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.05 }}
                                    whileHover={{ x: 4 }}
                                    className="flex items-center justify-between p-3 rounded-xl bg-white/60 hover:bg-white transition-all duration-300 cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{config.icon}</span>
                                        <span className="font-medium text-foreground capitalize">{config.label}</span>
                                    </div>
                                    <span
                                        className="px-3 py-1 rounded-full text-sm font-semibold text-primary"
                                        style={{
                                            backgroundColor: config.colorLight,
                                        }}
                                    >
                                        {count}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* Filter Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-strong rounded-2xl p-4 shadow-soft"
            >
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex-1 flex gap-3 flex-wrap">
                        {/* Date Filter */}
                        <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-soft">
                            <CalendarIcon className="w-4 h-4 text-primary" />
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value as any)}
                                className="border-0 text-sm font-medium text-foreground focus:ring-0 focus:outline-none bg-transparent"
                            >
                                <option value="upcoming">Upcoming Events</option>
                                <option value="today">Today</option>
                                <option value="past">Past Events</option>
                                <option value="all">All Events</option>
                            </select>
                        </div>

                        {/* Event Type Filter */}
                        <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-soft">
                            <Filter className="w-4 h-4 text-primary" />
                            <select
                                value={eventTypeFilter}
                                onChange={(e) => setEventTypeFilter(e.target.value as any)}
                                className="border-0 text-sm font-medium text-foreground focus:ring-0 focus:outline-none bg-transparent"
                            >
                                <option value="all">All Types</option>
                                <option value="academic">Academic</option>
                                <option value="sports">Sports</option>
                                <option value="cultural">Cultural</option>
                                <option value="meeting">Meeting</option>
                                <option value="holiday">Exam</option>
                                <option value="other">Workshop</option>
                            </select>
                        </div>

                        {/* Search */}
                        <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-soft flex-1 md:flex-none md:min-w-64">
                            <Search className="w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border-0 text-sm text-foreground placeholder-muted-foreground focus:ring-0 focus:outline-none bg-transparent w-full"
                            />
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                        {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
                    </div>
                </div>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h3 className="text-foreground mb-4">Upcoming Events</h3>

                {filteredEvents.length === 0 ? (
                    <div className="glass-strong rounded-2xl p-12 shadow-soft text-center">
                        <CalendarIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground text-lg">No events found</p>
                        <p className="text-muted-foreground text-sm">Try adjusting your filters or search criteria</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredEvents.map((event, index) => {
                            const config = eventConfig[event.event_type as keyof typeof eventConfig] || eventConfig.other;
                            return (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 + index * 0.05 }}
                                    whileHover={{ y: -6, scale: 1.02 }}
                                    className="glass-strong rounded-2xl p-5 shadow-soft hover:shadow-float transition-all duration-300 group cursor-pointer relative overflow-hidden"
                                >
                                    <div
                                        className="absolute top-0 left-0 right-0 h-1"
                                        style={{ background: config.color }}
                                    ></div>

                                    <div className="flex items-start gap-3 mb-4">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                                            style={{ backgroundColor: config.colorLight }}
                                        >
                                            {config.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-foreground mb-1 truncate font-semibold">{event.title}</h4>
                                            <span
                                                className="text-xs px-3 py-1 rounded-full font-medium capitalize inline-block"
                                                style={{
                                                    backgroundColor: config.colorLight,
                                                    color: config.color,
                                                }}
                                            >
                                                {config.label}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <CalendarIcon className="w-4 h-4" style={{ color: config.color }} />
                                            <span>{formatDate(event.event_date)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="w-4 h-4" style={{ color: config.color }} />
                                            <span>{event.event_time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="w-4 h-4" style={{ color: config.color }} />
                                            <span className="truncate">{event.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <UsersIcon className="w-4 h-4" style={{ color: config.color }} />
                                            <span>{event.max_participants || 'Unlimited'} Expected</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-border flex gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedEvent(event);
                                                setShowEventModal(event.id);
                                                fetchParticipants(event.id);
                                            }}
                                            className="flex-1 px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground bg-white/60 hover:bg-white transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View
                                        </button>
                                        {permissions.canEdit(event) && (
                                            <button
                                                onClick={() => startEditEvent(event)}
                                                className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground bg-white/60 hover:bg-white transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        )}
                                        {permissions.canDelete(event) && (
                                            <button
                                                onClick={() => deleteEvent(event.id)}
                                                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </motion.div>

            {/* Create Event Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative bg-white rounded-2xl shadow-float w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 rounded-t-2xl z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 gradient-primary rounded-lg flex items-center justify-center">
                                        <Plus className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground">Create New Event</h3>
                                </div>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="px-6 py-6 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">Event Title *</label>
                                <input
                                    type="text"
                                    className="block w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="Enter event title"
                                    value={eventForm.title}
                                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">Description *</label>
                                <textarea
                                    className="block w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                                    rows={4}
                                    placeholder="Describe the event details..."
                                    value={eventForm.description}
                                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">Date *</label>
                                    <input
                                        type="date"
                                        className="block w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        value={eventForm.event_date}
                                        onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">Start Time *</label>
                                    <input
                                        type="time"
                                        className="block w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        value={eventForm.event_time}
                                        onChange={(e) => setEventForm({ ...eventForm, event_time: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">End Time (Optional)</label>
                                    <input
                                        type="time"
                                        className="block w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        value={eventForm.end_time}
                                        onChange={(e) => setEventForm({ ...eventForm, end_time: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">Event Type *</label>
                                    <select
                                        className="block w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        value={eventForm.event_type}
                                        onChange={(e) => setEventForm({ ...eventForm, event_type: e.target.value as Event['event_type'] })}
                                    >
                                        <option value="academic">Academic</option>
                                        <option value="sports">Sports</option>
                                        <option value="cultural">Cultural</option>
                                        <option value="meeting">Meeting</option>
                                        <option value="holiday">Holiday</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">Location *</label>
                                <input
                                    type="text"
                                    className="block w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="Enter event location"
                                    value={eventForm.location}
                                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">Created By *</label>
                                <input
                                    type="text"
                                    className="block w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="Enter creator name"
                                    value={eventForm.created_by || ''}
                                    onChange={(e) => setEventForm({ ...eventForm, created_by: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-3">Target Roles *</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {['admin', 'teacher', 'student', 'parent', 'staff'].map(role => (
                                        <label key={role} className="flex items-center p-3 border border-input rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                                            <input
                                                type="checkbox"
                                                className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                                                checked={eventForm.target_roles?.includes(role as any)}
                                                onChange={(e) => {
                                                    const currentRoles = eventForm.target_roles || [];
                                                    if (e.target.checked) {
                                                        setEventForm({
                                                            ...eventForm,
                                                            target_roles: [...currentRoles, role as any],
                                                        });
                                                    } else {
                                                        setEventForm({
                                                            ...eventForm,
                                                            target_roles: currentRoles.filter(r => r !== role),
                                                        });
                                                    }
                                                }}
                                            />
                                            <span className="ml-3 text-sm font-medium text-foreground capitalize">{role}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">
                                    Maximum Participants (Optional)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    className="block w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="No limit"
                                    value={eventForm.max_participants || ''}
                                    onChange={(e) => setEventForm({
                                        ...eventForm,
                                        max_participants: e.target.value ? parseInt(e.target.value) : undefined,
                                    })}
                                />
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-secondary px-6 py-4 border-t border-border rounded-b-2xl flex justify-end gap-3">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-6 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-white/60 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createEvent}
                                className="px-6 py-2.5 gradient-primary text-white text-sm font-medium rounded-lg hover:shadow-float transition-all"
                            >
                                Create Event
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Edit Event Modal */}
            {showEditModal && editingEvent && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative bg-white rounded-2xl shadow-float w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="sticky top-0 bg-white border-b border-border px-6 py-4 rounded-t-2xl z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 gradient-primary rounded-lg flex items-center justify-center">
                                        <Edit className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground">Edit Event</h3>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingEvent(null);
                                    }}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="px-6 py-6 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">Event Title *</label>
                                <input
                                    type="text"
                                    className="block w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    value={eventForm.title}
                                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">Description *</label>
                                <textarea
                                    className="block w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                                    rows={4}
                                    value={eventForm.description}
                                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">Date *</label>
                                    <input
                                        type="date"
                                        className="block w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        value={eventForm.event_date}
                                        onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">Start Time *</label>
                                    <input
                                        type="time"
                                        className="block w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        value={eventForm.event_time}
                                        onChange={(e) => setEventForm({ ...eventForm, event_time: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">End Time (Optional)</label>
                                    <input
                                        type="time"
                                        className="block w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        value={eventForm.end_time}
                                        onChange={(e) => setEventForm({ ...eventForm, end_time: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-2">Event Type *</label>
                                    <select
                                        className="block w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        value={eventForm.event_type}
                                        onChange={(e) => setEventForm({ ...eventForm, event_type: e.target.value as Event['event_type'] })}
                                    >
                                        <option value="academic">Academic</option>
                                        <option value="sports">Sports</option>
                                        <option value="cultural">Cultural</option>
                                        <option value="meeting">Meeting</option>
                                        <option value="holiday">Holiday</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">Location *</label>
                                <input
                                    type="text"
                                    className="block w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    value={eventForm.location}
                                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">Created By *</label>
                                <input
                                    type="text"
                                    className="block w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    value={eventForm.created_by || ''}
                                    onChange={(e) => setEventForm({ ...eventForm, created_by: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-3">Target Roles *</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {['admin', 'teacher', 'student', 'parent', 'staff'].map(role => (
                                        <label key={role} className="flex items-center p-3 border border-input rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                                            <input
                                                type="checkbox"
                                                className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                                                checked={eventForm.target_roles?.includes(role as any)}
                                                onChange={(e) => {
                                                    const currentRoles = eventForm.target_roles || [];
                                                    if (e.target.checked) {
                                                        setEventForm({
                                                            ...eventForm,
                                                            target_roles: [...currentRoles, role as any],
                                                        });
                                                    } else {
                                                        setEventForm({
                                                            ...eventForm,
                                                            target_roles: currentRoles.filter(r => r !== role),
                                                        });
                                                    }
                                                }}
                                            />
                                            <span className="ml-3 text-sm font-medium text-foreground capitalize">{role}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">
                                    Maximum Participants (Optional)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    className="block w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    value={eventForm.max_participants || ''}
                                    onChange={(e) => setEventForm({
                                        ...eventForm,
                                        max_participants: e.target.value ? parseInt(e.target.value) : undefined,
                                    })}
                                />
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-secondary px-6 py-4 border-t border-border rounded-b-2xl flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditingEvent(null);
                                }}
                                className="px-6 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-white/60 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={updateEvent}
                                className="px-6 py-2.5 gradient-primary text-white text-sm font-medium rounded-lg hover:shadow-float transition-all"
                            >
                                Update Event
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Event Details Modal */}
            {showEventModal && selectedEvent && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative bg-white rounded-2xl shadow-float w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="sticky top-0 bg-white border-b border-border rounded-t-2xl z-10">
                            <div
                                className="h-32 rounded-t-2xl gradient-primary"
                            ></div>
                            <div className="px-6 pb-4 -mt-12">
                                <div className="flex items-start justify-between">
                                    <div
                                        className="h-20 w-20 rounded-xl shadow-soft flex items-center justify-center border-4 border-white text-4xl"
                                        style={{
                                            backgroundColor: eventConfig[selectedEvent.event_type as keyof typeof eventConfig]?.colorLight
                                        }}
                                    >
                                        {eventConfig[selectedEvent.event_type as keyof typeof eventConfig]?.icon}
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowEventModal(null);
                                            setSelectedEvent(null);
                                        }}
                                        className="bg-white rounded-full p-2 shadow-soft hover:bg-secondary transition-colors"
                                    >
                                        <X className="w-5 h-5 text-foreground" />
                                    </button>
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mt-4">{selectedEvent.title}</h3>
                            </div>
                        </div>

                        <div className="px-6 py-6 space-y-6">
                            <div>
                                <h4 className="text-sm font-semibold text-foreground mb-2">Description</h4>
                                <p className="text-muted-foreground leading-relaxed">{selectedEvent.description}</p>
                            </div>

                            <div className="bg-secondary rounded-xl p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{
                                            backgroundColor: eventConfig[selectedEvent.event_type as keyof typeof eventConfig]?.colorLight
                                        }}
                                    >
                                        <CalendarIcon
                                            className="h-5 w-5"
                                            style={{
                                                color: eventConfig[selectedEvent.event_type as keyof typeof eventConfig]?.color
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium">Date</p>
                                        <p className="text-sm font-semibold text-foreground">{formatDate(selectedEvent.event_date)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div
                                        className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{
                                            backgroundColor: eventConfig[selectedEvent.event_type as keyof typeof eventConfig]?.colorLight
                                        }}
                                    >
                                        <Clock
                                            className="h-5 w-5"
                                            style={{
                                                color: eventConfig[selectedEvent.event_type as keyof typeof eventConfig]?.color
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium">Time</p>
                                        <p className="text-sm font-semibold text-foreground">
                                            {selectedEvent.event_time} {selectedEvent.end_time && `- ${selectedEvent.end_time}`}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div
                                        className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{
                                            backgroundColor: eventConfig[selectedEvent.event_type as keyof typeof eventConfig]?.colorLight
                                        }}
                                    >
                                        <MapPin
                                            className="h-5 w-5"
                                            style={{
                                                color: eventConfig[selectedEvent.event_type as keyof typeof eventConfig]?.color
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium">Location</p>
                                        <p className="text-sm font-semibold text-foreground">{selectedEvent.location}</p>
                                    </div>
                                </div>
                            </div>

                            {permissions.canManageParticipants && participants.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-semibold text-foreground mb-3">
                                        Participants ({participants.length})
                                    </h4>
                                    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                        {participants.map(participant => (
                                            <div key={participant.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 gradient-primary rounded-full flex items-center justify-center">
                                                        <UserIcon className="h-5 w-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-foreground">
                                                            {userProfiles[participant.user_id]?.full_name || participant.user_id}
                                                        </p>
                                                        <span className="text-xs text-muted-foreground capitalize">
                                                            {participant.user_role}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${participant.status === 'registered' ? 'bg-yellow-100 text-yellow-800' :
                                                        participant.status === 'attended' ? 'bg-green-100 text-green-800' :
                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {participant.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="sticky bottom-0 bg-secondary px-6 py-4 border-t border-border rounded-b-2xl flex items-center justify-between">
                            <div>
                                {!isUserRegistered(selectedEvent.id) &&
                                    selectedEvent.event_date >= new Date().toISOString().split('T')[0] && (
                                        <button
                                            onClick={() => registerForEvent(selectedEvent.id)}
                                            className="px-6 py-2.5 gradient-primary text-white text-sm font-medium rounded-lg hover:shadow-float transition-all flex items-center gap-2"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Register for Event
                                        </button>
                                    )}
                                {isUserRegistered(selectedEvent.id) && (
                                    <span className="px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-800 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        Already Registered
                                    </span>
                                )}
                            </div>

                            {(permissions.canEdit(selectedEvent) || permissions.canDelete(selectedEvent)) && (
                                <div className="flex gap-2">
                                    {permissions.canEdit(selectedEvent) && (
                                        <button
                                            onClick={() => startEditEvent(selectedEvent)}
                                            className="px-4 py-2 border border-border text-sm font-medium rounded-lg text-foreground bg-white hover:bg-secondary transition-colors flex items-center gap-2"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </button>
                                    )}
                                    {permissions.canDelete(selectedEvent) && (
                                        <button
                                            onClick={() => deleteEvent(selectedEvent.id)}
                                            className="px-4 py-2 bg-destructive text-destructive-foreground text-sm font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                                        >
                                            <Trash className="w-4 h-4" />
                                            Delete
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default EventsPage;
