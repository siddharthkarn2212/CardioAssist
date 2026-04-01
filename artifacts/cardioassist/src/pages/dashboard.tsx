import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { usePredictHeartDisease } from "@workspace/api-client-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, Loader2, Info, Activity } from "lucide-react";
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

export function DashboardPage() {
  const predictMutation = usePredictHeartDisease();
  const [result, setResult] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 50,
      sex: 1,
      cp: 0,
      trtbps: 120,
      chol: 200,
      fbs: 0,
      restecg: 0,
      thalachh: 150,
      exng: 0,
      oldpeak: 1.0,
      slp: 1,
      caa: 0,
      thall: 2,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    predictMutation.mutate(
      { data: values },
      {
        onSuccess: (data) => {
          setResult(data);
        },
      }
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Form Section */}
      <div className="flex-1">
        <Card className="border-t-4 border-t-primary shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">Clinical Parameters</CardTitle>
            <CardDescription>Enter patient data to compute risk prediction.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="age" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age (years)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="sex" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sex</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sex" />
                          </SelectTrigger>
                        </FormControl>
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
                      <FormLabel>Chest Pain Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
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
                      <FormLabel>Resting Blood Pressure (mm Hg)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="chol" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serum Cholesterol (mg/dl)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="fbs" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fasting Blood Sugar {">"} 120 mg/dl</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
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
                      <FormLabel>Resting ECG</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select result" />
                          </SelectTrigger>
                        </FormControl>
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
                      <FormLabel>Max Heart Rate Achieved</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="exng" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exercise Induced Angina</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
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
                      <FormLabel>ST Depression (Oldpeak)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="slp" render={({ field }) => (
                    <FormItem>
                      <FormLabel>ST Slope</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select slope" />
                          </SelectTrigger>
                        </FormControl>
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
                      <FormLabel>Number of Major Vessels</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select number" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">0</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="thall" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thalassemia</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select result" />
                          </SelectTrigger>
                        </FormControl>
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
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      Failed to compute prediction. Please check your inputs and try again.
                    </AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-primary-foreground font-semibold text-lg py-6" disabled={predictMutation.isPending}>
                  {predictMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Computing Risk Profile...
                    </>
                  ) : (
                    "Compute Risk Assessment"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Result Section */}
      <div className="w-full lg:w-96 flex flex-col gap-6">
        {result ? (
          <Card className={`border-t-8 shadow-lg ${result.prediction === 'High Risk' ? 'border-t-red-500' : 'border-t-green-500'}`}>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Diagnostic Result</CardTitle>
              <CardDescription>AI Model Output</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                {result.prediction === 'High Risk' ? (
                  <AlertCircle className="h-10 w-10 text-red-500" />
                ) : (
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                )}
                <div>
                  <div className="text-3xl font-extrabold text-foreground">
                    {result.prediction}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Risk classification
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-semibold">Probability Score</span>
                  <span className="text-lg font-bold">{result.risk_score.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={result.risk_score} 
                  className={`h-3 ${result.prediction === 'High Risk' ? '[&>div]:bg-red-500' : '[&>div]:bg-green-500'}`} 
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed bg-muted/30">
            <CardContent className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground gap-4">
              <Activity className="h-12 w-12 opacity-20" />
              <p>Submit patient parameters to view<br/>risk prediction results.</p>
            </CardContent>
          </Card>
        )}

        <Alert className="bg-primary/5 border-primary/20 text-primary">
          <Info className="h-4 w-4" />
          <AlertTitle>Prediction Disclaimer</AlertTitle>
          <AlertDescription className="text-xs mt-2 opacity-80 leading-relaxed">
            This tool provides risk predictions based on statistical models and is intended for informational and educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified health provider.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
