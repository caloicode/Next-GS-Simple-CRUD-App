"use client";

import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";

type Props = {
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteConfirm({ onConfirm, onCancel }: Props) {
  return (
    <div className="modal-bg">
      <div className="card w-full max-w-sm text-center space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Are you sure you want to delete this?
        </h2>

        <div className="flex justify-center gap-6">
          <button
            onClick={onConfirm}
            className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition"
            aria-label="Confirm Delete"
          >
            <CheckIcon className="w-6 h-6" />
          </button>
          <button
            onClick={onCancel}
            className="p-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full transition dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            aria-label="Cancel Delete"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
