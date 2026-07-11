
'use client';

import React, { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { ArrowUp, Bot, Languages, LoaderCircle, Mic, Search } from 'lucide-react';

import { askAI } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage, type Message } from '@/components/chat-message';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { courses, faqs } from '@/lib/data';
import { ActionableMessage } from './actionable-message';
import { Logo } from '@/components/logo';
import { useMicrophone } from '@/hooks/use-microphone';
import { LeadCaptureForm } from './lead-capture-form';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { saveLead } from '@/firebase/leads';
import { useFirestore } from '@/firebase';


function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle className="mr-2 animate-spin" />
          {pendingLabel}
        </>
      ) : (
        label
      )}
    </Button>
  );
}

const initialAIState: { answer?: string; error?: string } = {};

function InitialOptions({ 
  onOptionClick, 
  onQuerySubmit,
  transcript,
  isListening,
  startListening,
  stopListening,
  language,
  setLanguage
}: { 
  onOptionClick: (option: string) => void; 
  onQuerySubmit: (query: string) => void; 
  transcript: string;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
}) {
  const options = language === 'en' 
    ? ['Courses', 'Fees', 'FAQ', 'Placement']
    : ['पाठ्यक्रम', 'शुल्क', 'सामान्य प्रश्न', 'प्लेसमेंट'];
    
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
        inputRef.current.value = transcript;
    }
    if (!isListening && transcript) {
        onQuerySubmit(transcript);
        if (formRef.current) formRef.current.reset();
        if (inputRef.current) inputRef.current.value = '';
    }
  }, [transcript, isListening, onQuerySubmit]);


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('query') as string;
    if (query.trim()) {
      onQuerySubmit(query);
      formRef.current?.reset();
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg text-center animate-fade-in-up">
        <Logo className="mb-8 justify-center" />
        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <div className='flex justify-end gap-2 mb-4'>
                <Button variant={language === 'en' ? 'default' : 'outline'} size='sm' onClick={() => setLanguage('en')}>English</Button>
                <Button variant={language === 'hi' ? 'default' : 'outline'} size='sm' onClick={() => setLanguage('hi')}>हिन्दी</Button>
            </div>
            <CardTitle className="text-2xl font-bold">
              {language === 'en' ? 'Welcome to the AI Admission Counselor' : 'एआई एडमिशन काउंसलर में आपका स्वागत है'}
            </CardTitle>
            <CardDescription className="text-lg">
              {language === 'en' ? 'How can I help you today? Select an option below or type your question.' : 'मैं आज आपकी कैसे मदद कर सकता हूँ? नीचे एक विकल्प चुनें या अपना प्रश्न टाइप करें।'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4">
             <form ref={formRef} onSubmit={handleSubmit} className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                ref={inputRef}
                name="query"
                placeholder={isListening ? (language === 'en' ? "Listening..." : "सुन रहा हूँ...") : (language === 'en' ? "Ask a question..." : "एक सवाल पूछें...")}
                className="w-full rounded-full bg-background/80 pl-10 pr-12 py-3 text-lg"
                disabled={isListening}
              />
              <Button
                type="button"
                size="icon"
                variant={isListening ? 'destructive' : 'ghost'}
                onClick={handleVoiceInput}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-8 w-8"
              >
                <Mic className="h-5 w-5" />
                <span className="sr-only">{isListening ? 'Stop listening' : 'Start listening'}</span>
              </Button>
            </form>
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              {options.map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  size="lg"
                  onClick={() => onOptionClick(option)}
                  className="w-full transition-transform hover:scale-105"
                >
                  {option}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [aiState, formAction] = useActionState(askAI, initialAIState);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { transcript, isListening, startListening, stopListening, setTranscript } = useMicrophone();
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);
  const firestore = useFirestore();

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
        inputRef.current.value = transcript;
    }
    // Automatically submit the form when transcript is ready
    if (!isListening && transcript) {
        const query = transcript;
        setTranscript(''); // Reset transcript after using it

        if (showChat) {
            submitQuery(query);
        } else {
            // If on the initial screen, start the chat with the query
            startChat(query);
        }
        if (formRef.current) formRef.current.reset();
        if (inputRef.current) inputRef.current.value = '';
    }
}, [transcript, isListening, showChat, setTranscript]);

const submitQuery = (query: string) => {
    if (!query.trim() || isPending) return;

    setMessages((prev) => [...prev, { role: 'user', content: query }]);

    if (!leadCaptured) {
      setPendingQuery(query);
    } else {
      const formData = new FormData();
      formData.append('query', query);
      formData.append('language', language);
      startTransition(() => {
        formAction(formData);
      });
    }
    formRef.current?.reset();
  };

  const handleLeadCapture = (data: { name: string; phone: string; }) => {
    saveLead(firestore, data);
    setLeadCaptured(true);
    
    // Add confirmation messages
    setMessages(prev => [
      ...prev, 
      { role: 'assistant', content: `Thank you, ${data.name}! Now, let me answer your question.` },
      { role: 'assistant', content: "Your name and contact number will be used only to reach you regarding this service. We respect your privacy." }
    ]);

    if (pendingQuery) {
      const formData = new FormData();
      formData.append('query', pendingQuery);
      formData.append('language', language);
      startTransition(() => {
        formAction(formData);
      });
      setPendingQuery(null);
    }
  };

  const handleOptionClick = (option: string) => {
    const englishOption = ['Courses', 'Fees', 'FAQ', 'Placement'].find(o => o.toLowerCase() === option.toLowerCase());
    const hindiOption = ['पाठ्यक्रम', 'शुल्क', 'सामान्य प्रश्न', 'प्लेसमेंट'].find(o => o === option);
    
    if (option === 'FAQ' || option === 'सामान्य प्रश्न') {
      const faqMessages: Message[] = [
        {
          role: 'assistant',
          content: language === 'en' 
            ? "Hello! I'm your AI admission counselor. Here are some frequently asked questions. Feel free to select one or ask your own question."
            : "नमस्ते! मैं आपका एआई एडमिशन काउंसलर हूं। यहां कुछ अक्सर पूछे जाने वाले प्रश्न दिए गए हैं। बेझिझک एक चुनें या अपना प्रश्न पूछें।",
        },
        {
          role: 'assistant',
          content: language === 'en' ? 'Frequently Asked Questions' : 'अक्सर पूछे जाने वाले प्रश्न',
          component: 'FaqSelector',
          componentProps: {
            courses: faqs.map(faq => faq.question),
            action: (question: string) => submitQuery(question),
          }
        }
      ];
      setMessages(faqMessages);
      setShowChat(true);
      return;
    }
     if (option === 'Placement' || option === 'प्लेसमेंट') {
        const placementMessages: Message[] = [
        {
          role: 'assistant',
          content: language === 'en' 
            ? "I can certainly help with that. Here is a summary of placement records for our popular courses. Select one to learn more."
            : "मैं इसमें निश्चित रूप से मदद कर सकता हूं। हमारे लोकप्रिय पाठ्यक्रमों के प्लेसमेंट रिकॉर्ड کا خلاصہ यहां दिया गया है। अधिक जानने के लिए किसी एक का चयन करें।",
        },
        {
          role: 'assistant',
          content: language === 'en' ? 'Placement Records' : 'प्लेसमेंट रिकॉर्ड',
          component: 'PlacementInfoSelector',
          componentProps: {
            courses: courses,
            action: (course: string) => submitQuery(`Tell me more about placements for ${course}`),
            displayPlacementInfo: true,
          }
        }
      ];
      setMessages(placementMessages);
      setShowChat(true);
      return;
    }

    startChat(option);
  };
  
  const handleQuerySubmit = (query: string) => {
    startChat(query);
  };

  useEffect(() => {
    if (aiState.answer) {
      if (aiState.answer === 'ACTION_SELECT_FEE_TYPE') {
        setMessages((prev) => [
          ...prev,
          { 
            role: 'assistant', 
            content: language === 'en'
              ? 'I can help with that. Are you interested in course fees, hostel fees, or bus fees?'
              : 'मैं इसमें मदद कर सकता हूँ। क्या आप पाठ्यक्रम शुल्क, छात्रावास शुल्क, या बस शुल्क میں دلچسپی رکھتے ہیں?',
            component: 'FeeTypeSelector',
            componentProps: {
              courses: language === 'en' ? ['Course Fees', 'Hostel Fees', 'Bus Fees'] : ['कोर्स शुल्क', 'हॉस्टल शुल्क', 'बस शुल्क'],
              action: (feeType: string) => submitQuery(feeType),
            }
          },
        ]);
      } else if (aiState.answer === 'ACTION_SELECT_COURSE_INFO') {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: language === 'en' ? 'Here are the courses we offer. Select one to learn more.' : 'यहां ہمارے提供的 पाठ्यक्रम हैं। अधिक जानने के लिए किसी एक का चयन करें।',
            component: 'CourseInfoSelector',
            componentProps: {
              courses: courses,
              action: (course: string) => submitQuery(course),
              displayEligibility: true,
            },
          },
        ]);
      } else {
         const newMessages: Message[] = [
          { role: 'assistant', content: aiState.answer as string },
        ];
        
        const isGreeting = aiState.answer.includes("AI admission counselor") || aiState.answer.includes("एआई एडमिशन काउंसलर");

        if (!isGreeting) {
           newMessages.push({
            role: 'assistant',
            content: language === 'en' ? 'Thank you for your query! What would you like to know next?' : 'आपके प्रश्न के लिए धन्यवाद! आप आगे क्या जानना चाहेंगे?',
            component: 'FeeTypeSelector', // Re-using for general options
            componentProps: {
              courses: language === 'en' ? ['Courses', 'Fees', 'FAQ', 'Placement'] : ['पाठ्यक्रम', 'शुल्क', 'सामान्य प्रश्न', 'प्लेसमेंट'],
              action: (option: string) => submitQuery(option),
            },
          });
        }

        setMessages((prev) => [
          ...prev,
          ...newMessages
        ]);
      }
    }
    if (aiState.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: aiState.error,
      });
    }
  }, [aiState, toast, language]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }, 100);
    }
  }, [messages, pendingQuery]);

  const startChat = (initialQuery?: string) => {
    const greetingMessage = {
      role: 'assistant',
      content: language === 'en' 
        ? "Hello! I am the university's AI admission counselor. How can I assist you today? You can ask me about courses, fees, eligibility, and more."
        : "नमस्ते! मैं विश्वविद्यालय का एआई एडमिशन काउंसलर हूं। मैं आज आपकी کیسے مدد کر सकता हूँ? आप मुझसे पाठ्यक्रम, शुल्क, पात्रता आदि के बारे में पूछ सकते हैं।"
    } as Message;
    
    let initialMessages = [greetingMessage];
    setMessages(initialMessages);

    if (initialQuery) {
        submitQuery(initialQuery);
    }
    
    setShowChat(true);
  };
  
  if (!showChat) {
    return <InitialOptions 
      onOptionClick={handleOptionClick} 
      onQuerySubmit={handleQuerySubmit}
      transcript={transcript}
      isListening={isListening}
      startListening={startListening}
      stopListening={stopListening}
      language={language}
      setLanguage={setLanguage}
      />;
  }

  const showLeadForm = !leadCaptured && pendingQuery;

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="space-y-6 px-4 py-2">
          {messages.map((message, index) => {
             if ((message.component === 'CourseSelector' || message.component === 'FeeTypeSelector' || message.component === 'CourseInfoSelector' || message.component === 'FaqSelector' || message.component === 'PlacementInfoSelector') && message.componentProps) {
              return (
                <ActionableMessage key={index} message={message} {...message.componentProps} action={(q) => submitQuery(q)} />
              )
            }
            return <ChatMessage key={index} message={message} />;
          })}

          {showLeadForm && (
            <div className="flex justify-start animate-slide-in-bottom">
                 <div className="flex items-start gap-4 justify-start">
                    <Avatar className="h-9 w-9 border">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="max-w-xl rounded-lg px-4 py-3 bg-muted">
                        <LeadCaptureForm onSubmit={handleLeadCapture} />
                    </div>
                </div>
            </div>
          )}

           {isPending && (
            <div className="flex justify-start animate-pulse">
              <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3">
                <LoaderCircle className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const query = formData.get('query') as string;
            submitQuery(query);
          }}
          className="flex items-center gap-2"
        >
          <Input
            ref={inputRef}
            name="query"
            placeholder={isListening ? (language === 'en' ? "Listening..." : "सुन रहा हूँ...") : (language === 'en' ? "Ask about courses, fees, eligibility..." : "पाठ्यक्रम, शुल्क, पात्रता के बारे में पूछें...")}
            autoComplete="off"
            className="flex-1"
            required
            disabled={isPending || isListening || showLeadForm}
            onFocus={() => {
              if (messages.length === 0) {
                startChat();
              }
            }}
          />
          <Button
            type="button"
            size="icon"
            variant={isListening ? 'destructive' : 'outline'}
            onClick={handleVoiceInput}
            disabled={isPending || showLeadForm}
          >
            <Mic />
            <span className="sr-only">{isListening ? 'Stop listening' : 'Start listening'}</span>
          </Button>
          <Button type="submit" size="icon" disabled={isPending || showLeadForm}>
            <ArrowUp />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
}

    