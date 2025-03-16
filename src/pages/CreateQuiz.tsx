
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { createQuiz } from '@/services/api';
import { QuizCreate, Question } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, TrashIcon, ArrowLeft, Send } from 'lucide-react';
import { toast } from 'sonner';

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
    onSuccess: () => {
      toast.success('Quiz created successfully');
      navigate('/');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create quiz: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!title.trim()) {
      toast.error('Please enter a quiz title');
      return;
    }

    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        toast.error(`Question ${i + 1} text is required`);
        return;
      }

      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          toast.error(`Option ${j + 1} for Question ${i + 1} is required`);
          return;
        }
      }
    }

    const quizData: QuizCreate = {
      title,
      description: description.trim() ? description : undefined,
      questions,
    };

    createQuizMutation.mutate(quizData);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        options: ['', '', '', ''],
        correct_answer_index: 0,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    } else {
      toast.error('You need at least one question');
    }
  };

  const updateQuestion = (index: number, field: keyof Question, value: string | number) => {
    const updatedQuestions = [...questions];
    
    if (field === 'text') {
      updatedQuestions[index].text = value as string;
    } else if (field === 'correct_answer_index') {
      updatedQuestions[index].correct_answer_index = value as number;
    }
    
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create New Quiz</h1>
      </div>

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
                placeholder="Enter quiz title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter quiz description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Questions</h2>
            <Button
              type="button"
              onClick={addQuestion}
              variant="outline"
              className="gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add Question
            </Button>
          </div>

          {questions.map((question, qIndex) => (
            <Card key={qIndex} className="relative">
              <Button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8 text-destructive hover:text-destructive"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>

              <CardHeader>
                <CardTitle className="text-lg">Question {qIndex + 1}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`question-${qIndex}`}>Question Text</Label>
                  <Input
                    id={`question-${qIndex}`}
                    placeholder="Enter question text"
                    value={question.text}
                    onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label>Options</Label>
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex gap-2 items-center">
                      <Input
                        placeholder={`Option ${oIndex + 1}`}
                        value={option}
                        onChange={(e) =>
                          updateOption(qIndex, oIndex, e.target.value)
                        }
                        required
                      />
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id={`correct-${qIndex}-${oIndex}`}
                          name={`correct-${qIndex}`}
                          checked={question.correct_answer_index === oIndex}
                          onChange={() =>
                            updateQuestion(qIndex, 'correct_answer_index', oIndex)
                          }
                          className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <Label
                          htmlFor={`correct-${qIndex}-${oIndex}`}
                          className="ml-2 text-sm"
                        >
                          Correct
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={createQuizMutation.isPending}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            {createQuizMutation.isPending
              ? 'Creating Quiz...'
              : 'Create Quiz'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;
