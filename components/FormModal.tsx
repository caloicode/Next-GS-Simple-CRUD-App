'use client';

import { useState, useEffect } from 'react';

type Props = {
  onClose: () => void;
  isEdit: boolean;
  currentRow: (string[] & { index: number }) | null;
  onSuccess: () => void; // Refetch rows on parent side after success
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
      setForm({
        firstName: currentRow[0] || '',
        lastName: currentRow[1] || '',
        email: currentRow[2] || '',
      });
    }
  }, [isEdit, currentRow]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
    };

    const url = isEdit ? '/api/sheets/update' : '/api/sheets';
    const method = isEdit ? 'PUT' : 'POST';
    const body = isEdit
      ? JSON.stringify({ row: [form.firstName, form.lastName, form.email], index: currentRow.index })
      : JSON.stringify(payload);

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    if (res.ok) {
      onSuccess(); // triggers refetch
      onClose();   // close modal
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
        <button onClick={onClose} className="btn w-full mt-4 text-gray-700 dark:text-gray-200">
          Close
        </button>
      </div>
    </div>
  );
}
