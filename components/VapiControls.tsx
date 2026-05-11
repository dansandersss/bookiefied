'use client';

import {Mic, MicOff} from "lucide-react";
import useVapi from "@/hooks/useVapi";
import {IBook} from "@/types";
import Image from "next/image";
import Transcript from "@/components/Transcript";
import {toast} from "sonner";
import BookSettings from "@/components/BookSettings";

import {useRouter} from "next/navigation";
import {useEffect} from "react";

const VapiControls = ({ book }: { book: IBook }) => {
    const { status, isActive, messages, currentMessage, currentUserMessage, duration, start, stop, clearError, limitError, isBillingError, maxDurationSeconds, sendTextMessage, resetHistory } = useVapi(book)
    const router = useRouter();

    useEffect(() => {
        if (limitError) {
            toast.error(limitError);
            if (isBillingError) {
                router.push("/subscriptions");
            } else {
                router.push("/");
            }
            clearError();
        }
    }, [isBillingError, limitError, router, clearError]);

    const handleSendMessage = (text: string) => {
        sendTextMessage(text);
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getStatusDisplay = () => {
        switch (status) {
            case 'connecting': return { label: 'Connecting...', color: 'vapi-status-dot-connecting' };
            case 'starting': return { label: 'Starting...', color: 'vapi-status-dot-starting' };
            case 'listening': return { label: 'Listening', color: 'vapi-status-dot-listening' };
            case 'thinking': return { label: 'Thinking...', color: 'vapi-status-dot-thinking' };
            case 'speaking': return { label: 'Speaking', color: 'vapi-status-dot-speaking' };
            default: return { label: 'Ready', color: 'vapi-status-dot-ready' };
        }
    };

    const statusDisplay = getStatusDisplay();

    return (
        <>
            <div className="max-w-4xl mx-auto flex flex-col gap-8">
                {/* Header Card */}
                <div className="vapi-header-card">
                    <div className="vapi-cover-wrapper" style={{ backgroundColor: book.coverColor }}>
                        <Image
                            src={book.coverURL || "/images/book-placeholder.png"}
                            alt={book.title}
                            width={120}
                            height={180}
                            className="vapi-cover-image !w-[120px] !h-auto"
                            priority
                        />
                        <div className="vapi-mic-wrapper relative">
                            {isActive && (status === 'speaking' || status === 'thinking') && (
                                <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${status === 'speaking' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                            )}
                            <button
                                onClick={isActive ? stop : start}
                                disabled={status === 'connecting'}
                                className={`vapi-mic-btn shadow-md !w-[60px] !h-[60px] z-10 transition-colors duration-300 ${isActive ? 'vapi-mic-btn-active bg-green-500' : 'vapi-mic-btn-inactive bg-yellow-500'}`}
                            >
                                {isActive ? (
                                    <Mic className="size-7 text-[#212a3b]" />
                                ) : (
                                    <MicOff className="size-7 text-[#212a3b]" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#212a3b]">
                                {book.title}
                            </h1>
                            <div className="shrink-0">
                                <BookSettings 
                                    book={{ _id: book._id, title: book.title, author: book.author, slug: book.slug }} 
                                    variant="page" 
                                    onChatCleared={resetHistory}
                                />
                            </div>
                        </div>
                        <p className="text-[#3d485e] font-medium mt-1">by {book.author}</p>

                        <div className="flex flex-wrap gap-3">
                            <div className="vapi-status-indicator">
                                <span className={`vapi-status-dot ${statusDisplay.color}`} />
                                <span className="vapi-status-text">{statusDisplay.label}</span>
                            </div>

                            <div className="vapi-status-indicator">
                                <span className="vapi-status-text">Voice: {book.persona || "Daniel"}</span>
                            </div>

                            <div className="vapi-status-indicator">
                                <span className="vapi-status-text">
                                    {formatDuration(duration)}/{formatDuration(maxDurationSeconds)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="vapi-transcript-wrapper">
                    <Transcript
                        messages={messages}
                        currentMessage={currentMessage}
                        currentUserMessage={currentUserMessage}
                        onSendMessage={handleSendMessage}
                    />
                </div>
            </div>
        </>
    )
}
export default VapiControls