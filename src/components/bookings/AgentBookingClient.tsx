"use client";

import { useMemo, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import AgentBookingTable from "./AgentBookingTable";
import AgentBookingForm from "./AgentBookingForm";
import type {
  AgentBookingFormValues,
  AgentBookingRow,
} from "@/types/AgentBookingTypes";
import { useAgentBookings } from "@/hooks/api";

function mapRowToFormValues(row: AgentBookingRow): AgentBookingFormValues {
  return {
    customerName: row.customerName,
    cruiseName: row.cruiseName ?? "",
    pax: String(row.pax ?? ""),
    contact: row.contact,
    date: row.date ?? "",
    time: row.time ?? "",
    payment: row.payment ?? "",
    b2b: row.b2b ?? "",
    htCommission: row.htCommission ?? "",
    agentCommission: row.agentCommission ?? "",
    cameStatus: row.cameStatus,
    cameCustomText: row.cameCustomText ?? "",
  };
}

export default function AgentBookingClient() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: rows, createMutation, updateMutation, deleteMutation } =
    useAgentBookings();

  const initialValues = useMemo(() => {
    if (!selectedId) return null;
    const row = rows.find((r) => r.id === selectedId);
    return row ? mapRowToFormValues(row) : null;
  }, [rows, selectedId]);

  const handleAddAgentClick = () => {
    setSelectedId(null);
    setShowForm(true);
  };

  const handleSubmit = async (values: AgentBookingFormValues) => {
    const payload = {
      customerName: values.customerName,
      cruiseName: values.cruiseName || undefined,
      pax: Number(values.pax) || 0,
      contact: values.contact,
      date: values.date || undefined,
      time: values.time || undefined,
      payment: values.payment || undefined,
      b2b: values.b2b || undefined,
      htCommission: values.htCommission || undefined,
      agentCommission: values.agentCommission || undefined,
      cameStatus: values.cameStatus,
      cameCustomText: values.cameCustomText || undefined,
    };

    try {
      if (selectedId) {
        await updateMutation.mutateAsync({ id: selectedId, body: payload });
        toast.success("Agent booking updated");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Agent booking added");
      }
      setSelectedId(null);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save agent booking");
    }
  };

  const handleCancel = () => {
    setSelectedId(null);
    setShowForm(false);
  };

  const handleEdit = (row: AgentBookingRow) => {
    setSelectedId(row.id);
    setShowForm(true);
  };

  const handleDelete = async (row: AgentBookingRow) => {
    if (!window.confirm(`Delete agent booking for ${row.customerName}?`)) {
      return;
    }
    try {
      await deleteMutation.mutateAsync(row.id);
      toast.success("Agent booking deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete agent booking");
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row">
      <Toaster position="top-right" />
      <div className="flex-1">
        <AgentBookingTable
          data={rows}
          onAddAgentClick={handleAddAgentClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {showForm && (
        <div className="w-full max-w-md lg:sticky lg:top-4">
          <AgentBookingForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
}

