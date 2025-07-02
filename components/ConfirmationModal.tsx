'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title: string;
  message: string;
  details?: {
    flight?: { id: string };
    hotel?: { id: string };
    car?: { id: string };
  } | Error | string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  details
}: ConfirmationModalProps) {
  const isSuccess = type === 'success';
    const router = useRouter();
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white bg-opacity-30 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {isSuccess ? (
                      <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
                    ) : (
                      <XCircleIcon className="h-8 w-8 text-red-500 mr-3" />
                    )}
                    <Dialog.Title
                      as="h3"
                      className={`text-lg font-semibold ${
                        isSuccess ? 'text-green-900' : 'text-red-900'
                      }`}
                    >
                      {title}
                    </Dialog.Title>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-gray-700 mb-4">{message}</p>
                  
                  {isSuccess && details && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h4 className="font-medium text-green-800 mb-2">Booking Details:</h4>
                      <div className="space-y-1 text-sm text-green-700">
                        {details.flight && (
                          <div className="flex items-center">
                            <span className="w-16">✈️ Flight:</span>
                            <span className="text-green-600 font-mono">#{details.flight.id.slice(0, 8)}...</span>
                          </div>
                        )}
                        {details.hotel && (
                          <div className="flex items-center">
                            <span className="w-16">🏨 Hotel:</span>
                            <span className="text-green-600 font-mono">#{details.hotel.id.slice(0, 8)}...</span>
                          </div>
                        )}
                        {details.car && (
                          <div className="flex items-center">
                            <span className="w-16">🚗 Car:</span>
                            <span className="text-green-600 font-mono">#{details.car.id.slice(0, 8)}...</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-green-600 mt-2">
                        📧 Confirmation emails will be sent shortly
                      </p>
                    </div>
                  )}

                  {!isSuccess && details && (
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                      <h4 className="font-medium text-red-800 mb-2">Error Details:</h4>
                      <p className="text-sm text-red-700">{details.toString()}</p>
                      <p className="text-xs text-red-600 mt-2">
                        💡 Try refreshing the page or contact support if the issue persists
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  {isSuccess ? (
                    <>
                      <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => {
                          onClose();
                          router.push('/mybookings'); 
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        View Bookings
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => {
                          onClose();
                          
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Try Again
                      </button>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
