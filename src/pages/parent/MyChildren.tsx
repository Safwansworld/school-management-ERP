// src/pages/parent/MyChildren.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Users, GraduationCap, Calendar, Award, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Child {
  id: string;
  student_name: string;
  roll_number: string;
  class_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  attendance_percentage?: number;
}

const MyChildren: React.FC = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, [user?.id]);

  const fetchChildren = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          id,
          student_name,
          roll_number,
          email,
          phone_number,
          date_of_birth,
          class:classes(class_name)
        `)
        .eq('parent_id', user?.id);

      if (error) throw error;

      const formattedChildren = data?.map((child: any) => ({
        id: child.id,
        student_name: child.student_name,
        roll_number: child.roll_number,
        class_name: child.class?.class_name || 'N/A',
        email: child.email,
        phone_number: child.phone_number,
        date_of_birth: child.date_of_birth,
      })) || [];

      setChildren(formattedChildren);
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-8 h-8 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">My Children</h2>
      </div>

      {children.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {children.map((child) => (
            <div
              key={child.id}
              className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="bg-purple-500 p-4 rounded-xl">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {child.student_name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Roll No: {child.roll_number} • Class: {child.class_name}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      {child.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      {child.phone_number}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      DOB: {new Date(child.date_of_birth).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to="/attendance/my-attendance"
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium text-center transition-colors"
                    >
                      View Attendance
                    </Link>
                    <Link
                      to="/results"
                      className="flex-1 bg-green-50 hover:bg-green-100 text-green-600 px-4 py-2 rounded-lg text-sm font-medium text-center transition-colors"
                    >
                      View Results
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center shadow-md">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Children Found</h3>
          <p className="text-gray-600">
            No student records are linked to your parent account.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyChildren;
