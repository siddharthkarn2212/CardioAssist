import { useGetModelMetrics, getGetModelMetricsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2, Target, Zap, ActivitySquare, CheckSquare } from "lucide-react";

export function AnalyticsPage() {
  const { data: metrics, isLoading, isError } = useGetModelMetrics({
    query: { queryKey: getGetModelMetricsQueryKey() }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4 text-primary">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="font-medium">Loading model metrics...</p>
        </div>
      </div>
    );
  }

  if (isError || !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-destructive font-medium bg-destructive/10 p-4 rounded-lg border border-destructive/20">
          Failed to load metrics data. Please try again later.
        </div>
      </div>
    );
  }

  const chartData = metrics.top_features.slice(0, 3).map(f => ({
    name: f.feature,
    impact: Math.abs(f.coefficient),
    originalValue: f.coefficient
  }));

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">Model Analytics</h1>
        <p className="text-muted-foreground mt-2 text-lg">Performance metrics and feature importance of the Logistic Regression model.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-t-4 border-t-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Accuracy</p>
                <h3 className="text-3xl font-bold mt-1">{(metrics.accuracy * 100).toFixed(1)}%</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Target className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-t-secondary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Precision</p>
                <h3 className="text-3xl font-bold mt-1">{(metrics.precision * 100).toFixed(1)}%</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                <CheckSquare className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-t-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recall</p>
                <h3 className="text-3xl font-bold mt-1">{(metrics.recall * 100).toFixed(1)}%</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Zap className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-t-4 border-t-secondary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">F1 Score</p>
                <h3 className="text-3xl font-bold mt-1">{(metrics.f1_score * 100).toFixed(1)}%</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                <ActivitySquare className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Top Predictive Features</CardTitle>
            <CardDescription>Absolute coefficient weights in the logistic regression model.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="impact" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Model Specifications</CardTitle>
            <CardDescription>Technical details of the underlying ML architecture.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-sm text-foreground mb-1">Algorithm</h4>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">Logistic Regression with standard scaling and balanced class weights.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground mb-1">Training Data</h4>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{metrics.train_size} samples used for model training.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground mb-1">Testing Data</h4>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{metrics.test_size} samples used for validation and metrics.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
