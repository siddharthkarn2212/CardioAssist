import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePredictHeartDisease, useGetModelMetrics, getGetModelMetricsQueryKey } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Loader2, Info, Activity, TrendingUp, TrendingDown } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  age: z.coerce.number().min(1).max(120),
  sex: z.coerce.number().min(0).max(1),
  cp: z.coerce.number().min(0).max(3),
  trtbps: z.coerce.number().min(50).max(300),
  chol: z.coerce.number().min(100).max(600),
  fbs: z.coerce.number().min(0).max(1),
  restecg: z.coerce.number().min(0).max(2),
  thalachh: z.coerce.number().min(50).max(250),
  exng: z.coerce.number().min(0).max(1),
  oldpeak: z.coerce.number().min(0.0).max(10.0),
  slp: z.coerce.number().min(0).max(2),
  caa: z.coerce.number().min(0).max(4),
  thall: z.coerce.number().min(0).max(3),
});

function RiskGauge({ value, isHighRisk }: { value: number; isHighRisk: boolean }) {
  const size = 200;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - value) / 100) * circumference;
  const color = isHighRisk ? "#ef4444" : "#10b981";
  const trackColor = isHighRisk ? "rgba(239,68,68,0.12)" : "rgba(16,185,129,0.12)";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={progress}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-extrabold" style={{ color }}>{value.toFixed(1)}%</span>
        <span className="text-xs font-medium text-muted-foreground mt-1">Risk Score</span>
      </div>
    </div>
  );
}

const FEATURE_LABELS: Record<string, string> = {
  cp: "Chest Pain Type", caa: "Major Vessels", sex: "Sex",
  thall: "Thalassemia", thalachh: "Max Heart Rate", oldpeak: "ST Depression",
  exng: "Exercise Angina", slp: "ST Slope", trtbps: "Blood Pressure",
  chol: "Cholesterol", age: "Age", fbs: "Fasting Blood Sugar", restecg: "Resting ECG",
};

function FeatureBar({ name, value, max }: { name: string; value: number; max: number }) {
  const pct = (value / max) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium text-muted-foreground w-32 shrink-0 text-right">{FEATURE_LABELS[name] ?? name}</span>
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full bg-[#0d9488] transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-foreground w-10 text-right">{value.toFixed(2)}</span>
    </div>
  );
}

export function DashboardPage() {
  const predictMutation = usePredictHeartDisease();
  const [result, setResult] = useState<any>(null);

  const { data: metrics } = useGetModelMetrics({
    query: { queryKey: getGetModelMetricsQueryKey() as any }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 50, sex: 1, cp: 0, trtbps: 120, chol: 200,
      fbs: 0, restecg: 0, thalachh: 150, exng: 0,
      oldpeak: 1.0, slp: 1, caa: 0, thall: 2,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    predictMutation.mutate({ data: values }, { onSuccess: (data) => setResult(data) });
  }

  const isHighRisk = result?.prediction === "High Risk";
  const topFeatures = metrics?.top_features?.slice(0, 3) ?? [];
  const maxCoef = Math.max(...topFeatures.map((f: any) => Math.abs(f.coefficient)), 0.01);

  function buildExplanation() {
    if (!topFeatures.length) return null;
    const names = topFeatures.map((f: any) => FEATURE_LABELS[f.feature] ?? f.feature);
    return `Your risk profile is primarily influenced by: ${names.join(", ")}.`;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Risk Assessment Dashboard</h1>
        <p className="text-muted-foreground mt-1.5">Enter patient parameters to compute a heart disease risk prediction.</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Form */}
        <div className="flex-1 min-w-0">
          <Card className="shadow-md border-border/60 rounded-2xl overflow-hidden">
            <CardHeader className="text-white px-7 py-6" style={{ background: "linear-gradient(to right, #0f172a, #0d2744)" }}>
              <CardTitle className="text-xl font-bold text-white">Clinical Parameters</CardTitle>
              <CardDescription className="text-slate-300/80">Complete all 13 fields for accurate prediction</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">

                    <FormField control={form.control} name="age" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Age (years)</FormLabel>
                        <FormControl><Input type="number" className="rounded-lg" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="sex" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sex</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                          <FormControl><SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="0">Female</SelectItem>
                            <SelectItem value="1">Male</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="cp" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Chest Pain Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                          <FormControl><SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="0">Typical Angina</SelectItem>
                            <SelectItem value="1">Atypical Angina</SelectItem>
                            <SelectItem value="2">Non-anginal Pain</SelectItem>
                            <SelectItem value="3">Asymptomatic</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="trtbps" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resting BP (mm Hg)</FormLabel>
                        <FormControl><Input type="number" className="rounded-lg" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="chol" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Serum Cholesterol (mg/dl)</FormLabel>
                        <FormControl><Input type="number" className="rounded-lg" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="fbs" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fasting Blood Sugar &gt; 120 mg/dl</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                          <FormControl><SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="0">No</SelectItem>
                            <SelectItem value="1">Yes</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="restecg" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resting ECG</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                          <FormControl><SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="0">Normal</SelectItem>
                            <SelectItem value="1">ST-T Wave Abnormality</SelectItem>
                            <SelectItem value="2">Left Ventricular Hypertrophy</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="thalachh" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Max Heart Rate</FormLabel>
                        <FormControl><Input type="number" className="rounded-lg" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="exng" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Exercise Induced Angina</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                          <FormControl><SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="0">No</SelectItem>
                            <SelectItem value="1">Yes</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="oldpeak" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">ST Depression (Oldpeak)</FormLabel>
                        <FormControl><Input type="number" step="0.1" className="rounded-lg" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="slp" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">ST Slope</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                          <FormControl><SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="0">Unsloping</SelectItem>
                            <SelectItem value="1">Flat</SelectItem>
                            <SelectItem value="2">Downsloping</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="caa" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Major Vessels (0–4)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                          <FormControl><SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            {[0, 1, 2, 3, 4].map((v) => <SelectItem key={v} value={String(v)}>{v}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="thall" render={({ field }) => (
                      <FormItem className="col-span-1 sm:col-span-2">
                        <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Thalassemia</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                          <FormControl><SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="0">Normal</SelectItem>
                            <SelectItem value="1">Fixed Defect</SelectItem>
                            <SelectItem value="2">Reversible Defect</SelectItem>
                            <SelectItem value="3">No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  {predictMutation.isError && (
                    <Alert variant="destructive" className="rounded-xl">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Prediction Error</AlertTitle>
                      <AlertDescription>Failed to compute prediction. Check your inputs and try again.</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 rounded-xl font-semibold text-base text-white shadow-md transition-all duration-200 hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #0d9488, #0891b2)" }}
                    disabled={predictMutation.isPending}
                  >
                    {predictMutation.isPending ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Computing Risk Profile...</>
                    ) : "Compute Risk Assessment"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="w-full xl:w-[400px] flex flex-col gap-5 shrink-0">
          {result ? (
            <>
              <Card className="rounded-2xl shadow-xl border-0 overflow-hidden">
                <div className={`px-7 pt-7 pb-5 ${isHighRisk ? "gradient-danger" : "gradient-safe"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {isHighRisk ? <TrendingUp className="h-5 w-5 text-white/80" /> : <TrendingDown className="h-5 w-5 text-white/80" />}
                    <span className="text-sm font-medium text-white/80 uppercase tracking-widest">Prediction Result</span>
                  </div>
                  <div className="text-4xl font-extrabold text-white mt-1">{result.prediction}</div>
                </div>
                <CardContent className="p-7 flex flex-col items-center gap-6">
                  <RiskGauge value={result.risk_score} isHighRisk={isHighRisk} />
                  <div className="w-full space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-foreground">Disease Probability</span>
                      <span className={`font-bold text-lg ${isHighRisk ? "text-red-500" : "text-emerald-600"}`}>
                        {(result.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${isHighRisk ? "bg-red-500" : "bg-emerald-500"}`}
                        style={{ width: `${result.probability * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                      <span>Low Risk</span><span>High Risk</span>
                    </div>
                  </div>
                  <div className={`w-full rounded-xl px-4 py-3 flex items-center gap-3 ${isHighRisk ? "bg-red-50 border border-red-200" : "bg-emerald-50 border border-emerald-200"}`}>
                    {isHighRisk
                      ? <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                      : <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    }
                    <span className={`text-sm font-medium ${isHighRisk ? "text-red-700" : "text-emerald-700"}`}>
                      {isHighRisk
                        ? "Elevated cardiovascular risk detected. Clinical follow-up recommended."
                        : "No significant cardiovascular risk detected at this time."
                      }
                    </span>
                  </div>
                </CardContent>
              </Card>

              {topFeatures.length > 0 && (
                <Card className="rounded-2xl shadow-sm border-border/60">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold">Key Risk Factors</CardTitle>
                    <CardDescription className="text-sm">{buildExplanation()}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3">
                    {topFeatures.map((f: any) => (
                      <FeatureBar key={f.feature} name={f.feature} value={Math.abs(f.coefficient)} max={maxCoef} />
                    ))}
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      Bar lengths represent absolute coefficient weights from the Logistic Regression model.
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="rounded-2xl border-dashed border-2 shadow-none bg-muted/30">
              <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                  <Activity className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <div>
                  <p className="font-semibold text-foreground/60">No Result Yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Fill in the form and click<br />"Compute Risk Assessment"</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Alert className="rounded-2xl bg-slate-50 border-slate-200">
            <Info className="h-4 w-4 text-slate-500" />
            <AlertTitle className="text-slate-700 text-sm font-semibold">Medical Disclaimer</AlertTitle>
            <AlertDescription className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              This tool provides statistical predictions for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
