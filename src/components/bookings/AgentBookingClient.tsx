"use client";

import { useState } from "react";
import AgentBookingTable from "./AgentBookingTable";
import AgentBookingForm from "./AgentBookingForm";
import type {
  AgentBookingFormValues,
  AgentBookingRow,
} from "./AgentBookingTypes";

function mapFormToRow(values: AgentBookingFormValues): AgentBookingRow {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    customerName: values.customerName,
    cruiseName: values.cruiseName,
    pax: Number(values.pax) || 0,
    contact: values.contact,
    date: values.date,
    time: values.time,
    payment: values.payment,
    b2b: values.b2b,
    htCommission: values.htCommission,
    agentCommission: values.agentCommission,
    cameStatus: values.cameStatus,
    cameCustomText: values.cameCustomText || undefined,
  };
}

export default function AgentBookingClient() {
  const [rows, setRows] = useState<AgentBookingRow[]>([]);
  const [showForm, setShowForm] = useState(false);

  const handleAddAgentClick = () => {
    setShowForm(true);
  };

  const handleSubmit = (values: AgentBookingFormValues) => {
    const newRow = mapFormToRow(values);
    setRows((prev) => [newRow, ...prev]);
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row">
      <div className="flex-1">
        <AgentBookingTable data={rows} onAddAgentClick={handleAddAgentClick} />
      </div>

      {showForm && (
        <div className="w-full max-w-md lg:sticky lg:top-4">
          <AgentBookingForm
            initialValues={null}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
}

