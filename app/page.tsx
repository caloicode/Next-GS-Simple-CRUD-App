"use client";

import { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import FormModal from "@/components/FormModal";
import Table from "@/components/Table";
import DeleteConfirm from "@/components/DeleteConfirm";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentRow, setCurrentRow] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);

  // Delete dialog states
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRows = async () => {
    setLoading(true);
    const res = await fetch("/api/sheets");
    const json = await res.json();
    setData(json.data);
    setLoading(false);
  };

  const addRow = async (row: [string, string, string]) => {
    await fetch("/api/sheets", {
      method: "POST",
      body: JSON.stringify({
        firstName: row[0],
        lastName: row[1],
        email: row[2],
      }),
      headers: { "Content-Type": "application/json" },
    });
    fetchRows();
    setShowModal(false);
  };

  const updateRow = async (row: [string, string, string]) => {
    await fetch("/api/sheets/update", {
      method: "PUT",
      body: JSON.stringify({ row, index: currentRow.index }),
      headers: { "Content-Type": "application/json" },
    });
    fetchRows();
    setShowModal(false);
  };

  const handleDelete = (index: number) => {
    setRowToDelete(index);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (rowToDelete !== null) {
      await fetch("/api/sheets/delete", {
        method: "DELETE",
        body: JSON.stringify({ index: rowToDelete }),
        headers: { "Content-Type": "application/json" },
      });
      setShowDeleteDialog(false);
      setRowToDelete(null);
      fetchRows();
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-4">
      {/* Title and Plus Button */}
      <div className="flex justify-between items-center w-full max-w-4xl mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Next-GS CRUD Test
        </h1>
        <div className="w-full max-w-4xl flex justify-end mb-4">
          <button
            onClick={() => {
              setIsEdit(false);
              setCurrentRow(null);
              setShowModal(true);
            }}
            className="btn-blue text-sm px-4 py-2"
          >
            Add Row
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showModal && (
        <FormModal
          isEdit={isEdit}
          currentRow={currentRow}
          onClose={() => setShowModal(false)}
          onSuccess={fetchRows}
        />
      )}

      {/* Delete Dialog */}
      {showDeleteDialog && (
        <DeleteConfirm
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}

      {/* Data Table */}
      {loading ? (
        <p className="text-gray-600 dark:text-gray-300 mb-4">Loading data...</p>
      ) : (
        <Table
          data={data}
          onEdit={(row, index) => {
            setIsEdit(true);
            setCurrentRow({ ...row, index });
            setShowModal(true);
          }}
          onDelete={handleDelete}
        />
      )}
    </main>
  );
}
