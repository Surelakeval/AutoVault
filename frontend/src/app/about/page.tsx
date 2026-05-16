import Image from "next/image";
import { ShieldCheck, Target, Users, Award } from "lucide-react";

export default function About() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center">
        <Image 
          src="/images/showroom.png" 
          alt="About AutoVault" 
          fill 
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">About AutoVault</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Redefining the way India buys and sells premium used cars.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16">
        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              At AutoVault, our mission is to bring transparency, trust, and convenience to the unorganized used car market. We believe that buying a second-hand car should be as exciting and reliable as buying a new one.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Every car on our platform goes through a rigorous 140-point inspection, ensuring that you only get the highest quality vehicles. With our easy financing and 1-year comprehensive warranty, we make the car buying journey seamless.
            </p>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden border border-border">
            <Image src="/images/showroom.png" alt="Showroom" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card border border-border p-8 rounded-2xl text-center">
              <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Trust</h3>
              <p className="text-muted-foreground text-sm">100% transparency in pricing and car history.</p>
            </div>
            <div className="bg-card border border-border p-8 rounded-2xl text-center">
              <Target className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Quality</h3>
              <p className="text-muted-foreground text-sm">Rigorous inspections to ensure premium quality.</p>
            </div>
            <div className="bg-card border border-border p-8 rounded-2xl text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Customer First</h3>
              <p className="text-muted-foreground text-sm">We go the extra mile for your satisfaction.</p>
            </div>
            <div className="bg-card border border-border p-8 rounded-2xl text-center">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Excellence</h3>
              <p className="text-muted-foreground text-sm">Delivering an unmatched premium experience.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
