# Role-based permissions

This document describes which roles can do what, and how to use permissions in the codebase.

## Roles

| Role         | Description                          |
| ------------ | ------------------------------------ |
| SUPER_ADMIN  | Full access; can manage users and all data. |
| ADMIN        | Same as SUPER_ADMIN for features; can manage users and view all attendance. |
| MANAGER      | Dashboard, inquiries, bookings, own attendance, **view all attendance** (no user management). |
| CEO          | Same as MANAGER.                     |
| SALES_EXEC   | Dashboard, inquiries, bookings, own attendance only. |
| CALL_PERSON  | Same as SALES_EXEC.                  |

## Permission matrix

| Permission             | SUPER_ADMIN | ADMIN | MANAGER | CEO | SALES_EXEC | CALL_PERSON |
| ---------------------- | ----------- | ----- | ------- | --- | ---------- | ----------- |
| VIEW_DASHBOARD         | ✅          | ✅    | ✅      | ✅  | ✅         | ✅          |
| VIEW_INQUIRIES         | ✅          | ✅    | ✅      | ✅  | ✅         | ✅          |
| CREATE_INQUIRY         | ✅          | ✅    | ✅      | ✅  | ✅         | ✅          |
| EDIT_INQUIRY           | ✅          | ✅    | ✅      | ✅  | ✅         | ✅          |
| DELETE_INQUIRY         | ✅          | ✅    | ✅      | ✅  | ✅         | ✅          |
| VIEW_BOOKINGS           | ✅          | ✅    | ✅      | ✅  | ✅         | ✅          |
| MANAGE_BOOKINGS         | ✅          | ✅    | ✅      | ✅  | ✅         | ✅          |
| VIEW_OWN_ATTENDANCE     | ✅          | ✅    | ✅      | ✅  | ✅         | ✅          |
| MANAGE_OWN_ATTENDANCE   | ✅          | ✅    | ✅      | ✅  | ✅         | ✅          |
| VIEW_ALL_ATTENDANCE     | ✅          | ✅    | ✅      | ✅  | ❌         | ❌          |
| MANAGE_USERS            | ✅          | ✅    | ❌      | ❌  | ❌         | ❌          |

## Where permissions are enforced

- **API**
  - `GET/POST /api/admin/users` → requires `MANAGE_USERS`.
  - `GET /api/attendance` (list all) → requires `VIEW_ALL_ATTENDANCE`.
  - Other APIs (inquiries, bookings, profile, attendance start/end, auth) require a valid session only (any role).
- **UI**
  - The **Admin** sidebar section (Users, Attendance overview) is shown only if the user has **either** `MANAGE_USERS` **or** `VIEW_ALL_ATTENDANCE` (see `AppShell` + `permissions-config`).

## How to use in code

### 1. Define permissions (single source of truth)

Permissions and which roles have them are defined in **`src/lib/permissions-config.ts`**. This file is safe to use on both client and server.

- **Constants:** `Permission.VIEW_DASHBOARD`, `Permission.MANAGE_USERS`, etc.
- **Role–permission map:** `ROLE_PERMISSIONS`.
- **Helper:** `hasPermission(role: string, permission: PermissionKey): boolean`.

To change what a role can do, edit `ROLE_PERMISSIONS` in `permissions-config.ts`.

### 2. Protect API routes (server)

Use **`src/lib/permissions.ts`** (server-only; uses cookies and JWT):

```ts
import { requirePermission, Permission } from "@/lib/permissions";

export async function GET() {
  const auth = await requirePermission(Permission.MANAGE_USERS);
  if (!auth.ok) return auth.response;
  const user = auth.user; // { id, email, name, role, avatarUrl? }
  // ... your handler
}
```

- `requirePermission(permission)` returns:
  - `{ ok: true, user }` if the request has a valid token and the user’s role has that permission.
  - `{ ok: false, response }` with 401 (no/invalid token) or 403 (no permission); return `auth.response`.
- For “any logged-in user” use `requireAuth()` from the same file.

### 3. Control UI by role (client)

Use **`src/lib/permissions-config.ts`** so the client never imports server-only code:

```ts
import { hasPermission, Permission } from "@/lib/permissions-config";

// user.role comes from your auth state (e.g. decoded JWT in AppShell)
if (hasPermission(user.role, Permission.MANAGE_USERS)) {
  // show Admin menu / button
}
```

Example: in `AppShell`, sidebar sections can have `requiredPermissions: [Permission.MANAGE_USERS, Permission.VIEW_ALL_ATTENDANCE]`. Only sections where the user has at least one of these permissions are passed to the Sidebar.

### 4. Adding a new permission

1. **Add the constant** in `src/lib/permissions-config.ts`:
   - Add a new key to `Permission`.
   - Add an entry in `ROLE_PERMISSIONS` listing the roles that have it.
2. **Use in API:** In the route handler, call `requirePermission(Permission.YOUR_NEW_PERMISSION)` and return `auth.response` when `!auth.ok`.
3. **Use in UI:** Where you need to hide/show by role, use `hasPermission(user.role, Permission.YOUR_NEW_PERMISSION)` (and optionally add `requiredPermissions` to a sidebar section in `AppShell`).
4. **Document:** Update this file and the matrix above.

## Creating documents (e.g. inquiries, bookings)

When a user creates or updates a document via the API:

- **Authorization:** Use `requireAuth()` or `requirePermission(...)` at the start of the route so only allowed roles can call it.
- **Who created it:** Store `createdBy` / `updatedBy` with `auth.user.id` (or the full user object) so you can later filter or display by owner.
- **Scoping:** If you need “users see only their own”, filter by `auth.user.id` in the query (e.g. `Inquiry.find({ createdBy: auth.user.id })`). For “managers see all”, use a permission like `VIEW_ALL_*` and branch the query on `hasPermission(auth.user.role, Permission.VIEW_ALL_INQUIRIES)` (after adding that permission and protecting the route).

Example pattern for a create endpoint:

```ts
export async function POST(request: NextRequest) {
  const auth = await requirePermission(Permission.CREATE_INQUIRY);
  if (!auth.ok) return auth.response;

  const body = await request.json();
  await connectToDatabase();
  const doc = await Inquiry.create({
    ...body,
    createdBy: auth.user.id,
  });
  return NextResponse.json(doc, { status: 201 });
}
```

Use the same pattern for update/delete with the appropriate permission (e.g. `EDIT_INQUIRY`, `DELETE_INQUIRY`) and, if needed, an extra check that the document belongs to the user (or that the user has an “admin” permission).
