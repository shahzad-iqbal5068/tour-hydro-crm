/**
 * Central types barrel. Prefer importing from specific files for clarity:
 * - @/types/user, @/types/inquiry, @/types/booking, etc.
 * This file re-exports everything for backward compatibility.
 */

export type { SectionKey } from "./layout";
export type { SidebarSection, SidebarProps } from "./sidebar";
export type { AuthUser, Role, UserRow } from "./user";
export type { LoginValues } from "./auth";
export type { InquiryRow, InquiryFormValues } from "./inquiry";
export type {
  AttendanceRow,
  AttendanceMineResponse,
  AttendanceMineRecord,
  AttendanceHistoryItem,
  AttendanceListParams,
} from "./attendance";
export type {
  StarBookingCategory,
  StarBookingRow,
  GroupBookingRow,
  BookingVariantOption,
} from "./booking";
export type { FollowUpRow } from "./followup";
export type { PerformanceData, PerformanceRange } from "./admin";

export type {
  GroupDashboardLead,
  GroupDashboardFormValues,
  GroupDashboardStatus,
  GroupDashboardLocation,
  GroupDashboardVisitStatus,
  GroupDashboardReminderStatus,
  GroupDashboardWhatsApp,
  GroupDashboardFollowUpPriority,
  GroupDashboardPopupAlert,
  GroupDashboardLeadRow,
} from "./groupDashboard";
export {
  GROUP_DASHBOARD_BOOKING_STATUS_OPTIONS,
  GROUP_DASHBOARD_LOCATION_OPTIONS,
  GROUP_DASHBOARD_VISIT_STATUS_OPTIONS,
  GROUP_DASHBOARD_REMINDER_OPTIONS,
  GROUP_DASHBOARD_WHATSAPP_OPTIONS,
  GROUP_DASHBOARD_FOLLOW_UP_PRIORITY_OPTIONS,
  GROUP_DASHBOARD_POPUP_ALERT_OPTIONS,
} from "./groupDashboard";
