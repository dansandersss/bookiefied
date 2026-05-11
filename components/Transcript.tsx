'use client'

import React, { useEffect, useRef } from 'react';
import { Mic } from 'lucide-react';
import { Messages } from '@/types';
import {Send} from "lucide-react";

interface TranscriptProps {
  messages: Messages[];
  currentMessage?: string;
  currentUserMessage?: string;
  onSendMessage?: (text: string) => void;
}

const Transcript = ({ messages, currentMessage, currentUserMessage, onSendMessage }: TranscriptProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentMessage, currentUserMessage]);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (inputRef.current && onSendMessage) {
          const text = inputRef.current.value.trim();
          if (text) {
              onSendMessage(text);
              inputRef.current.value = '';
          }
      }
  };

  const isEmpty = messages.length === 0 && !currentMessage && !currentUserMessage;

  return (
    <div className="transcript-container shadow-sm min-h-[400px]">
      <div className="transcript-messages" ref={scrollRef}>
        {isEmpty ? (
           <div className="transcript-empty">
             <Mic className="size-12 text-[#212a3b] mb-4" />
             <h3 className="transcript-empty-text">No conversation yet</h3>
             <p className="transcript-empty-hint">Click the mic button above to start talking, or type below</p>
           </div>
        ) : (
            <>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`transcript-message ${
                            msg.role === 'user' ? 'transcript-message-user' : 'transcript-message-assistant'
                        }`}
                    >
                        <div
                            className={`transcript-bubble ${
                                msg.role === 'user' ? 'transcript-bubble-user' : 'transcript-bubble-assistant'
                            }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}

                {currentUserMessage && (
                    <div className="transcript-message transcript-message-user">
                        <div className="transcript-bubble transcript-bubble-user">
                            {currentUserMessage}
                            <span className="transcript-cursor" />
                        </div>
                    </div>
                )}

                {currentMessage && (
                    <div className="transcript-message transcript-message-assistant">
                        <div className="transcript-bubble transcript-bubble-assistant">
                            {currentMessage}
                            <span className="transcript-cursor" />
                        </div>
                    </div>
                )}
            </>
        )}
      </div>

      <div className="transcript-input-wrapper">
          <form onSubmit={handleSubmit} className="transcript-input-form">
              <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a message..."
                  className="transcript-input-field"
              />
              <button type="submit" className="transcript-send-btn">
                  <Send className="size-5" />
              </button>
          </form>
      </div>
    </div>
  );
};

export default Transcript;
