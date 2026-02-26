'use client';

import React from 'react';
import { X, Download, ExternalLink } from 'lucide-react';
import { Achievement } from '../../../types/achievements';

interface ViewAchievementModalProps {
  achievement: Achievement;
  onClose: () => void;
}

export default function ViewAchievementModal({
  achievement,
  onClose,
}: ViewAchievementModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-200 bg-white">
          <h2 className="text-xl font-bold text-slate-900">Achievement Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{achievement.title}</h3>
            <p className="text-slate-600">{achievement.description}</p>
          </div>

          {/* Grid of Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-slate-600">Student Name</p>
              <p className="text-lg font-semibold text-slate-900">{achievement.student_name}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-slate-600">Achievement Type</p>
              <p className="text-lg font-semibold text-slate-900">{achievement.achievement_type}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-slate-600">Academic Year</p>
              <p className="text-lg font-semibold text-slate-900">{achievement.academic_year}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-slate-600">Date Achieved</p>
              <p className="text-lg font-semibold text-slate-900">
                {new Date(achievement.date_achieved).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-slate-600">Points</p>
              <p className="text-lg font-semibold text-blue-600">+{achievement.points}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-slate-600">Status</p>
              <p className={`text-lg font-semibold ${
                achievement.status === 'approved' ? 'text-green-600' :
                achievement.status === 'rejected' ? 'text-red-600' :
                'text-yellow-600'
              }`}>
                {achievement.status.charAt(0).toUpperCase() + achievement.status.slice(1)}
              </p>
            </div>
          </div>

          {/* Category and Awarded By */}
          {achievement.category && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-slate-600">Category</p>
              <p className="text-slate-900">{achievement.category}</p>
            </div>
          )}

          {achievement.awarded_by && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-slate-600">Awarded By</p>
              <p className="text-slate-900">{achievement.awarded_by}</p>
            </div>
          )}

          {/* Files Section */}
          {(achievement.certificate_url || achievement.attachment_url) && (
            <div className="border-t border-slate-200 pt-4">
              <h4 className="font-semibold text-slate-900 mb-3">Attachments</h4>
              <div className="space-y-2">
                {achievement.certificate_url && (
                  <a
                    href={achievement.certificate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Download className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-600 font-medium">Download Certificate</span>
                    <ExternalLink className="w-4 h-4 text-blue-600 ml-auto" />
                  </a>
                )}
                {achievement.attachment_url && (
                  <a
                    href={achievement.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <Download className="w-5 h-5 text-green-600" />
                    <span className="text-green-600 font-medium">Download Attachment</span>
                    <ExternalLink className="w-4 h-4 text-green-600 ml-auto" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t border-slate-200 pt-4 text-sm text-slate-600">
            <p>Created: {new Date(achievement.created_at).toLocaleString()}</p>
            <p>Last Updated: {new Date(achievement.updated_at).toLocaleString()}</p>
          </div>
        </div>

        {/* Close Button */}
        <div className="sticky bottom-0 p-6 border-t border-slate-200 bg-white">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
