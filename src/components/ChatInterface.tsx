import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, ExternalLink, BookOpen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ragService, type RAGResponse } from '@/services/ragService';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface ChatMessage {
  id: string;
  message: string;
  response?: string;
  message_type: string;
  created_at: string;
  ragResponse?: RAGResponse;
}

interface ChatInterfaceProps {
  user: SupabaseUser;
  initialMessage?: string;
  suggestedQuestion?: string;
}

const ChatInterface = ({ user, initialMessage, suggestedQuestion }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Agentic RAG-powered response using the RAG service
  const generateSIAResponse = async (message: string): Promise<{ response: string; ragResponse?: RAGResponse }> => {
    try {
      // Use the RAG service to get evidence-based response
      const ragResponse = await ragService.getRAGResponse({
        message,
        userId: user.id,
        context: {
          userRole: 'survivor', // TODO: Get from user profile
          previousMessages: messages.slice(-5).map(m => m.message), // Last 5 messages for context
        }
      });

      return {
        response: ragResponse.response,
        ragResponse: ragResponse
      };
    } catch (error) {
      console.error('Error generating RAG response:', error);
      return {
        response: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment, or contact support if the issue persists."
      };
    }
  };

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading chat history",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async (messageToSend?: string) => {
    const messageText = messageToSend || currentMessage.trim();

    if (!messageText || isLoading) return;

    const userMessage = messageText;
    if (!messageToSend) setCurrentMessage(''); // Only clear if not auto-sending
    setIsLoading(true);

    try {
      // Add user message to database
      const { data: userMsg, error: userError } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          message: userMessage,
          message_type: 'user'
        })
        .select()
        .single();

      if (userError) throw userError;

      // Update UI with user message
      setMessages(prev => [...prev, userMsg]);

      // Get RAG-powered response
      const { response: siaResponse, ragResponse } = await generateSIAResponse(userMessage);

      // Add SIA response to database
      const { data: siaMsg, error: siaError } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          message: siaResponse,
          message_type: 'sia'
        })
        .select()
        .single();

      if (siaError) throw siaError;

      // Update UI with SIA response (including RAG data)
      const siaMessageWithRAG = {
        ...siaMsg,
        ragResponse: ragResponse
      };
      setMessages(prev => [...prev, siaMessageWithRAG]);

    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChatHistory();
  }, [user]);

  useEffect(() => {
    if (initialMessage) {
      setCurrentMessage(initialMessage);
    }
  }, [initialMessage]);

  // Listen for suggested questions from parent component
  useEffect(() => {
    if (suggestedQuestion && suggestedQuestion.trim()) {
      setCurrentMessage(suggestedQuestion);
      // Auto-send the question after a brief delay
      setTimeout(() => {
        if (!isLoading) {
          handleSendMessage(suggestedQuestion);
        }
      }, 500);
    }
  }, [suggestedQuestion, isLoading]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => handleSendMessage();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-[600px] flex flex-col p-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
        <div className="relative">
          <img
            src="/sia-avatar.png"
            alt="SIA Avatar"
            className="w-12 h-12 rounded-full object-cover shadow-md"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-primary">SIA - Sweet Intelligent Assistant</h3>
          <p className="text-sm text-muted-foreground">LARS AMA Agent • Evidence Synthesis & Clinical Guidance</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">RAG-Enhanced AI Ready</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-muted/10 rounded-lg border border-border/20">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="animate-bounce mb-6">
                <img
                  src="/sia-avatar.png"
                  alt="SIA Avatar"
                  className="w-20 h-20 mx-auto rounded-full object-cover shadow-lg"
                />
              </div>
              <div className="max-w-2xl mx-auto space-y-4">
                <h3 className="text-2xl font-bold text-primary mb-2">
                  Hello, Welcome, I am SIA
                </h3>
                <p className="text-lg font-semibold text-primary mb-4">
                  Sweet Intelligent Assistant
                </p>

                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 text-left">
                  <h4 className="text-xl font-bold text-primary mb-4">Welcome!!</h4>

                  <p className="text-gray-700 mb-4 leading-relaxed">
                    This community is different. You are not alone — you've found a safe, private space where we focus on solutions, not problems.
                  </p>

                  <div className="mb-4">
                    <div className="text-gray-500 line-through text-sm space-x-2">
                      <span>Vent.</span>
                      <span>Sad.</span>
                      <span>Gloomy</span>
                      <span>I'll give up</span>
                      <span>I can't</span>
                      <span>Why me?</span>
                      <span>I'm broken</span>
                      <span>It's over</span>
                    </div>
                  </div>

                  <div className="text-gray-700 text-sm leading-relaxed">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span>💪 Strength</span>
                      <span>·</span>
                      <span>🌱 Growth</span>
                      <span>·</span>
                      <span>🤝 Togetherness</span>
                      <span>·</span>
                      <span>☀️ Hope</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span>🛡️ Resilience</span>
                      <span>·</span>
                      <span>💜 Quality of Life</span>
                      <span>·</span>
                      <span>🙏 Immense Gratitude</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span>📈 Self Improvement</span>
                      <span>·</span>
                      <span>✨ Better Version Each Day</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span>🧘 I'm Calm</span>
                      <span>·</span>
                      <span>😊 I'm Positive</span>
                      <span>·</span>
                      <span>🧘 I'm peaceful</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span>✨ I can</span>
                      <span>·</span>
                      <span>🏆 I Win</span>
                    </div>

                    <p className="font-bold text-primary text-base">
                      This is who we are at Let's DeLARSify — strong, hopeful, and unstoppable.
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 mt-6">
                  I'm here to provide evidence-based support and guidance on your LARS journey.
                  <span className="text-primary font-medium"> How can I help you today?</span>
                </p>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.message_type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.message_type === 'sia' && (
                <img
                  src="/sia-avatar.png"
                  alt="SIA Avatar"
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
              )}

              <div
                className={`max-w-[70%] p-3 rounded-lg ${msg.message_type === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border'
                  }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>

                {/* RAG Sources for SIA responses */}
                {msg.message_type === 'sia' && msg.ragResponse?.sources && msg.ragResponse.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/20">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">Sources:</span>
                    </div>
                    <div className="space-y-1">
                      {msg.ragResponse.sources.slice(0, 3).map((source, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground truncate flex-1 mr-2">
                            {source.title}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {Math.round(source.confidence * 100)}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <span className="text-xs opacity-70 mt-2 block">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </span>
              </div>

              {msg.message_type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <User className="w-4 h-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-card border p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <Textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message to SIA (Scientific & Intelligent Assistant)..."
            className="resize-none"
            rows={2}
          />
          <Button
            onClick={sendMessage}
            disabled={!currentMessage.trim() || isLoading}
            size="sm"
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;