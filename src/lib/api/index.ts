/**
 * API layer. All client-side API requests must use functions from this module.
 * Components and hooks must not call fetch() directly.
 */
export { apiFetcher, apiMutation } from "./client";
export {
  fetchAttendanceMine,
  fetchAttendanceMineHistory,
  fetchAttendanceList,
  attendanceStart,
  attendanceEnd,
} from "./attendance";
export { authLogin, authLogout, authGetMe } from "./auth";
export { uploadImage, type UploadImageResponse } from "./upload";
export { profileUpdate } from "./profile";
export {
  fetchAdminUsers,
  saveAdminUser,
  fetchPerformance,
} from "./admin";
export { reverseGeocode } from "./geocoding";
