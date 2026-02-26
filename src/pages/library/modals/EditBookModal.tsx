import React, { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Book, Category } from '../../../types/library';
import ImageUploadSection from '../../library/components/ImageUploadSection';

interface EditBookModalProps {
  book: Book;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}

const EditBookModal: React.FC<EditBookModalProps> = ({ book, categories, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'url'>('url');
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState(book.cover_url || '');
  const [coverImagePreview, setCoverImagePreview] = useState(book.cover_url || '');

  const [formData, setFormData] = useState({
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    category: book.category,
    location: book.location,
    shelf_no: book.shelf_no,
    section: book.section,
    quantity: book.quantity,
    available_quantity: book.available_quantity,
    status: book.status
  });

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setCoverImageUrl(url);
    if (url) {
      setCoverImagePreview(url);
    }
  };

  const uploadCoverImage = async (): Promise<string | null> => {
    if (uploadMethod === 'url' && coverImageUrl) {
      return coverImageUrl;
    }

    if (uploadMethod === 'upload' && coverImageFile) {
      const fileName = `${Date.now()}-${coverImageFile.name}`;
      const { data, error } = await supabase.storage
        .from('book-covers')
        .upload(fileName, coverImageFile);

      if (error) {
        console.error('Error uploading image:', error);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('book-covers')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    }

    return coverImagePreview || null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const coverUrl = await uploadCoverImage();

      const { error } = await supabase
        .from('books')
        .update({
          ...formData,
          cover_url: coverUrl,
          quantity: Number(formData.quantity),
          available_quantity: Number(formData.available_quantity)
        })
        .eq('id', book.id);

      if (error) throw error;

      alert('Book updated successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error updating book:', error);
      alert('Error updating book: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Edit Book</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Book Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ISBN *
              </label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section *
              </label>
              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shelf Number *
              </label>
              <input
                type="text"
                name="shelf_no"
                value={formData.shelf_no}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Quantity *
              </label>
              <input
                type="number"
                name="available_quantity"
                value={formData.available_quantity}
                onChange={handleChange}
                min="0"
                max={formData.quantity}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Available">Available</option>
                <option value="Checked Out">Checked Out</option>
                <option value="Reserved">Reserved</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Book Cover Image
            </label>
            <ImageUploadSection
              uploadMethod={uploadMethod}
              setUploadMethod={setUploadMethod}
              coverImageFile={coverImageFile}
              coverImageUrl={coverImageUrl}
              coverImagePreview={coverImagePreview}
              handleImageFileChange={handleImageFileChange}
              handleUrlChange={handleUrlChange}
              setCoverImagePreview={setCoverImagePreview}
              setCoverImageFile={setCoverImageFile}
              setCoverImageUrl={setCoverImageUrl}
            />
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Update Book
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookModal;
