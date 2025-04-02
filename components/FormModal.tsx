'use client';

import { useState, useEffect } from 'react';

type RowData = [string, string, string];

type Props = {
  onClose: () => void;
  isEdit: boolean;
  currentRow: { data: RowData; index: number } | null;
  onSuccess: () => void;
};

export default function FormModal({
  onClose,
  isEdit,
  currentRow,
  onSuccess,
}: Props) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    if (isEdit && currentRow) {
      const [firstName, lastName, email] = currentRow.data;
      setForm({ firstName, lastName, email });
    }
  }, [isEdit, currentRow]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const row: RowData = [form.firstName, form.lastName, form.email];

    const res = await fetch(isEdit ? '/api/sheets/update' : '/api/sheets', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        isEdit
          ? { row, index: currentRow?.index }
          : { firstName: row[0], lastName: row[1], email: row[2] }
      ),
    });

    if (res.ok) {
      onSuccess();
      onClose();
    } else {
      console.error('Failed to submit:', await res.json());
      alert('Submission failed. Check console for details.');
    }
  };

  return (
    <div className="modal-bg">
      <div className="card w-full max-w-sm">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          {isEdit ? 'Edit Row' : 'Add New Row'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="input-base text-black"
            required
          />
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="input-base text-black"
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="input-base text-black"
            required
          />
          <button type="submit" className="btn-blue w-full">
            {isEdit ? 'Save Changes' : 'Add Row'}
          </button>
        </form>
        <button
          onClick={onClose}
          className="btn w-full mt-4 text-gray-700 dark:text-gray-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}
