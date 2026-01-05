"use client";

import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, QrCode, Download, Printer } from "lucide-react";
import TableModal from "@/components/private/admin/table/table-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { QRCodeCanvas } from "qrcode.react";

type Table = {
  _id: string;
  number: string;
  capacity: number;
  status: "available" | "occupied" | "reserved";
};

export default function AdminTablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);
  const [baseOrigin, setBaseOrigin] = useState("");

  useEffect(() => {
    fetchTables();
    fetchSystemInfo();
  }, []);

  async function fetchSystemInfo() {
    try {
      const res = await fetch("/api/admin/system/info");
      const data = await res.json();
      if (data.ok) {
        setBaseOrigin(data.origin);
      } else {
        setBaseOrigin(window.location.origin);
      }
    } catch (err) {
      setBaseOrigin(window.location.origin);
    }
  }

  async function fetchTables() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/tables");
      const data = await res.json();
      if (data.ok) {
        setTables(data.tables);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setSelectedTable(null);
    setModalOpen(true);
  }

  function openEdit(table: Table) {
    setSelectedTable(table);
    setModalOpen(true);
  }

  function openDelete(id: string) {
    setToDeleteId(id);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!toDeleteId) return;
    try {
      const res = await fetch(`/api/admin/tables?id=${toDeleteId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.ok) {
        fetchTables();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setConfirmOpen(false);
      setToDeleteId(null);
    }
  }

  const downloadQR = (tableNumber: string, id: string) => {
    const canvas = document.getElementById(`qr-${id}`) as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `Table-${tableNumber}-QR.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const printQR = (tableNumber: string, id: string) => {
    const canvas = document.getElementById(`qr-${id}`) as HTMLCanvasElement;
    if (canvas) {
      const dataUrl = canvas.toDataURL();
      const windowContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print QR - Table ${tableNumber}</title>
            <style>
              @page { size: auto; margin: 0mm; }
              body { 
                margin: 0; 
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: center; 
                height: 100vh; 
                font-family: sans-serif; 
                overflow: hidden;
              }
              h1 { font-size: 80px; margin: 0 0 30px 0; font-weight: 900; }
              img { width: 600px; height: 600px; }
            </style>
          </head>
          <body>
            <h1>TABLE ${tableNumber}</h1>
            <img src="${dataUrl}" />
            <script>
              window.onload = () => { 
                window.print(); 
                setTimeout(() => window.close(), 100);
              };
            </script>
          </body>
        </html>
      `;
      const printWindow = window.open("", "", "width=800,height=800");
      printWindow?.document.write(windowContent);
      printWindow?.document.close();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Table Management
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Manage your restaurant tables and generate QR codes.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-6 py-6 h-auto shadow-lg shadow-indigo-100 flex gap-2 font-bold"
        >
          <Plus className="h-5 w-5" />
          Add New Table
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 bg-gray-50 animate-pulse rounded-[32px]"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tables.map((table) => (
            <div
              key={table._id}
              className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm hover:shadow-xl transition-all duration-500 group"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">
                    Table {table.number}
                  </h3>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
                    Capacity: {table.capacity} Persons
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    table.status === "available"
                      ? "bg-emerald-50 text-emerald-600"
                      : table.status === "occupied"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {table.status}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center bg-gray-50 rounded-[24px] p-8 mb-6 relative overflow-hidden">
                <QRCodeCanvas
                  id={`qr-${table._id}`}
                  value={`${baseOrigin || window.location.origin}/order?table=${
                    table._id
                  }`}
                  size={200}
                  level={"H"}
                  includeMargin={true}
                  className="relative z-10"
                />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4">
                  Scan to Order
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadQR(table.number, table._id)}
                  className="rounded-xl flex gap-2 font-bold text-xs py-5"
                >
                  <Download className="h-4 w-4" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => printQR(table.number, table._id)}
                  className="rounded-xl flex gap-2 font-bold text-xs py-5"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openEdit(table)}
                  className="rounded-xl flex gap-2 font-bold text-xs py-5"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => openDelete(table._id)}
                  className="rounded-xl flex gap-2 font-bold text-xs py-5 bg-rose-50 text-rose-600 hover:bg-rose-100 border-none"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tables.length === 0 && !loading && (
        <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
          <div className="bg-white h-16 w-16 rounded-2xl flex items-center justify-center shadow-sm mx-auto mb-4">
            <QrCode className="text-gray-300 h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No Tables Found</h3>
          <p className="text-gray-500 mt-2">
            Start by adding your first restaurant table.
          </p>
          <Button
            onClick={openCreate}
            variant="link"
            className="text-indigo-600 font-bold mt-2"
          >
            Add Table Now
          </Button>
        </div>
      )}

      <TableModal
        open={modalOpen}
        initial={selectedTable}
        onOpenChange={setModalOpen}
        onSaved={() => fetchTables()}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={confirmDelete}
        title="Delete Table"
        description="Are you sure you want to delete this table? This action cannot be undone."
      />
    </div>
  );
}
