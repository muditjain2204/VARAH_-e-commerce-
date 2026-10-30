import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Heart, Award, ShieldCheck, ArrowRight, Compass, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | MAA LAXMI — Handcrafted Indian Sarees",
  description:
    "Learn about MAA LAXMI, our rich heritage of Indian textile craftsmanship, master weavers, and dedication to authentic sarees.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-b from-primary/10 via-primary/5 to-transparent border-b border-border/60 py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            Our Heritage & Story
          </div>
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            Weaving the Soul of India into Every Thread
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            At MAA LAXMI, we celebrate centuries of Indian textile tradition, bridging the timeless artistry of master handloom artisans with the modern woman.
          </p>
        </div>
      </section>

      {/* Main Story */}
      <section className="container mx-auto max-w-5xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">
              The Journey of MAA LAXMI
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-foreground">
              A Tribute to Indian Weaving Legacies
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Founded with a deep reverence for the sacred handlooms of Bharat, <strong>MAA LAXMI</strong> was born from a singular passion: to preserve, nurture, and present authentic Indian sarees to connoisseurs around the world.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From the spiritual ghats of Varanasi where pure silk weaves catch the morning sun, to the temple towns of Kanchipuram with their legendary Korvai borders, our curated collections honor the master weavers whose skills have been passed down across generations.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Every saree in our collection is not merely an attire—it is an heirloom of culture, grace, and unmatched craftsmanship.
            </p>
          </div>

          <div className="bg-gradient-to-br from-primary/10 via-secondary to-primary/5 p-8 sm:p-10 rounded-3xl border border-primary/20 shadow-sm space-y-6">
            <h3 className="font-playfair text-2xl font-bold text-primary">
              Our Core Pillars
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-primary/15 text-primary shrink-0 mt-0.5">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">Authenticity Guaranteed</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    100% genuine silk, zari, and premium natural yarns, hand-inspected before dispatch.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-primary/15 text-primary shrink-0 mt-0.5">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">Direct Weaver Support</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Eliminating middlemen so artisan communities receive fair compensation and dignity.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-primary/15 text-primary shrink-0 mt-0.5">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">Honest Pricing & Trust</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Transparent pricing without luxury markups, backed by secure digital payments.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-secondary/60 border-y border-border py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <div className="font-playfair text-3xl sm:text-4xl font-bold text-primary">10,000+</div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium">Delighted Customers</div>
            </div>
            <div className="space-y-1">
              <div className="font-playfair text-3xl sm:text-4xl font-bold text-primary">20+</div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium">Weaving Hubs</div>
            </div>
            <div className="space-y-1">
              <div className="font-playfair text-3xl sm:text-4xl font-bold text-primary">100%</div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium">Inspected Quality</div>
            </div>
            <div className="space-y-1">
              <div className="font-playfair text-3xl sm:text-4xl font-bold text-primary">Pan-India</div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium">Express Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="container mx-auto max-w-5xl px-4 py-16 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="font-playfair text-3xl font-bold text-foreground">
            The Craft Behind Every Saree
          </h2>
          <p className="text-muted-foreground text-sm">
            A single traditional handloom saree can take anywhere from 10 days to 6 months to weave, embodying the devotion and artistry of our weavers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-xs space-y-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="font-semibold text-foreground text-base">Pure Raw Materials</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We handpick certified mulberry silk, high-grade cotton, zari tested for longevity, and sustainable natural fibers for an exquisite drape.
            </p>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border shadow-xs space-y-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="font-semibold text-foreground text-base">Master Artisan Weaving</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Crafted on traditional pit looms and jacquards by weaver clusters in Banaras, Kanchipuram, Surat, Chanderi, and Bengal.
            </p>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border shadow-xs space-y-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="font-semibold text-foreground text-base">Rigorous Quality Inspection</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every saree passes a comprehensive 3-step quality checklist covering weave uniformity, zari luster, and border finishing.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground p-8 sm:p-10 rounded-3xl text-center space-y-4 mt-8">
          <h3 className="font-playfair text-2xl sm:text-3xl font-bold">
            Experience the Elegance of Traditional Sarees
          </h3>
          <p className="text-primary-foreground/80 text-sm max-w-xl mx-auto">
            Discover our latest collection of Banarasi, Kanjeevaram, Silk, and Bridal sarees crafted for weddings, festivals, and unforgettable celebrations.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-background text-foreground hover:bg-secondary px-6 py-3 rounded-xl font-semibold text-sm transition-colors shadow-xs"
            >
              Explore Collection
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
