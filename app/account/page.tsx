export const metadata = { title: "My Account" };

export default function AccountPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Orders", value: "0", icon: "📦" },
          { label: "Wishlist Items", value: "0", icon: "❤️" },
          { label: "Saved Addresses", value: "0", icon: "📍" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-xl border border-border bg-background"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
