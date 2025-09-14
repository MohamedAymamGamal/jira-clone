"use client";
import React, { useState, useMemo } from "react";

type Column<T> = {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
};

type Action<T> = {
  label: string;
  onClick: (row: T) => void | Promise<void>;
  className?: string;
};

type AdvancedTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  actions?: Action<T>[];
  rowKey?: keyof T;
  pageSize?: number;
  filterBy?: keyof T; // key for date/time filter
};

export default function AdvancedTable<T extends Record<string, any>>({
  columns,
  data,
  actions,
  rowKey = "id" as keyof T,
  pageSize = 5,
  filterBy,
}: AdvancedTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{ key: keyof T; dir: "asc" | "desc" }>();
  const [dateFilter, setDateFilter] = useState("");

  // Filtering logic
  const filtered = useMemo(() => {
    return data.filter((row) => {
      const matchesSearch = Object.values(row).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      );

      const matchesDate =
        !filterBy || !dateFilter
          ? true
          : new Date(row[filterBy] as any) >= new Date(dateFilter);

      return matchesSearch && matchesDate;
    });
  }, [data, search, filterBy, dateFilter]);

  // Sorting
  const sorted = useMemo(() => {
    if (!sort) return filtered;
    return [...filtered].sort((a, b) => {
      const valA = a[sort.key];
      const valB = b[sort.key];
      if (valA < valB) return sort.dir === "asc" ? -1 : 1;
      if (valA > valB) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sort]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (col: Column<T>) => {
    if (!col.sortable) return;
    setSort((prev) => {
      if (prev?.key === col.key) {
        return { key: col.key, dir: prev.dir === "asc" ? "desc" : "asc" };
      }
      return { key: col.key, dir: "asc" };
    });
  };

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap gap-3 justify-between items-center bg-white p-3 rounded-lg shadow-sm border">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2 rounded-md w-60 shadow-sm focus:ring focus:ring-blue-200"
        />

        {filterBy && (
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-2 rounded-md shadow-sm focus:ring focus:ring-green-200"
          />
        )}

        <div className="text-sm text-gray-500">
          {filtered.length} results
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md border">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  onClick={() => handleSort(col)}
                  className={`px-4 py-3 text-left text-sm font-semibold text-gray-700 ${
                    col.sortable ? "cursor-pointer hover:text-blue-600" : ""
                  }`}
                >
                  {col.header}
                  {sort?.key === col.key && (
                    <span>{sort.dir === "asc" ? " 🔼" : " 🔽"}</span>
                  )}
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-sm">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {paginated.map((row, idx) => {
              const key = row[rowKey] ?? idx;
              return (
                <tr
                  key={String(key)}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {columns.map((col) => {
                    const value = row[col.key];
                    return (
                      <td
                        key={String(col.key)}
                        className="px-4 py-3 text-sm border-t"
                      >
                        {col.render ? col.render(value, row) : String(value)}
                      </td>
                    );
                  })}
                  {actions && (
                    <td className="px-4 py-3 border-t space-x-2">
                      {actions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => act.onClick(row)}
                          className={`px-3 py-1 rounded-md text-xs font-medium shadow-sm ${act.className ??
                            "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
                        >
                          {act.label}
                        </button>
                      ))}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </span>
        <div className="space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 shadow-sm"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 shadow-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
