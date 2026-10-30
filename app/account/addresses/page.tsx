export const metadata = { title: "My Addresses" };

export default function AddressesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Saved Addresses</h1>
      <div className="flex items-center justify-center py-16 border border-dashed border-border rounded-xl">
        <div className="text-center space-y-3">
          <div className="text-5xl">📍</div>
          <p className="text-muted-foreground font-medium">No addresses saved</p>
          <p className="text-sm text-muted-foreground">
            Add an address for faster checkout
          </p>
        </div>
      </div>
    </div>
  );
}
