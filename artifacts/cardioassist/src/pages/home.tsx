import { Link } from "wouter";
import { ArrowRight, ShieldCheck, Database, Stethoscope, Brain, BarChart3, Lock } from "lucide-react";

export function HomePage() {
  const stats = [
    { value: "85.3%", label: "Model Accuracy" },
    { value: "303", label: "Training Samples" },
    { value: "13", label: "Clinical Features" },
    { value: "87.1%", label: "Precision Score" },
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: "Clinical-Grade Accuracy",
      desc: "Trained on the Cleveland Heart Disease dataset — the benchmark used by researchers worldwide. Every prediction is backed by rigorous statistical validation.",
      color: "text-[#0d9488]",
      bg: "bg-[#0d9488]/10",
    },
    {
      icon: Brain,
      title: "Transparent Predictions",
      desc: "Uses Logistic Regression for full interpretability. See exactly which clinical factors are driving the risk score — not a black-box answer.",
      color: "text-blue-600",
      bg: "bg-blue-600/10",
    },
    {
      icon: BarChart3,
      title: "Rich Analytics",
      desc: "Detailed model performance metrics, feature importance charts, and probability scores — everything you need to understand the prediction.",
      color: "text-violet-600",
      bg: "bg-violet-600/10",
    },
    {
      icon: Database,
      title: "13 Parameters",
      desc: "Evaluates age, blood pressure, cholesterol, ECG results, maximum heart rate, and more for a comprehensive cardiovascular profile.",
      color: "text-amber-600",
      bg: "bg-amber-600/10",
    },
    {
      icon: Stethoscope,
      title: "For Clinicians",
      desc: "Designed as a decision-support tool for medical professionals. Clear outputs, clinically meaningful features, and a strict disclaimer.",
      color: "text-rose-600",
      bg: "bg-rose-600/10",
    },
    {
      icon: Lock,
      title: "Private by Design",
      desc: "All analysis happens in real-time on your inputs. No patient data is stored, logged, or transmitted beyond the prediction endpoint.",
      color: "text-[#0d9488]",
      bg: "bg-[#0d9488]/10",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#0d9488]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />

        <div className="relative container mx-auto px-6 pt-24 pb-28 flex flex-col items-center text-center gap-8 max-w-5xl">
          {/* Badge */}
          <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-[#5eead4] tracking-wide uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0d9488] animate-pulse" />
            Machine Learning &bull; Heart Disease Prediction
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            Predict Heart Disease Risk<br />
            <span className="text-transparent bg-clip-text" style={{backgroundImage: "linear-gradient(90deg, #2dd4bf, #38bdf8)"}}>
              with Precision
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300/90 max-w-2xl leading-relaxed">
            CardioAssist analyzes 13 clinical parameters using a validated machine learning model
            to assess cardiovascular risk accurately and transparently.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/dashboard">
              <button
                data-testid="button-launch-dashboard"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white text-base shadow-lg transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: "linear-gradient(135deg, #0d9488, #0891b2)" }}
              >
                Launch Dashboard
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link href="/analytics">
              <button
                data-testid="button-view-analytics"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white/90 text-base border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-white/15 hover:-translate-y-0.5"
              >
                View Model Analytics
              </button>
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden w-full max-w-3xl">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 py-5 px-4 bg-white/5 backdrop-blur-sm">
                <span className="text-2xl sm:text-3xl font-extrabold text-white">{s.value}</span>
                <span className="text-xs text-slate-400 font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="container mx-auto px-6 py-24 max-w-6xl">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-[#0d9488] uppercase tracking-widest mb-3">Why CardioAssist</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Built for accuracy. Designed for clarity.
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            A research-grade ML pipeline wrapped in a tool anyone can use.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group bg-card rounded-2xl border border-border/70 p-7 card-hover shadow-sm"
            >
              <div className={`h-11 w-11 rounded-xl ${f.bg} flex items-center justify-center mb-5`}>
                <f.icon className={`h-5 w-5 ${f.color}`} strokeWidth={1.8} />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container mx-auto px-6 pb-24 max-w-4xl">
        <div
          className="rounded-3xl p-10 text-center flex flex-col items-center gap-6 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0f172a 0%, #0d2744 60%, #0c1a2e 100%)" }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#0d9488]/20 blur-3xl pointer-events-none" />
          <h2 className="relative text-2xl sm:text-3xl font-extrabold text-white">
            Ready to assess cardiovascular risk?
          </h2>
          <p className="relative text-slate-300/80 max-w-lg">
            Enter 13 clinical parameters and receive an instant, model-backed risk classification with probability score.
          </p>
          <Link href="/dashboard">
            <button
              data-testid="button-cta-dashboard"
              className="relative inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white text-base transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 shadow-lg"
              style={{ background: "linear-gradient(135deg, #0d9488, #0891b2)" }}
            >
              Start Risk Assessment
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
