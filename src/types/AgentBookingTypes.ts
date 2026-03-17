export type CameStatus = "came" | "not_came" | "custom";

export type AgentBookingRow = {
  id: string;
  customerName: string;
  cruiseName: string;
  pax: number;
  contact: string;
  date: string;
  time: string;
  payment: string;
  b2b: string;
  htCommission: string;
  agentCommission: string;
  cameStatus: CameStatus;
  cameCustomText?: string;
};

export type AgentBookingFormValues = {
  customerName: string;
  cruiseName: string;
  pax: string;
  contact: string;
  date: string;
  time: string;
  payment: string;
  b2b: string;
  htCommission: string;
  agentCommission: string;
  cameStatus: CameStatus;
  cameCustomText: string;
};

