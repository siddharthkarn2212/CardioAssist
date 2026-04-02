import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, FlaskConical, BookOpen, ShieldAlert } from "lucide-react";

export function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-4xl space-y-10 pb-20">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold text-[#0d9488] uppercase tracking-widest mb-2">About the Platform</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">About CardioAssist</h1>
        <p className="text-lg text-muted-foreground mt-4 leading-relaxed max-w-2xl">
          CardioAssist is a clinical-grade demonstration of machine learning applied to cardiovascular risk prediction.
          The platform leverages historical health data to estimate the likelihood of heart disease presence,
          using an interpretable statistical model designed for clinical transparency.
        </p>
      </div>

      {/* Methodology */}
      <Card className="rounded-2xl shadow-sm border-border/60 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#0f172a] to-[#0d2744] text-white px-7 py-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center">
              <FlaskConical className="h-5 w-5 text-[#2dd4bf]" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">Methodology</CardTitle>
              <CardDescription className="text-slate-300/80">How the model generates predictions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-7 space-y-4 text-muted-foreground leading-relaxed">
          <p>
            The predictive engine powering CardioAssist is a <strong className="text-foreground">Logistic Regression</strong> model.
            We chose Logistic Regression for its exceptional interpretability in clinical settings.
            Unlike "black box" deep learning models, Logistic Regression allows medical professionals to understand
            exactly which features — such as Chest Pain Type or Thalassemia — contribute most significantly to the risk prediction.
          </p>
          <p>
            The model applies <strong className="text-foreground">StandardScaler</strong> normalization to continuous variables
            such as age and cholesterol, ensuring consistent feature scaling regardless of unit differences.
            Balanced class weights prevent bias toward the majority class in the training data.
          </p>
          <p>
            The final output is a binary classification (<em>High Risk</em> / <em>Low Risk</em>) paired with
            a raw probability score from 0–100%, enabling nuanced clinical interpretation beyond a simple label.
          </p>
        </CardContent>
      </Card>

      {/* Dataset */}
      <Card className="rounded-2xl shadow-sm border-border/60 overflow-hidden">
        <CardHeader className="px-7 pt-7 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#0d9488]/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-[#0d9488]" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Dataset Information</CardTitle>
              <CardDescription>The foundation of the ML model</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-7 pb-7 space-y-6">
          <p className="text-muted-foreground leading-relaxed">
            The model is trained on the widely recognized <strong className="text-foreground">Cleveland Heart Disease dataset</strong>.
            This dataset has been extensively peer-reviewed and serves as a benchmark in medical machine learning research.
            It contains 303 patient records with 14 clinical attributes including demographic information, blood test results, and cardiac measurements.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "303", label: "Patient Records" },
              { value: "13", label: "Input Features" },
              { value: "80/20", label: "Train / Test Split" },
              { value: "Binary", label: "Classification" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-muted/50 border border-border/60 p-4 text-center">
                <div className="text-2xl font-extrabold text-[#0d9488]">{stat.value}</div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features table */}
      <Card className="rounded-2xl shadow-sm border-border/60">
        <CardHeader className="px-7 pt-7 pb-4">
          <CardTitle className="text-lg font-bold">Input Features Explained</CardTitle>
          <CardDescription>The 13 clinical parameters used for prediction</CardDescription>
        </CardHeader>
        <CardContent className="px-7 pb-7">
          <div className="divide-y divide-border/60 text-sm">
            {[
              ["Age", "Patient age in years"],
              ["Sex", "Male (1) or Female (0)"],
              ["Chest Pain Type", "Type of chest pain: Typical Angina, Atypical Angina, Non-anginal, or Asymptomatic"],
              ["Resting BP", "Resting blood pressure (mm Hg) at hospital admission"],
              ["Serum Cholesterol", "Serum cholesterol in mg/dl"],
              ["Fasting Blood Sugar", "Fasting blood sugar > 120 mg/dl: Yes (1) or No (0)"],
              ["Resting ECG", "Electrocardiographic results at rest"],
              ["Max Heart Rate", "Maximum heart rate achieved during exercise"],
              ["Exercise Angina", "Exercise-induced angina: Yes (1) or No (0)"],
              ["ST Depression", "ST depression induced by exercise (Oldpeak)"],
              ["ST Slope", "Slope of peak exercise ST segment"],
              ["Major Vessels", "Number of major vessels (0–4) colored by fluoroscopy"],
              ["Thalassemia", "Blood disorder type: Normal, Fixed Defect, or Reversible Defect"],
            ].map(([name, desc]) => (
              <div key={name} className="flex flex-col sm:flex-row sm:gap-6 py-3">
                <span className="font-semibold text-foreground sm:w-44 shrink-0">{name}</span>
                <span className="text-muted-foreground">{desc}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="rounded-2xl border-amber-200 bg-amber-50 shadow-none">
        <CardContent className="p-6 flex gap-4">
          <ShieldAlert className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-800">Medical Disclaimer</p>
            <p className="text-sm text-amber-700 leading-relaxed">
              CardioAssist is intended solely for educational and research purposes. Predictions generated by this tool
              are based on statistical patterns and should never replace professional medical judgment. Always consult a
              qualified healthcare provider for diagnosis and treatment decisions.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div
        className="rounded-3xl p-10 text-center flex flex-col items-center gap-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #0d2744 60%, #0c1a2e 100%)" }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#0d9488]/20 blur-3xl pointer-events-none" />
        <h3 className="relative text-2xl font-extrabold text-white">Ready to run a risk assessment?</h3>
        <p className="relative text-slate-300/80 max-w-md text-sm">
          Input 13 clinical parameters and receive an instant, model-backed classification with probability score.
        </p>
        <Link href="/dashboard">
          <button
            className="relative inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white text-base transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 shadow-lg"
            style={{ background: "linear-gradient(135deg, #0d9488, #0891b2)" }}
          >
            Open Dashboard
            <ArrowRight className="h-4 w-4" />
          </button>
        </Link>
      </div>
    </div>
  );
}
