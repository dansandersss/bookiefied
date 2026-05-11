'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Edit2, Trash2, MessageSquareOff, X, Check } from 'lucide-react';
import { updateBook, deleteBook } from '@/lib/actions/book.actions';
import { clearChatHistory } from '@/lib/actions/chat.actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BookSettingsProps {
    book: {
        _id: string;
        title: string;
        author: string;
        slug: string;
    };
    onChatCleared?: () => void;
    variant?: 'card' | 'page';
}

const BookSettings = ({ book, onChatCleared, variant = 'card' }: BookSettingsProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isClearingChat, setIsClearingChat] = useState(false);
    const [title, setTitle] = useState(book.title);
    const [author, setAuthor] = useState(book.author);
    const [isPending, setIsPending] = useState(false);
    
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !author) return;
        
        setIsPending(true);
        try {
            const result = await updateBook(book._id, { title, author });
            if (result.success) {
                toast.success('Book updated successfully');
                setIsEditing(false);
                setIsOpen(false);
                router.refresh();
            } else {
                toast.error(result.error as string || 'Failed to update book');
            }
        } catch (error) {
            toast.error('An error occurred while updating the book');
        } finally {
            setIsPending(false);
        }
    };

    const handleDelete = async () => {
        setIsPending(true);
        try {
            const result = await deleteBook(book._id);
            if (result.success) {
                toast.success('Book deleted successfully');
                if (variant === 'page') {
                    router.push('/');
                }
            } else {
                toast.error(result.error as string || 'Failed to delete book');
            }
        } catch (error) {
            toast.error('An error occurred while deleting the book');
        } finally {
            setIsPending(false);
            setIsDeleting(false);
            setIsOpen(false);
        }
    };

    const handleClearChat = async () => {
        setIsPending(true);
        try {
            const result = await clearChatHistory(book._id);
            if (result.success) {
                toast.success('Chat history cleared');
                onChatCleared?.();
            } else {
                toast.error(result.error as string || 'Failed to clear chat history');
            }
        } catch (error) {
            toast.error('An error occurred while clearing chat history');
        } finally {
            setIsPending(false);
            setIsClearingChat(false);
            setIsOpen(false);
        }
    };

    if (variant === 'page') {
        return (
            <div className="flex items-center gap-2">
                {!isEditing && !isDeleting && !isClearingChat && (
                    <div className="relative" ref={menuRef}>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsOpen(!isOpen)}
                            className="h-9 w-9 p-0 rounded-full border-gray-200 hover:bg-gray-50 text-[#212a3b] shadow-sm"
                        >
                            <MoreHorizontal className="size-5" />
                        </Button>

                        {isOpen && (
                            <div 
                                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex flex-col p-1.5">
                                    <button 
                                        onClick={() => {
                                            setIsEditing(true);
                                            setIsOpen(false);
                                        }}
                                        className="flex items-center gap-2.5 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors text-gray-700"
                                    >
                                        <Edit2 className="size-4 text-gray-400" />
                                        <span className="text-sm font-medium">Edit Details</span>
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setIsClearingChat(true);
                                            setIsOpen(false);
                                        }}
                                        className="flex items-center gap-2.5 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors text-gray-700"
                                    >
                                        <MessageSquareOff className="size-4 text-gray-400" />
                                        <span className="text-sm font-medium">Clear Chat</span>
                                    </button>
                                    <div className="h-px bg-gray-100 my-1.5 mx-1" />
                                    <button 
                                        onClick={() => {
                                            setIsDeleting(true);
                                            setIsOpen(false);
                                        }}
                                        className="flex items-center gap-2.5 px-3 py-2 text-left hover:bg-red-50/50 rounded-lg transition-colors text-red-600"
                                    >
                                        <Trash2 className="size-4 text-red-400" />
                                        <span className="text-sm font-medium">Delete Book</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {(isEditing || isDeleting || isClearingChat) && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4" onClick={() => {
                        if (!isPending) {
                            setIsEditing(false);
                            setIsDeleting(false);
                            setIsClearingChat(false);
                        }
                    }}>
                        <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden" onClick={e => e.stopPropagation()}>
                            {isEditing && (
                                <form onSubmit={handleUpdate} className="p-6 flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-gray-800">Edit Book Details</h3>
                                        <button type="button" onClick={() => setIsEditing(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                            <X className="size-5 text-gray-400" />
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Book Title</label>
                                            <Input 
                                                value={title} 
                                                onChange={(e) => setTitle(e.target.value)} 
                                                placeholder="Enter book title"
                                                className="h-11 px-4"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Author Name</label>
                                            <Input 
                                                value={author} 
                                                onChange={(e) => setAuthor(e.target.value)} 
                                                placeholder="Enter author name"
                                                className="h-11 px-4"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-2">
                                        <Button 
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 h-11 font-bold"
                                            disabled={isPending}
                                        >
                                            Cancel
                                        </Button>
                                        <Button 
                                            type="submit" 
                                            disabled={isPending} 
                                            className="flex-1 h-11 font-bold bg-[#212a3b] hover:bg-opacity-90"
                                        >
                                            {isPending ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                </form>
                            )}

                            {isDeleting && (
                                <div className="p-6 flex flex-col gap-6">
                                    <div className="flex flex-col gap-2 text-center">
                                        <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-2">
                                            <Trash2 className="size-6 text-red-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800">Delete Book?</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            Are you sure you want to delete <span className="font-semibold text-gray-700">"{book.title}"</span>? This action cannot be undone and will remove all chat history.
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button 
                                            variant="outline" 
                                            onClick={() => setIsDeleting(false)} 
                                            className="flex-1 h-11 font-bold"
                                            disabled={isPending}
                                        >
                                            Cancel
                                        </Button>
                                        <Button 
                                            variant="destructive" 
                                            onClick={handleDelete} 
                                            className="flex-1 h-11 font-bold bg-red-600 hover:bg-red-700"
                                            disabled={isPending}
                                        >
                                            {isPending ? 'Deleting...' : 'Confirm Delete'}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {isClearingChat && (
                                <div className="p-6 flex flex-col gap-6">
                                    <div className="flex flex-col gap-2 text-center">
                                        <div className="mx-auto w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-2">
                                            <MessageSquareOff className="size-6 text-orange-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800">Clear Chat History?</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            This will permanently delete all messages in this conversation. The AI will start fresh next time.
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button 
                                            variant="outline" 
                                            onClick={() => setIsClearingChat(false)} 
                                            className="flex-1 h-11 font-bold"
                                            disabled={isPending}
                                        >
                                            Cancel
                                        </Button>
                                        <Button 
                                            onClick={handleClearChat} 
                                            className="flex-1 h-11 font-bold bg-[#212a3b] hover:bg-opacity-90"
                                            disabled={isPending}
                                        >
                                            {isPending ? 'Clearing...' : 'Clear History'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`relative ${variant === 'card' ? 'static' : ''}`} ref={menuRef}>
            <button 
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className={`p-1 transition-opacity ${variant === 'page' ? 'text-[#212a3b]' : 'text-[#212a3b] opacity-60 hover:opacity-100'}`}
                title="Book Settings"
            >
                <MoreHorizontal className="size-5" />
            </button>

            {isOpen && variant === 'card' && (
                <div 
                    className="absolute inset-0 z-50 flex items-center justify-center p-4"
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                >
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-[14px]" onClick={() => setIsOpen(false)} />
                    
                    <div className="relative w-full bg-white rounded-xl shadow-2xl border border-gray-100/50 overflow-hidden animate-in fade-in zoom-in duration-200">
                        {!isEditing && !isDeleting && !isClearingChat && (
                            <div className="flex flex-col p-1">
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2.5 px-3 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors text-gray-700"
                                >
                                    <Edit2 className="size-4 text-gray-400" />
                                    <span className="text-sm font-semibold">Edit Book</span>
                                </button>
                                <button 
                                    onClick={() => setIsClearingChat(true)}
                                    className="flex items-center gap-2.5 px-3 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors text-gray-700"
                                >
                                    <MessageSquareOff className="size-4 text-gray-400" />
                                    <span className="text-sm font-semibold">Clear Chat</span>
                                </button>
                                <div className="h-px bg-gray-100 my-0.5 mx-1" />
                                <button 
                                    onClick={() => setIsDeleting(true)}
                                    className="flex items-center gap-2.5 px-3 py-3 text-left hover:bg-red-50/50 rounded-lg transition-colors text-red-600"
                                >
                                    <Trash2 className="size-4 text-red-400" />
                                    <span className="text-sm font-semibold">Delete Book</span>
                                </button>
                                
                                <button 
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center gap-2 px-3 py-2 mt-1 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="size-3" />
                                    Close
                                </button>
                            </div>
                        )}

                        {isEditing && (
                            <form onSubmit={handleUpdate} className="p-4 flex flex-col gap-3">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-sm font-bold text-gray-800">Edit Details</h3>
                                    <button type="button" onClick={() => setIsEditing(false)}>
                                        <X className="size-4 text-gray-400" />
                                    </button>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-500">Title</label>
                                    <Input 
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)} 
                                        placeholder="Book Title"
                                        className="h-9 text-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-500">Author</label>
                                    <Input 
                                        value={author} 
                                        onChange={(e) => setAuthor(e.target.value)} 
                                        placeholder="Author Name"
                                        className="h-9 text-sm"
                                    />
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <Button 
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 h-9 text-xs font-bold"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        disabled={isPending} 
                                        className="flex-1 h-9 text-xs font-bold bg-[#212a3b] hover:bg-opacity-90"
                                    >
                                        {isPending ? 'Saving...' : 'Save'}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {isDeleting && (
                            <div className="p-4 flex flex-col gap-4 text-center">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-sm font-bold text-gray-800">Delete Book?</h3>
                                    <p className="text-[11px] text-gray-500 leading-tight">This will permanently remove the book and all its chat history.</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setIsDeleting(false)} 
                                        className="flex-1 h-9 text-xs font-bold"
                                        disabled={isPending}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        variant="destructive" 
                                        onClick={handleDelete} 
                                        className="flex-1 h-9 text-xs font-bold bg-red-600 hover:bg-red-700"
                                        disabled={isPending}
                                    >
                                        {isPending ? '...' : 'Delete'}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {isClearingChat && (
                            <div className="p-4 flex flex-col gap-4 text-center">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-sm font-bold text-gray-800">Clear History?</h3>
                                    <p className="text-[11px] text-gray-500 leading-tight">This will remove all previous messages for this book.</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setIsClearingChat(false)} 
                                        className="flex-1 h-9 text-xs font-bold"
                                        disabled={isPending}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        onClick={handleClearChat} 
                                        className="flex-1 h-9 text-xs font-bold bg-[#212a3b] hover:bg-opacity-90"
                                        disabled={isPending}
                                    >
                                        {isPending ? '...' : 'Clear'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isOpen && variant === 'page' && (
                <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {!isEditing && !isDeleting && !isClearingChat && (
                        <div className="flex flex-col p-1.5">
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2.5 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors text-gray-700"
                            >
                                <Edit2 className="size-4 text-gray-400" />
                                <span className="text-sm font-medium">Edit Book</span>
                            </button>
                            <button 
                                onClick={() => setIsClearingChat(true)}
                                className="flex items-center gap-2.5 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors text-gray-700"
                            >
                                <MessageSquareOff className="size-4 text-gray-400" />
                                <span className="text-sm font-medium">Clear Chat</span>
                            </button>
                            <div className="h-px bg-gray-100 my-1.5 mx-1" />
                            <button 
                                onClick={() => setIsDeleting(true)}
                                className="flex items-center gap-2.5 px-3 py-2 text-left hover:bg-red-50/50 rounded-lg transition-colors text-red-600"
                            >
                                <Trash2 className="size-4 text-red-400" />
                                <span className="text-sm font-medium">Delete Book</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BookSettings;
