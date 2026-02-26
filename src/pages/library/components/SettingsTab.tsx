import React, { useState, useEffect } from 'react';
import { Settings, Save, Plus, Trash2, Edit2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { LibrarySettings, Category } from '../../../types/library';

interface SettingsTabProps {
  settings: LibrarySettings | null;
  categories: Category[];
  onSettingsUpdate: () => void;
  onCategoriesUpdate: () => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ 
  settings, 
  categories, 
  onSettingsUpdate,
  onCategoriesUpdate 
}) => {
  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null);

  const [settingsForm, setSettingsForm] = useState({
    borrow_duration_days: 14,
    fine_per_day: 10,
    max_books_per_student: 3
  });

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        borrow_duration_days: settings.borrow_duration_days,
        fine_per_day: settings.fine_per_day,
        max_books_per_student: settings.max_books_per_student
      });
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('library_settings')
        .update(settingsForm)
        .eq('id', settings?.id);

      if (error) throw error;
      alert('Settings updated successfully!');
      onSettingsUpdate();
    } catch (error: any) {
      alert('Error updating settings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const { error } = await supabase
        .from('book_categories')
        .insert([{ name: newCategory.trim() }]);

      if (error) throw error;
      setNewCategory('');
      alert('Category added successfully!');
      onCategoriesUpdate();
    } catch (error: any) {
      alert('Error adding category: ' + error.message);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    try {
      const { error } = await supabase
        .from('book_categories')
        .update({ name: editingCategory.name })
        .eq('id', editingCategory.id);

      if (error) throw error;
      setEditingCategory(null);
      alert('Category updated successfully!');
      onCategoriesUpdate();
    } catch (error: any) {
      alert('Error updating category: ' + error.message);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const { error } = await supabase
        .from('book_categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;
      alert('Category deleted successfully!');
      onCategoriesUpdate();
    } catch (error: any) {
      alert('Error deleting category: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Library Settings */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Library Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Borrow Duration (Days)
            </label>
            <input
              type="number"
              value={settingsForm.borrow_duration_days}
              onChange={(e) => setSettingsForm(prev => ({ 
                ...prev, 
                borrow_duration_days: Number(e.target.value) 
              }))}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fine Per Day (₹)
            </label>
            <input
              type="number"
              value={settingsForm.fine_per_day}
              onChange={(e) => setSettingsForm(prev => ({ 
                ...prev, 
                fine_per_day: Number(e.target.value) 
              }))}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Books Per Student
            </label>
            <input
              type="number"
              value={settingsForm.max_books_per_student}
              onChange={(e) => setSettingsForm(prev => ({ 
                ...prev, 
                max_books_per_student: Number(e.target.value) 
              }))}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Category Management */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Book Categories</h3>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter new category name"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
          />
          <button
            onClick={handleAddCategory}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              {editingCategory?.id === category.id ? (
                <>
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={handleUpdateCategory}
                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm font-medium text-gray-700">{category.name}</span>
                  <button
                    onClick={() => setEditingCategory({ id: category.id, name: category.name })}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
