"use client";

import React, { useState, useMemo, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { GenerateWitnessStatementsOutput } from "@/ai/flows/generate-witness-statements";
import { generateStatementsAction } from "./actions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { BrainCircuit, CheckCircle2, Circle, Eye, HelpCircle, Loader2, RefreshCw, Target, ThumbsDown, ThumbsUp, XCircle } from "lucide-react";

type WitnessStatement = GenerateWitnessStatementsOutput["statements"][0];
type UserAssessments = Record<number, boolean>;

const generationSchema = z.object({
  topic: z.string().min(10, { message: "Please enter a more descriptive topic." }).max(150),
  numStatements: z.number().min(4).max(12).default(6),
});

const TruthSeekerLogo = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
    <path d="M10.5 19.5C15.4706 19.5 19.5 15.4706 19.5 10.5C19.5 5.52944 15.4706 1.5 10.5 1.5C5.52944 1.5 1.5 5.52944 1.5 10.5C1.5 15.4706 5.52944 19.5 10.5 19.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.2938 9.5C13.2938 11.0426 12.0464 12.2901 10.5038 12.2901C8.9612 12.2901 7.71375 11.0426 7.71375 9.5C7.71375 7.95736 8.9612 6.7099 10.5038 6.7099" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.5 12.29V14.54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17.5 17.5L22.5 22.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


const GenerationControls = ({ onGenerate, isLoading }: { onGenerate: (values: z.infer<typeof generationSchema>) => void, isLoading: boolean }) => {
  const form = useForm<z.infer<typeof generationSchema>>({
    resolver: zodResolver(generationSchema),
    defaultValues: {
      topic: "The first manned mission to Mars",
      numStatements: 6,
    },
  });

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Investigation Parameters</CardTitle>
        <CardDescription>Define the scenario you want to investigate.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onGenerate)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic of Investigation</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., The disappearance of Amelia Earhart" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numStatements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Witness Statements: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={4}
                      max={12}
                      step={2}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
              Generate Evidence
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

const WitnessCard = ({ statement, userAssessment, isRevealed, onAssess }: { statement: WitnessStatement, userAssessment?: boolean, isRevealed: boolean, onAssess: (assessment: boolean) => void }) => {
  const isCorrect = userAssessment === statement.isTrue;
  
  const getBorderColor = () => {
    if (!isRevealed || userAssessment === undefined) return 'border-transparent';
    if (isCorrect) return 'border-green-500';
    return 'border-red-500';
  };

  const getIcon = () => {
    if (!isRevealed || userAssessment === undefined) return null;
    if (isCorrect) return <CheckCircle2 className="h-6 w-6 text-green-500" />;
    return <XCircle className="h-6 w-6 text-red-500" />;
  };

  return (
    <Card className={cn("transition-all duration-300", getBorderColor())} style={{ borderWidth: '2px' }}>
      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex-grow mb-4 text-card-foreground/90">
          <p>"{statement.text}"</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={userAssessment === true ? "default" : "outline"}
              onClick={() => onAssess(true)}
              disabled={isRevealed}
              aria-pressed={userAssessment === true}
            >
              <ThumbsUp className="h-4 w-4 mr-2"/> True
            </Button>
            <Button
              size="sm"
              variant={userAssessment === false ? "destructive" : "outline"}
              onClick={() => onAssess(false)}
              disabled={isRevealed}
              aria-pressed={userAssessment === false}
            >
              <ThumbsDown className="h-4 w-4 mr-2"/> False
            </Button>
          </div>
          <div className="w-6 h-6">{getIcon()}</div>
        </div>
      </CardContent>
    </Card>
  );
};

const StatsPanel = ({ statements, assessments, isRevealed, onReveal, onReset }: { statements: WitnessStatement[], assessments: UserAssessments, isRevealed: boolean, onReveal: () => void, onReset: () => void }) => {
  const { progress, confidence } = useMemo(() => {
    const total = statements.length;
    if (total === 0) return { progress: 0, confidence: 0 };
    const assessedCount = Object.keys(assessments).length;
    const correctCount = Object.entries(assessments).filter(([index, value]) => statements[Number(index)].isTrue === value).length;
    
    return {
      progress: (assessedCount / total) * 100,
      confidence: assessedCount > 0 ? (correctCount / assessedCount) * 100 : 0
    };
  }, [statements, assessments]);

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Case Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center text-sm font-medium">
              <HelpCircle className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>Progress</span>
            </div>
            <span className="font-mono text-sm">{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center text-sm font-medium">
              <Target className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>Confidence</span>
            </div>
            <span className="font-mono text-sm">{isRevealed ? confidence.toFixed(0) : '??'}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div className="bg-accent h-2.5 rounded-full transition-all" style={{ width: `${isRevealed ? confidence : 0}%` }}></div>
          </div>
        </div>
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-headline">Final Estimation</h3>
          <Textarea placeholder="Based on the evidence, what is your version of the truth?" disabled={isRevealed} />
          <div>
            <FormLabel>Confidence in Estimation</FormLabel>
            <Slider defaultValue={[50]} max={100} step={1} disabled={isRevealed} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button onClick={onReveal} disabled={isRevealed} className="w-full">
          <Eye className="h-4 w-4 mr-2" />
          Reveal Truth
        </Button>
        <Button onClick={onReset} variant="outline" className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          New Case
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [statements, setStatements] = useState<WitnessStatement[] | null>(null);
  const [userAssessments, setUserAssessments] = useState<UserAssessments>({});
  const [isRevealed, setIsRevealed] = useState(false);
  const { toast } = useToast();
  
  const handleGenerate = async (values: z.infer<typeof generationSchema>) => {
    setIsLoading(true);
    setUserAssessments({});
    setIsRevealed(false);
    setStatements(null);
    startTransition(async () => {
      const result = await generateStatementsAction(values);
      if (result.success && result.data) {
        setStatements(result.data.statements);
        toast({ title: "Evidence generated", description: "Review the witness statements to find the truth." });
      } else {
        toast({
          variant: "destructive",
          title: "Generation Failed",
          description: result.error || "An unknown error occurred.",
        });
      }
      setIsLoading(false);
    });
  };
  
  const handleAssess = (index: number, assessment: boolean) => {
    setUserAssessments(prev => ({ ...prev, [index]: assessment }));
  };

  const handleReveal = () => setIsRevealed(true);
  
  const handleReset = () => {
    setStatements(null);
    setUserAssessments({});
    setIsRevealed(false);
  };
  
  return (
    <main className="min-h-full bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-4">
            <TruthSeekerLogo />
            <h1 className="font-headline text-5xl font-bold tracking-tighter">TruthSeeker AI</h1>
          </div>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            You receive intelligence from multiple AI "witnesses". Some facts are true, others are fabricated to deceive. Your goal: reconstruct the truth. But there is no absolute answer.
          </p>
        </header>

        {!statements && !isLoading && (
          <div className="animate-in fade-in-50 duration-500">
            <GenerationControls onGenerate={handleGenerate} isLoading={isLoading} />
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground animate-in fade-in-50 duration-500">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="font-headline text-2xl">Generating quantum realities...</p>
            <p>Please wait while the AI constructs the narrative.</p>
          </div>
        )}
        
        {statements && (
          <div className="grid lg:grid-cols-3 gap-8 items-start animate-in fade-in-50 duration-500">
            <div className="lg:col-span-1">
              <StatsPanel 
                statements={statements} 
                assessments={userAssessments}
                isRevealed={isRevealed}
                onReveal={handleReveal}
                onReset={handleReset}
              />
            </div>
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
              {statements.map((stmt, index) => (
                <WitnessCard
                  key={index}
                  statement={stmt}
                  userAssessment={userAssessments[index]}
                  isRevealed={isRevealed}
                  onAssess={(assessment) => handleAssess(index, assessment)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
