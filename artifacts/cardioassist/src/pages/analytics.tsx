import { useGetModelMetrics, getGetModelMetricsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, PolarAngleAxis, Cell,
} from "recharts";
import { Loader2, Target, Zap, ScanLine, Award } from "lucide-react";

// Circular metric gauge using RadialBarChart
function MetricGauge({ value, label, color, icon: Icon }: { value: number; label: string; color: string; icon: any }) {
  const pct = Math.round(value * 100 * 10) / 10;
  const data = [{ value: pct, fill: color }];

  return (
    <Card className="rounded-2xl shadow-sm border-border/60 card-hover overflow-hidden">
      <CardContent className="p-6 flex flex-col items-center gap-2">
        <div className="relative" style={{ width: 140, height: 120 }}>
          <RadialBarChart
            width={140}
            height={120}
            cx={70}
            cy={80}
            innerRadius={50}
            outerRadius={68}
            startAngle={180}
            endAngle={0}
            data={data}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              background={{ fill: `${color}18` }}
              dataKey="value"
              cornerRadius={6}
              angleAxisId={0}
            >
              {data.map((_, i) => <Cell key={i} fill={color} />)}
            </RadialBar>
          </RadialBarChart>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
            <span className="text-2xl font-extrabold" style={{ color }}>{pct}%</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
            <Icon className="h-4 w-4" style={{ color }} strokeWidth={1.8} />
          </div>
          <span className="text-sm font-semibold text-foreground">{label}</span>
        </div>
      </CardContent>
    </Card>
  );
}

const FEATURE_LABELS: Record<string, string> = {
  cp: "Chest Pain Type",
  caa: "Major Vessels",
  sex: "Sex",
  thall: "Thalassemia",
  thalachh: "Max Heart Rate",
  oldpeak: "ST Depression",
  exng: "Exercise Angina",
  slp: "ST Slope",
  trtbps: "Blood Pressure",
  chol: "Cholesterol",
  age: "Age",
  fbs: "Fasting Blood Sugar",
  restecg: "Resting ECG",
};

const FEATURE_COLORS = ["#0d9488", "#0891b2", "#7c3aed"];

// Custom bar tooltip
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload?.length) {
    return (
      <div className="glass-card rounded-xl px-4 py-3 text-sm">
        <p className="font-semibold text-foreground mb-1">{FEATURE_LABELS[label] ?? label}</p>
        <p className="text-muted-foreground">Coefficient weight: <span className="font-bold text-[#0d9488]">{payload[0].value.toFixed(3)}</span></p>
      </div>
    );
  }
  return null;
}

// Risk distribution data (derived from model test accuracy)
function buildRiskDistribution(accuracy: number, testSize: number) {
  const correct = Math.round(accuracy * testSize);
  const incorrect = testSize - correct;
  return [
    { name: "Correct", value: correct, fill: "#0d9488" },
    { name: "Incorrect", value: incorrect, fill: "#f87171" },
  ];
}

export function AnalyticsPage() {
  const { data: metrics, isLoading, isError } = useGetModelMetrics({
    query: { queryKey: getGetModelMetricsQueryKey() }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-[#0d9488]">
          <Loader2 className="h-10 w-10 animate-spin" />
          <p className="font-semibold text-lg text-foreground">Loading model analytics...</p>
          <p className="text-sm text-muted-foreground">Fetching performance data from the ML backend</p>
        </div>
      </div>
    );
  }

  if (isError || !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center bg-destructive/5 rounded-2xl border border-destructive/20 p-10 max-w-sm">
          <p className="font-semibold text-destructive text-lg mb-2">Failed to load analytics</p>
          <p className="text-sm text-muted-foreground">The ML backend may be starting up. Please refresh in a moment.</p>
        </div>
      </div>
    );
  }

  const featureData = metrics.top_features.slice(0, 3).map((f: any) => ({
    name: f.feature,
    impact: Math.abs(f.coefficient),
    coefficient: f.coefficient,
  }));

  const distributionData = buildRiskDistribution(metrics.accuracy, metrics.test_size);

  const metricCards = [
    { label: "Accuracy", value: metrics.accuracy, color: "#0d9488", icon: Target },
    { label: "Precision", value: metrics.precision, color: "#0891b2", icon: Award },
    { label: "Recall", value: metrics.recall, color: "#7c3aed", icon: Zap },
    { label: "F1 Score", value: metrics.f1_score, color: "#ea580c", icon: ScanLine },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-7xl space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#0d9488] uppercase tracking-widest mb-2">Model Performance</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1.5 text-base">
            Evaluation metrics and feature importance for the trained Logistic Regression model.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-xl px-4 py-2.5 border shrink-0">
          <span className="h-2 w-2 rounded-full bg-[#0d9488]" />
          Trained on {metrics.train_size} samples &bull; Tested on {metrics.test_size}
        </div>
      </div>

      {/* 4 Metric Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        {metricCards.map((m) => (
          <MetricGauge key={m.label} value={m.value} label={m.label} color={m.color} icon={m.icon} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Feature importance bar chart */}
        <Card className="lg:col-span-3 rounded-2xl shadow-sm border-border/60">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Feature Importance</CardTitle>
            <CardDescription>
              Top 3 predictive features by absolute Logistic Regression coefficient.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="name"
                    tickFormatter={(v) => FEATURE_LABELS[v] ?? v}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", radius: 6 }} />
                  <Bar dataKey="impact" radius={[6, 6, 0, 0]} maxBarSize={60}>
                    {featureData.map((_: any, i: number) => (
                      <Cell key={i} fill={FEATURE_COLORS[i % FEATURE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-3 mt-4">
              {featureData.map((f: any, i: number) => (
                <div key={f.name} className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: FEATURE_COLORS[i] }} />
                  <span className="text-sm font-medium text-foreground">{FEATURE_LABELS[f.name] ?? f.name}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(f.impact / Math.max(...featureData.map((x: any) => x.impact))) * 100}%`,
                        backgroundColor: FEATURE_COLORS[i],
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold text-muted-foreground w-12 text-right">{f.impact.toFixed(3)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Risk distribution */}
          <Card className="rounded-2xl shadow-sm border-border/60 flex-1">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Prediction Distribution</CardTitle>
              <CardDescription>Correct vs. incorrect predictions on the {metrics.test_size}-sample test set.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[160px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: "10px", border: "1px solid hsl(var(--border))", fontSize: 12 }}
                      cursor={{ fill: "hsl(var(--muted))" }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={50}>
                      {distributionData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 mt-3">
                {distributionData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: d.fill }} />
                    <span className="text-muted-foreground">{d.name}:</span>
                    <span className="font-bold text-foreground">{d.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Model specs */}
          <Card className="rounded-2xl shadow-sm border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Model Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Algorithm", value: "Logistic Regression (max_iter=1000)" },
                { label: "Preprocessing", value: "StandardScaler (zero mean, unit variance)" },
                { label: "Dataset", value: "Cleveland Heart Disease (303 samples)" },
                { label: "Split", value: `80% train / 20% test (random_state=42)` },
              ].map((row) => (
                <div key={row.label} className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{row.label}</span>
                  <span className="text-sm text-foreground bg-muted/50 rounded-lg px-3 py-2">{row.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
