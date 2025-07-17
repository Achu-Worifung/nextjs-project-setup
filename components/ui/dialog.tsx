import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
}

interface DialogTitleProps {
  children: React.ReactNode;
}

interface DialogDescriptionProps {
  children: React.ReactNode;
}

interface DialogFooterProps {
  children: React.ReactNode;
}

// Main Dialog component
export function Dialog({ isOpen, onClose, children }: DialogProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-white/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {children}
      </div>
    </div>
  );
}

// Dialog Content
export function DialogContent({ children, className = "" }: DialogContentProps) {
  return (
    <div className={`bg-white rounded-lg shadow-xl p-6 ${className}`}>
      {children}
    </div>
  );
}

// Dialog Header
export function DialogHeader({ children }: DialogHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      {children}
    </div>
  );
}

// Dialog Title
export function DialogTitle({ children }: DialogTitleProps) {
  return (
    <h2 className="text-lg font-semibold text-brand-gray-900">
      {children}
    </h2>
  );
}

// Dialog Description
export function DialogDescription({ children }: DialogDescriptionProps) {
  return (
    <p className="text-sm text-brand-gray-600 mb-6">
      {children}
    </p>
  );
}

// Dialog Footer
export function DialogFooter({ children }: DialogFooterProps) {
  return (
    <div className="flex justify-end gap-3">
      {children}
    </div>
  );
}

// Close button
interface DialogCloseProps {
  onClick: () => void;
}

export function DialogClose({ onClick }: DialogCloseProps) {
  return (
    <button
      onClick={onClick}
      className="text-gray-400 hover:text-brand-gray-600 transition-colors"
    >
      <X className="w-5 h-5" />
    </button>
  );
}


