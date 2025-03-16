
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { createQuiz } from '@/services/api';
import { Question, QuizCreate } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { PlusCircle, MinusCircle, ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    {
      text: '',
      options: ['', '', '', ''],
      correct_answer_index: 0,
    },
  ]);

  const createQuizMutation = useMutation({
    mutationFn: createQuiz,
    onSuccess: (data) => {
      toast.success('Quiz created successfully!');
      navigate(`/quizzes/${data.id}`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create quiz: ${error.message}`);
    },
  });

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        options: ['', '', '', ''],
        correct_answer_index: 0,
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    } else {
      toast.error('Quiz must have at least one question');
    }
  };

  const handleQuestionChange = (index: number, field: keyof Question, value: string | number) => {
    const updatedQuestions = [...questions];
    
    if (field === 'options') {
      // This case will be handled separately
      return;
    }
    
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].correct_answer_index = optionIndex;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      toast.error('Please enter a quiz title');
      return;
    }
    
    // Check if any questions are empty
    const hasEmptyQuestion = questions.some(q => !q.text.trim());
    if (hasEmptyQuestion) {
      toast.error('Please fill in all question texts');
      return;
    }
    
    // Check if any options are empty
    const hasEmptyOption = questions.some(q => 
      q.options.some(option => !option.trim())
    );
    if (hasEmptyOption) {
      toast.error('Please fill in all answer options');
      return;
    }
    
    const newQuiz: QuizCreate = {
      title,
      description: description.trim() || undefined,
      questions,
    };
    
    createQuizMutation.mutate(newQuiz);
  };

  return (
    <div className="container max-w-3xl py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create New Quiz</h1>
      </div>
      
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          Once created, a Google Form will be automatically generated for this quiz.
        </AlertDescription>
      </Alert>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter quiz title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter quiz description"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Questions</h2>
            <Button 
              type="button" 
              onClick={handleAddQuestion}
              variant="outline"
              className="gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add Question
            </Button>
          </div>
          
          {questions.map((question, questionIndex) => (
            <Card key={questionIndex} className="relative">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Question {questionIndex + 1}</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveQuestion(questionIndex)}
                    className="h-8 w-8"
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor={`question-${questionIndex}`}>Question Text</Label>
                  <Input
                    id={`question-${questionIndex}`}
                    value={question.text}
                    onChange={(e) => handleQuestionChange(questionIndex, 'text', e.target.value)}
                    placeholder="Enter question text"
                    required
                  />
                </div>
                
                <div className="space-y-4">
                  <Label>Answer Options</Label>
                  <p className="text-sm text-muted-foreground -mt-2">
                    Select the radio button next to the correct answer
                  </p>
                  
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`question-${questionIndex}-option-${optionIndex}`}
                        name={`question-${questionIndex}-correct`}
                        checked={question.correct_answer_index === optionIndex}
                        onChange={() => handleCorrectAnswerChange(questionIndex, optionIndex)}
                        className="h-4 w-4 text-primary"
                      />
                      <Input
                        value={option}
                        onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                        placeholder={`Option ${optionIndex + 1}`}
                        required
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            className="gap-2"
            disabled={createQuizMutation.isPending}
          >
            <Save className="h-4 w-4" />
            {createQuizMutation.isPending ? 'Creating Quiz...' : 'Create Quiz'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;
