import React from 'react';
import { Upload, Link, XCircle } from 'lucide-react';

interface ImageUploadSectionProps {
  uploadMethod: 'upload' | 'url';
  setUploadMethod: (method: 'upload' | 'url') => void;
  coverImageFile: File | null;
  coverImageUrl: string;
  coverImagePreview: string;
  handleImageFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setCoverImagePreview: (url: string) => void;
  setCoverImageFile: (file: File | null) => void;
  setCoverImageUrl: (url: string) => void;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  uploadMethod,
  setUploadMethod,
  coverImageFile,
  coverImageUrl,
  coverImagePreview,
  handleImageFileChange,
  handleUrlChange,
  setCoverImagePreview,
  setCoverImageFile,
  setCoverImageUrl,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-4">
        <button
          type="button"
          onClick={() => setUploadMethod('upload')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            uploadMethod === 'upload'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setUploadMethod('url')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            uploadMethod === 'url'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Link className="w-4 h-4" />
          Use URL
        </button>
      </div>

      {uploadMethod === 'upload' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Cover Image
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">PNG, JPG or JPEG (Max 5MB)</p>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
          </label>
          <input
            type="url"
            value={coverImageUrl}
            onChange={handleUrlChange}
            placeholder="https://example.com/book-cover.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {coverImagePreview && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preview
          </label>
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300">
            <img
              src={coverImagePreview}
              alt="Cover preview"
              className="w-full h-full object-contain"
              onError={() => {
                setCoverImagePreview('');
                alert('Failed to load image. Please check the URL or file.');
              }}
            />
            <button
              type="button"
              onClick={() => {
                setCoverImagePreview('');
                setCoverImageFile(null);
                setCoverImageUrl('');
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadSection;
