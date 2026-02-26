// components/results/ReportCard.tsx
import React, { useState, useMemo } from 'react';
import { StudentReport, Student } from '../../types/results';
import { FileText, Download, Printer, TrendingUp, Award, Users, Calendar } from 'lucide-react';

interface ReportCardProps {
  reports: StudentReport[];
  selectedStudent: string;
  students: Student[];
}

const ReportCard: React.FC<ReportCardProps> = ({ reports, selectedStudent, students }) => {
  const [selectedTerm, setSelectedTerm] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Filter reports based on selected student, term, and year
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesStudent = !selectedStudent || report.student_id === selectedStudent;
      const matchesTerm = selectedTerm === 'all' || report.term === selectedTerm;
      const matchesYear = selectedYear === 'all' || report.academic_year === selectedYear;
      return matchesStudent && matchesTerm && matchesYear;
    });
  }, [reports, selectedStudent, selectedTerm, selectedYear]);

  // Get unique academic years
  const academicYears = useMemo(() => {
    const years = Array.from(new Set(reports.map(r => r.academic_year)));
    return years.sort().reverse();
  }, [reports]);

  const handlePrintReport = (report: StudentReport) => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(generatePrintableReport(report));
      printWindow.document.close();
      printWindow.print();
    }
  };

  const generatePrintableReport = (report: StudentReport) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Report Card - ${report.students?.full_name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
          .student-info { margin-bottom: 30px; }
          .grades-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .grades-table th, .grades-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .grades-table th { background-color: #f2f2f2; }
          .summary { margin-top: 30px; }
          .signature { margin-top: 50px; display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>SCHOOL REPORT CARD</h1>
          <h2>Academic Year: ${report.academic_year}</h2>
        </div>
        
        <div class="student-info">
          <h3>Student Information</h3>
          <p><strong>Name:</strong> ${report.students?.full_name}</p>
          <p><strong>Class:</strong> ${report.classes?.class_name} - ${report.classes?.section}</p>
          <p><strong>Term:</strong> ${report.term.replace('_', ' ').toUpperCase()}</p>
        </div>
        
        <div class="summary">
          <h3>Academic Performance</h3>
          <p><strong>Total Marks:</strong> ${report.obtained_marks} / ${report.total_marks}</p>
          <p><strong>Percentage:</strong> ${report.percentage.toFixed(1)}%</p>
          <p><strong>Grade:</strong> ${report.grade}</p>
          ${report.rank_in_class ? `<p><strong>Rank:</strong> ${report.rank_in_class}</p>` : ''}
          ${report.attendance_percentage ? `<p><strong>Attendance:</strong> ${report.attendance_percentage.toFixed(1)}%</p>` : ''}
        </div>
        
        ${report.remarks ? `
        <div class="remarks">
          <h3>Remarks</h3>
          <p>${report.remarks}</p>
        </div>
        ` : ''}
        
        <div class="signature">
          <div>
            <p>_____________________</p>
            <p>Class Teacher</p>
          </div>
          <div>
            <p>_____________________</p>
            <p>Principal</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Terms</option>
            <option value="mid_term">Mid Term</option>
            <option value="final">Final</option>
            <option value="annual">Annual</option>
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Years</option>
            {academicYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <div className="flex justify-end">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
              <Download size={16} />
              Export All
            </button>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
          <p className="text-gray-600">Generate student reports to view them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              {/* Report Header */}
              <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {report.students?.full_name} 
                    </h3>
                    <p className="text-sm text-gray-600">
                      {report.classes?.class_name} - {report.classes?.section}
                    </p>
                    <p className="text-sm text-gray-600">
                      {report.term.replace('_', ' ').toUpperCase()} • {report.academic_year}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePrintReport(report)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Print Report"
                    >
                      <Printer size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Report Content */}
              <div className="p-6 space-y-6">
                {/* Performance Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-900">Percentage</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">{report.percentage.toFixed(1)}%</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-purple-900">Grade</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-900">{report.grade}</p>
                  </div>
                </div>

                {/* Detailed Marks */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Academic Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Total Marks</span>
                      <span className="font-semibold">{report.obtained_marks} / {report.total_marks}</span>
                    </div>
                    
                    {report.rank_in_class && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Class Rank</span>
                        <span className="font-semibold text-orange-600">#{report.rank_in_class}</span>
                      </div>
                    )}
                    
                    {report.attendance_percentage && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Attendance</span>
                        <span className="font-semibold text-green-600">{report.attendance_percentage.toFixed(1)}%</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Remarks */}
                {report.remarks && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Teacher's Remarks</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">{report.remarks}</p>
                  </div>
                )}

                {/* Status Badge */}
                <div className="flex justify-between items-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    report.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : report.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {report.status.toUpperCase()}
                  </span>
                  
                  <div className="text-xs text-gray-500">
                    Generated: {new Date(report.generated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportCard;
