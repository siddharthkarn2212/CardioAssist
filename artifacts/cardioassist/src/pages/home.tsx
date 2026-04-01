import { Link } from "wouter";
import { Activity, ShieldCheck, Database, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomePage() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="pt-16 pb-12 flex flex-col items-center text-center gap-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-secondary text-secondary bg-secondary/10 mb-4">
          Clinical Grade Risk Assessment
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-primary">
          Precision Heart Disease <br className="hidden sm:inline" />
          <span className="text-secondary">Risk Prediction</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mt-4">
          Empowering medical professionals with advanced machine learning diagnostics. 
          CardioAssist AI analyzes 13 clinical parameters to accurately predict heart disease risk.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-primary-foreground font-semibold px-8">
            <Link href="/dashboard">Launch Dashboard</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="px-8">
            <Link href="/about">How it Works</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="bg-card p-6 rounded-xl border shadow-sm flex flex-col items-center text-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold">Reliable Diagnostics</h3>
          <p className="text-muted-foreground text-sm">
            Trained on the highly respected Cleveland Heart Disease dataset, providing accurate risk assessments you can trust.
          </p>
        </div>
        <div className="bg-card p-6 rounded-xl border shadow-sm flex flex-col items-center text-center gap-4">
          <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
            <Database className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold">Comprehensive Data</h3>
          <p className="text-muted-foreground text-sm">
            Evaluates 13 distinct medical parameters from blood pressure to resting ECG results for a complete picture.
          </p>
        </div>
        <div className="bg-card p-6 rounded-xl border shadow-sm flex flex-col items-center text-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Stethoscope className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold">Clinical Actionability</h3>
          <p className="text-muted-foreground text-sm">
            Delivers a clear probability score alongside binary risk classification to guide further clinical investigation.
          </p>
        </div>
      </section>
    </div>
  );
}
