import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notification Settings | Hydro CRM",
};

function Toggle({ on = true }: { on?: boolean }) {
  return (
    <button
      type="button"
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        on ? "bg-blue-500" : "bg-zinc-600"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
          on ? "translate-x-4" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function NotificationSettingsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Notifications
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Dummy notification settings – toggles do not persist yet.
        </p>
      </header>

      <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Email Notifications
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Customize your application and email notifications.
          </p>
        </div>

        <div className="space-y-2">
          {[
            {
              title: "Requests to join team",
              desc: "Receive notifications when someone wants to join your team.",
              on: true,
            },
            {
              title: "Contact messages",
              desc: "Receive notifications when someone sends you a message on the app.",
              on: true,
            },
            {
              title: "News and updates",
              desc: "Receive notifications when we have new features or improvements.",
              on: true,
            },
            {
              title: "Security alerts",
              desc: "Notifications when there are changes related to your account security.",
              on: false,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div>
                <div className="text-xs font-medium text-zinc-900 dark:text-zinc-50">
                  {item.title}
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {item.desc}
                </div>
              </div>
              <Toggle on={item.on} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

