import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-6xl">🪷</div>
        <h1 className="text-4xl font-bold text-foreground font-playfair">404</h1>
        <h2 className="text-xl font-medium text-foreground">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Link
            href="/"
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/products"
            className="px-6 py-2.5 border border-border text-foreground rounded-lg font-medium hover:bg-accent transition-colors"
          >
            Browse Sarees
          </Link>
        </div>
      </div>
    </div>
  );
}
