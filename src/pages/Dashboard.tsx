
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchQuizzes } from '@/services/api';
import { QuizStatus } from '@/types/quiz';
import { QuizCard } from '@/components/QuizCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, PlusCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const [activeStatus, setActiveStatus] = useState<QuizStatus | 'all'>('all');
  
  const { data: quizzes, isLoading, error } = useQuery({
    queryKey: ['quizzes', activeStatus],
    queryFn: () => activeStatus === 'all' ? fetchQuizzes() : fetchQuizzes(activeStatus),
  });

  const handleTabChange = (value: string) => {
    setActiveStatus(value as QuizStatus | 'all');
  };

  return (
    <div className="container max-w-6xl py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quiz Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Create, manage and distribute quizzes with Google Forms
          </p>
        </div>
        <Link to="/create">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            New Quiz
          </Button>
        </Link>
      </div>
      
      <Separator />
      
      <Tabs defaultValue="all" onValueChange={handleTabChange}>
        <TabsList className="grid w-full md:w-fit grid-cols-3 md:grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value={QuizStatus.DRAFT}>Draft</TabsTrigger>
          <TabsTrigger value={QuizStatus.APPROVED}>Approved</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          {error ? (
            <Alert variant="destructive" className="my-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load quizzes. Please try again later.
              </AlertDescription>
            </Alert>
          ) : isLoading ? (
            <div className="quiz-card-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border overflow-hidden">
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-20 w-full mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : quizzes && quizzes.length > 0 ? (
            <div className="quiz-card-grid">
              {quizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}
            </div>
          ) : (
            <div className="text-center p-12">
              <h3 className="text-lg font-medium">No quizzes found</h3>
              <p className="text-muted-foreground mt-1">
                Get started by creating your first quiz
              </p>
              <Link to="/create" className="mt-4 inline-block">
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Create Quiz
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default Dashboard;
