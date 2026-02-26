import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Book, Sparkles, Save, Download, Loader2, BookOpen, AlertCircle } from 'lucide-react';

interface LessonPlanForm {
  subject: string;
  gradeLevel: string;
  topic: string;
  duration: number;
  objectives: string;
}

interface LessonPlanResponse {
  lessonPlan: string;
}

const subjects = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Literature',
  'History', 'Geography', 'Computer Science', 'Physical Education', 'Art'
];

const gradeLevels = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);

const durations = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
  { value: 180, label: '3 hours' },
];

export default function LessonPlanGenerator() {
  const [formData, setFormData] = useState<LessonPlanForm>({
    subject: '',
    gradeLevel: '',
    topic: '',
    duration: 45,
    objectives: ''
  });
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (field: keyof LessonPlanForm, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateLessonPlan = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke<LessonPlanResponse>('generate-lesson-plan', {
        body: formData,
      });

      if (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
      } else if (data) {
        setGeneratedPlan(data.lessonPlan);
      }
    } catch (error) {
      console.error('Exception:', error);
      alert('Failed to generate lesson plan.');
    } finally {
      setLoading(false);
    }
  };

  const saveLessonPlan = async () => {
    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert('User not authenticated');
        setSaving(false);
        return;
      }

      const { error } = await supabase.from('lesson_plans').insert({
        teacher_id: user.id,
        subject: formData.subject,
        grade_level: formData.gradeLevel,
        topic: formData.topic,
        duration: formData.duration,
        objectives: formData.objectives,
        content: generatedPlan,
      });

      if (error) throw error;

      alert('Lesson plan saved!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save lesson plan.');
    } finally {
      setSaving(false);
    }
  };

  const downloadLessonPlan = () => {
    const blob = new Blob([generatedPlan], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lesson-plan-${formData.topic.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #3A7AFE 0%, #5B9FFF 100%)' }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">AI Lesson Plan Generator</h1>
          </div>
          <p className="text-gray-600">Create comprehensive AI-powered lesson plans</p>
        </div>
      </motion.div>

      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg space-y-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-[#3A7AFE]" />
          <h3 className="text-lg font-semibold text-gray-800">Lesson Plan Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subject */}
          <div>
            <label className="block mb-1.5 font-medium text-gray-700">Subject *</label>
            <select
              className="w-full border border-gray-300 rounded-xl p-2.5 bg-white focus:ring-2 focus:ring-[#3A7AFE]/20 focus:border-[#3A7AFE] transition-all"
              value={formData.subject}
              onChange={e => handleChange('subject', e.target.value)}
            >
              <option value="">Select subject</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          {/* Grade Level */}
          <div>
            <label className="block mb-1.5 font-medium text-gray-700">Grade Level *</label>
            <select
              className="w-full border border-gray-300 rounded-xl p-2.5 bg-white focus:ring-2 focus:ring-[#3A7AFE]/20 focus:border-[#3A7AFE] transition-all"
              value={formData.gradeLevel}
              onChange={e => handleChange('gradeLevel', e.target.value)}
            >
              <option value="">Select Grade</option>
              {gradeLevels.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>

          {/* Topic */}
          <div>
            <label className="block mb-1.5 font-medium text-gray-700">Topic *</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-xl p-2.5 bg-white focus:ring-2 focus:ring-[#3A7AFE]/20 focus:border-[#3A7AFE] transition-all"
              value={formData.topic}
              onChange={e => handleChange('topic', e.target.value)}
              placeholder="e.g., Photosynthesis"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block mb-1.5 font-medium text-gray-700">Duration *</label>
            <select
              className="w-full border border-gray-300 rounded-xl p-2.5 bg-white focus:ring-2 focus:ring-[#3A7AFE]/20 focus:border-[#3A7AFE] transition-all"
              value={formData.duration}
              onChange={e => handleChange('duration', parseInt(e.target.value, 10))}
            >
              {durations.map(duration => (
                <option key={duration.value} value={duration.value}>
                  {duration.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Learning Objectives */}
        <div>
          <label className="block mb-1.5 font-medium text-gray-700">Learning Objectives *</label>
          <textarea
            rows={4}
            className="w-full border border-gray-300 rounded-xl p-2.5 bg-white focus:ring-2 focus:ring-[#3A7AFE]/20 focus:border-[#3A7AFE] transition-all"
            value={formData.objectives}
            onChange={e => handleChange('objectives', e.target.value)}
            placeholder="Enter clear learning goals for this lesson..."
          />
        </div>

        {/* Generate Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full text-white font-semibold py-3 rounded-xl flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          style={{
            background: 'linear-gradient(135deg, #3A7AFE 0%, #5B9FFF 100%)',
            boxShadow: '0 4px 14px rgba(58, 122, 254, 0.4)'
          }}
          onClick={generateLessonPlan}
          disabled={
            loading ||
            !formData.subject ||
            !formData.gradeLevel ||
            !formData.topic ||
            !formData.objectives
          }
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              Generating Lesson Plan...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Lesson Plan with AI
            </>
          )}
        </motion.button>

        {/* Info Tip */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-blue-900 font-medium">AI-Powered Generation</p>
            <p className="text-sm text-blue-700 mt-1">
              Our AI creates comprehensive lesson plans based on your inputs, including objectives, materials, activities, and assessments.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Generated Plan Section */}
      <AnimatePresence>
        {!!generatedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Header Bar */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-[#3A7AFE]/5 to-[#5B9FFF]/5">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #3A7AFE 0%, #5B9FFF 100%)' }}
                >
                  <Book className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Generated Lesson Plan</h3>
                  <p className="text-sm text-gray-500">AI-powered curriculum design</p>
                </div>
              </div>

              <div className="flex gap-2">
                {/* <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveLessonPlan}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl flex items-center gap-2 border-2 transition-all"
                  style={{ borderColor: '#3A7AFE', color: '#3A7AFE' }}
                >
                  {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                  Save
                </motion.button> */}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={downloadLessonPlan}
                  className="px-4 py-2 rounded-xl flex items-center gap-2 border-2 transition-all"
                  style={{ borderColor: '#3A7AFE', color: '#3A7AFE' }}
                >
                  <Download className="w-4 h-4" />
                  Download
                </motion.button>
              </div>
            </div>

            {/* Plan Content */}
            <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50/30">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                  {generatedPlan}
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
