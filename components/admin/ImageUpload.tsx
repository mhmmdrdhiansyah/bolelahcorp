'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/Alert';

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export function ImageUpload({
  label = 'Upload Image',
  value,
  onChange,
  onRemove,
  disabled = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync preview with value prop (important for edit mode)
  useEffect(() => {
    setPreview(value || '');
  }, [value]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (1MB)
    if (file.size > 1 * 1024 * 1024) {
      setError('File size exceeds 1MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file format. Allowed: JPG, PNG, GIF, WebP');
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Upload failed');
      }

      setPreview(result.data.url);
      onChange(result.data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    if (preview && preview.startsWith('/uploads/')) {
      // Delete from server
      try {
        await fetch(`/api/admin/upload?url=${encodeURIComponent(preview)}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.error('Failed to delete image from server:', err);
      }
    }
    setPreview('');
    onRemove();
  };

  return (
    <div className="space-y-3">
      {label && <p className="text-sm font-medium text-mist">{label}</p>}

      {/* Error Alert */}
      {error && <Alert variant="error">{error}</Alert>}

      {/* Upload Area */}
      {!preview ? (
        <div className="border-2 border-dashed border-mist/30 rounded-lg p-6 text-center hover:border-coral/50 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            disabled={isUploading || disabled}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`cursor-pointer ${isUploading || disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="space-y-2">
              <div className="text-3xl">📷</div>
              <p className="text-sm text-off-white font-medium">
                {isUploading ? 'Uploading...' : 'Click to upload image'}
              </p>
              <p className="text-xs text-mist">
                JPG, PNG, GIF, WebP (max 1MB)
              </p>
            </div>
          </label>
        </div>
      ) : (
        /* Preview */
        <div className="relative group">
          <div className="relative w-full h-48 rounded-lg overflow-hidden bg-white/10 border border-mist/20">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            {/* Remove Button Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                onClick={handleRemove}
                disabled={isUploading || disabled}
                variant="danger"
                size="sm"
              >
                🗑️ Remove Image
              </Button>
            </div>
          </div>
          {/* URL Display - Read Only */}
          <p className="text-xs text-mist/70 mt-2 truncate">{preview}</p>
        </div>
      )}
    </div>
  );
}
