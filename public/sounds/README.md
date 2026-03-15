# Notification sounds

Place your notification sound file here so the Group Dashboard alerts can play it.

- **Required file:** `notification.wav` (or use `notification.mp3` and update the path in `GroupDashboardAlerts.tsx`)

The app will try to play `/sounds/notification.wav` when new alerts appear. Browsers may block audio until the user has interacted with the page (e.g. clicked somewhere).
