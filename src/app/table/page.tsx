// app/users/page.tsx
"use client";
import { useState } from "react";
import AdvancedTable from "@/components/Table";

type User = { id: number; name: string; email: string; status: string; createdAt: string };

const initialUsers: User[] = [
  { id: 1, name: "Mohamed", email: "mohamed@example.com", status: "Active", createdAt: "2025-09-01" },
  { id: 2, name: "Sara", email: "sara@example.com", status: "Inactive", createdAt: "2025-09-05" },
  { id: 3, name: "Omar", email: "omar@example.com", status: "Active", createdAt: "2025-08-28" },
  { id: 4, name: "Ali", email: "ali@example.com", status: "Pending", createdAt: "2025-09-10" },
  { id: 5, name: "Layla", email: "layla@example.com", status: "Active", createdAt: "2025-07-20" },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const handleEdit = (user: User) => alert(`Editing ${user.name}`);
  const handleDelete = (user: User) =>
    setUsers((prev) => prev.filter((u) => u.id !== user.id));

  const columns = [
    { key: "id", header: "ID", sortable: true },
    { key: "name", header: "Name", sortable: true },
    { key: "email", header: "Email", sortable: true },
    {
      key: "status",
      header: "Status",
      render: (val: string) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            val === "Active"
              ? "bg-green-100 text-green-700"
              : val === "Inactive"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {val}
        </span>
      ),
    },
    { key: "createdAt", header: "Created At", sortable: true },
  ] as const;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Modern Users Table</h1>
      <AdvancedTable<User>
        columns={columns as any}
        data={users}
        rowKey="id"
        filterBy="createdAt"
        pageSize={3}
        actions={[
          { label: "Edit", onClick: handleEdit, className: "bg-blue-500 text-white hover:bg-blue-600" },
          { label: "Delete", onClick: handleDelete, className: "bg-red-500 text-white hover:bg-red-600" },
        ]}
      />
    </div>
  );
}
