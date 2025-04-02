"use client";

import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

type RowData = [string, string, string];

type Props = {
  data: RowData[];
  onEdit: (row: RowData, index: number) => void;
  onDelete: (index: number) => void;
};

export default function Table({ data, onEdit, onDelete }: Props) {
  return (
    <div className="w-full max-w-4xl overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-gray-600 uppercase text-xs tracking-wider">
          <tr className="bg-gray-200 dark:bg-neutral-800">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="odd:bg-gray-50 even:bg-white dark:odd:bg-neutral-800 dark:even:bg-neutral-900 text-gray-800 dark:text-gray-100"
            >
              <td className="px-4 py-3">
                {row[0]} {row[1]}
              </td>
              <td className="px-4 py-3">{row[2]}</td>
              <td className="px-4 py-3 flex items-center justify-center gap-2">
                <button className="icon-btn" onClick={() => onEdit(row, index)}>
                  <PencilIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </button>
                <button className="icon-btn" onClick={() => onDelete(index)}>
                  <TrashIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
