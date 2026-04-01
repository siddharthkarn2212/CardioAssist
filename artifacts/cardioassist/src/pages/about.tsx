import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary">About CardioAssist AI</h1>
        <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
          CardioAssist AI is a clinical-grade demonstration of machine learning applied to cardiovascular health prediction. 
          Our platform leverages historical health data to estimate the likelihood of heart disease presence.
        </p>
      </div>

      <div className="grid gap-8 mt-8">
        <Card className="shadow-sm border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="text-2xl">The Methodology</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none text-muted-foreground">
            <p>
              The predictive engine powering CardioAssist AI is a Logistic Regression model. We chose Logistic Regression for its exceptional interpretability in clinical settings. Unlike "black box" deep learning models, Logistic Regression allows medical professionals to understand exactly which features (such as Chest Pain Type or Thalassemia) contribute most significantly to the risk prediction.
            </p>
            <p>
              The model applies standardization to continuous variables (like age and cholesterol) and utilizes balanced class weights to ensure accurate predictions across different demographic profiles.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-t-secondary">
          <CardHeader>
            <CardTitle className="text-2xl">Dataset Information</CardTitle>
            <CardDescription>The foundation of our ML model</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              The model is trained on the widely recognized <strong>Cleveland Heart Disease dataset</strong>. This dataset has been extensively peer-reviewed and serves as a benchmark in medical machine learning research.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="bg-muted rounded-lg p-4 text-center border">
                <div className="text-3xl font-bold text-primary">303</div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">Patient Records</div>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center border">
                <div className="text-3xl font-bold text-primary">14</div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">Clinical Attributes</div>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center border">
                <div className="text-3xl font-bold text-primary">80/20</div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">Train/Test Split</div>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center border">
                <div className="text-3xl font-bold text-primary">Binary</div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">Classification Target</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-8 text-center flex flex-col items-center gap-4">
          <h3 className="text-xl font-bold text-primary">Ready to evaluate a patient profile?</h3>
          <p className="text-muted-foreground max-w-lg mb-2">
            Access the clinical dashboard to input parameters and receive an immediate risk assessment.
          </p>
          <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-primary-foreground font-semibold">
            <Link href="/dashboard">Open Diagnostics Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
