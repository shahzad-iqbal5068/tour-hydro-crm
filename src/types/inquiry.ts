/**
 * Inquiry types (inqueries table and form).
 */

export type InquiryRow = {
  _id: string;
  date: string;
  shift: string;
  whatsappName: string;
  remarks?: string;
  name?: string | null;
  userId?: string | null;
};

export type InquiryFormValues = {
  date: string;
  shift: string;
  whatsappName: string;
  remarks: string;
  userId: string;
};
