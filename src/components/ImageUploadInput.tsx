import React, { useState, useRef } from 'react';

interface ImageUploadInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  aspectRatio?: 'video' | 'square' | 'banner' | 'auto';
  helperText?: string;
  required?: boolean;
  id?: string;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Klik atau seret file foto ke sini',
  aspectRatio = 'video',
  helperText,
  required = false,
  id = 'image-upload'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress image if needed to keep storage/payload performant
  const processAndSetImage = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih file gambar yang valid (JPG, PNG, WEBP, SVG)');
      return;
    }

    setUploading(true);
    const fileName = file.name;
    const fileSizeFormatted = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;

      // If SVG, use as is
      if (file.type === 'image/svg+xml') {
        onChange(rawDataUrl);
        setFileInfo({ name: fileName, size: fileSizeFormatted });
        setUploading(false);
        return;
      }

      // Resize/compress high-res raster images with canvas
      const img = new Image();
      img.onload = () => {
        const maxDimension = 1600;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          onChange(compressedDataUrl);
        } else {
          onChange(rawDataUrl);
        }
        setFileInfo({ name: fileName, size: fileSizeFormatted });
        setUploading(false);
      };
      img.onerror = () => {
        onChange(rawDataUrl);
        setFileInfo({ name: fileName, size: fileSizeFormatted });
        setUploading(false);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processAndSetImage(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processAndSetImage(files[0]);
    }
  };

  const handleClear = () => {
    onChange('');
    setFileInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const ratioClasses = {
    video: 'h-48 md:h-52',
    square: 'h-40 w-40 md:h-48 md:w-48',
    banner: 'h-36 md:h-44',
    auto: 'h-48'
  }[aspectRatio];

  return (
    <div className="flex flex-col gap-2 w-full" id={id}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-primary">image</span>
          <span>{label}</span>
          {required && <span className="text-red-500">*</span>}
        </label>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-primary hover:underline font-medium flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[14px]">
            {showUrlInput ? 'upload_file' : 'link'}
          </span>
          <span>{showUrlInput ? 'Upload File Lokal' : 'Gunakan URL Gambar'}</span>
        </button>
      </div>

      {showUrlInput ? (
        <div className="flex flex-col gap-2">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              link
            </span>
            <input
              type="url"
              placeholder="https://images.unsplash.com/... atau tautan gambar langsung"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="w-full border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-primary"
            />
          </div>
          {value && (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-1">
              <img
                src={value}
                alt="Preview URL"
                className="w-full h-36 object-cover rounded-lg"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-3 right-3 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700 cursor-pointer"
                title="Hapus gambar"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {value ? (
            /* PREVIEW STATE */
            <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-2 overflow-hidden group">
              <div className={`relative w-full ${ratioClasses} rounded-lg overflow-hidden bg-slate-900/5 flex items-center justify-center`}>
                <img
                  src={value}
                  alt={label}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white text-slate-800 hover:bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary">sync</span>
                    <span>Ganti File</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    <span>Hapus</span>
                  </button>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between px-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-green-600 text-[18px]">check_circle</span>
                  <div className="text-[11px] text-slate-600 truncate">
                    {fileInfo ? (
                      <span>
                        <strong className="text-slate-800">{fileInfo.name}</strong> ({fileInfo.size})
                      </span>
                    ) : (
                      <span className="text-slate-700 font-medium">Foto siap digunakan</span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-primary font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">upload</span>
                  <span>Ganti File</span>
                </button>
              </div>
            </div>
          ) : (
            /* UPLOAD DROPZONE */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-primary bg-primary/5 scale-[0.99]'
                  : 'border-slate-300 hover:border-primary hover:bg-slate-50'
              }`}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2 py-4">
                  <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-bold text-primary">Memproses gambar...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[26px]">add_photo_alternate</span>
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 block">
                      {placeholder}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      Format: PNG, JPG, JPEG, WEBP, SVG (Maks. 10MB)
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-white text-[11px] font-bold rounded-lg mt-1 shadow-xs">
                    <span className="material-symbols-outlined text-[14px]">file_upload</span>
                    <span>Pilih File dari Perangkat</span>
                  </span>
                </div>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {helperText && <span className="text-[11px] text-slate-500">{helperText}</span>}
    </div>
  );
};
