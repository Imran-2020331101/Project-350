import React from 'react';

const ImageModal = ({ isOpen, onClose, photo }) => {
  if (!isOpen || !photo) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition-all"
        >
          ×
        </button>
        
        {/* Image container */}
        <div className="flex flex-col">
          <div className="relative">
            <img 
              src={photo.url} 
              alt={photo.caption || "Gallery image"}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
          </div>
          
          {/* Caption */}
          {photo.caption && (
            <div className="p-6 bg-white">
              <p className="text-gray-800 text-lg leading-relaxed">
                {photo.caption}
              </p>
              {photo.uploadDate && (
                <p className="text-gray-500 text-sm mt-2">
                  Uploaded: {new Date(photo.uploadDate).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
