'use client'

import {Mic, MicOff} from "lucide-react";
import useVapi from "@/hooks/useVapi";
import {IBook} from "@/types";
import Image from "next/image";
import React from "react";
import Transcript from "@/components/Transcript";

const VapiControls = ({book}: {book:IBook}) => {
    const {status, isActive, messages, currentAssistantMessage, currentUserMessage, duration, start, stop, clearErrors} = useVapi(book)
    return (
        <>

            <div className="max-w-4xl mx-auto flex flex-col gap-8">
                {/* Header Card */}
                <div className="vapi-header-card">
                    <div className="vapi-cover-wrapper">
                        <Image
                            src={book.coverURL || '/placeholder-cover.jpg'}
                            alt={book.title}
                            width={130}
                            height={195}
                            className="vapi-cover-image"
                        />
                        <div className="vapi-mic-wrapper">
                            {(status === 'thinking' || status === 'speaking') && (
                                <div className="vapi-pulse-ring" />
                            )}
                            <button onClick={isActive ? stop : start} disabled={status === 'connecting'} className="vapi-mic-btn shadow-lg">
                                {isActive ? (
                                    <Mic className="size-7 text-[#212a3b]" />
                                ) : (
                                    <MicOff className="size-7 text-[#212a3b]" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl md:text-3xl font-bold font-serif text-[#212a3b] leading-tight">
                            {book.title}
                        </h1>
                        <p className="text-[#3d485e] text-base">by {book.author}</p>

                        <div className="flex flex-wrap gap-2 mt-4">
                            <div className="vapi-status-indicator">
                                <span className={`vapi-status-dot vapi-status-dot-${status}`} />
                                <span className="vapi-status-text uppercase">{status}</span>
                            </div>
                            <div className="vapi-status-indicator">
                                <span className="vapi-status-text">Voice: {book.persona || 'Daniel'}</span>
                            </div>
                            <div className="vapi-status-indicator">
                                <span className="vapi-status-text">0:00/15:00</span>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="vapi-transcript-wrapper">
                    <Transcript
                        messages={messages}
                        currentMessage={currentAssistantMessage}
                        currentUserMessage={currentUserMessage}
                    />
                </div>

            </div>
        </>

    )
}
export default VapiControls

