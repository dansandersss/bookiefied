'use server';

import {CreateBook, TextSegment} from "@/types";
import {connectToDatabase} from "@/database/mongoose";
import {escapeRegex, generateSlug, serializeData} from "@/lib/utils";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/book-segment.model";
import mongoose from "mongoose";
import {getUserPlan} from "@/lib/subscription.server";
import {revalidatePath} from "next/cache";
import {PLAN_LIMITS} from "@/lib/subscription-constants";

export const getAllBooks = async (search?: string) => {
    try {
        await connectToDatabase();

        const { auth } = await import("@clerk/nextjs/server");
        const { userId } = await auth();

        if (!userId) {
            return {
                success: true,
                data: []
            }
        }

        let query: any = { clerkId: userId };

        if (search) {
            const escapedSearch = escapeRegex(search);
            const regex = new RegExp(escapedSearch, 'i');
            query.$or = [
                { title: { $regex: regex } },
                { author: { $regex: regex } },
            ];
        }

        const books = await Book.find(query).sort({ createdAt: -1 }).lean();

        return {
            success: true,
            data: serializeData(books)
        }
    } catch (e) {
        console.error('Error connecting to database', e);
        return {
            success: false, error: e
        }
    }
}

export const checkBookExists = async (title: string) => {
    try {
        await connectToDatabase();

        const { auth } = await import("@clerk/nextjs/server");
        const { userId } = await auth();

        if (!userId) {
            return { exists: false, error: 'Unauthorized' };
        }

        const slug = `${generateSlug(title)}-${userId.slice(-6)}`;

        const existingBook = await Book.findOne({slug, clerkId: userId}).lean();

        if(existingBook) {
            return {
                exists: true,
                book: serializeData(existingBook)
            }
        }

        return {
            exists: false,
        }
    } catch (e) {
        console.error('Error checking book exists', e);
        return {
            exists: false, error: e
        }
    }
}

export const createBook = async (data: CreateBook) => {
    try {
        await connectToDatabase();

        const { auth } = await import("@clerk/nextjs/server");
        const { userId } = await auth();

        if (!userId || userId !== data.clerkId) {
            return { success: false, error: "Unauthorized" };
        }

        const slug = `${generateSlug(data.title)}-${userId.slice(-6)}`;

        const existingBook = await Book.findOne({slug, clerkId: userId}).lean();

        if(existingBook) {
            return {
                success: true,
                data: serializeData(existingBook),
                alreadyExists: true,
            }
        }

        // Check subscription limits before creating a book
        const plan = await getUserPlan();
        const limits = PLAN_LIMITS[plan];

        const bookCount = await Book.countDocuments({ clerkId: userId });

        if (bookCount >= limits.maxBooks) {
            return {
                success: false,
                error: `You have reached the maximum number of books allowed for your ${plan} plan (${limits.maxBooks}). Please upgrade to add more books.`,
                isBillingError: true,
            };
        }

        const book = await Book.create({...data, clerkId: userId, slug, totalSegments: 0});

        revalidatePath('/')

        return {
            success: true,
            data: serializeData(book),
        }
    } catch (e) {
        console.error('Error creating a book', e);

        return {
            success: false,
            error: e,
        }
    }
}

export const getBookBySlug = async (slug: string) => {
    try {
        await connectToDatabase();

        const { auth } = await import("@clerk/nextjs/server");
        const { userId } = await auth();

        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        const book = await Book.findOne({ slug, clerkId: userId }).lean();

        if (!book) {
            return { success: false, error: 'Book not found' };
        }

        return {
            success: true,
            data: serializeData(book)
        }
    } catch (e) {
        console.error('Error fetching book by slug', e);
        return {
            success: false, error: e
        }
    }
}

export const saveBookSegments = async (bookId: string, clerkId: string, segments: TextSegment[]) => {
    try {
        await connectToDatabase();

        console.log('Saving book segments...');

        const segmentsToInsert = segments.map(({ text, segmentIndex, pageNumber, wordCount }) => ({
            clerkId, bookId, content: text, segmentIndex, pageNumber, wordCount
        }));

        await BookSegment.insertMany(segmentsToInsert);

        await Book.findByIdAndUpdate(bookId, { totalSegments: segments.length });

        console.log('Book segments saved successfully.');

        return {
            success: true,
            data: { segmentsCreated: segments.length}
        }
    } catch (e) {
        console.error('Error saving book segments', e);

        return {
            success: false,
            error: e,
        }
    }
}

// Searches book segments using MongoDB text search with regex fallback
export const searchBookSegments = async (bookId: string, query: string, limit: number = 5) => {
    try {
        await connectToDatabase();

        console.log(`Searching for: "${query}" in book ${bookId}`);

        const bookObjectId = new mongoose.Types.ObjectId(bookId);

        // Try MongoDB text search first (requires text index)
        let segments: Record<string, unknown>[] = [];
        try {
            segments = await BookSegment.find({
                bookId: bookObjectId,
                $text: { $search: query },
            })
                .select('_id bookId content segmentIndex pageNumber wordCount')
                .sort({ score: { $meta: 'textScore' } })
                .limit(limit)
                .lean();
        } catch {
            // Text index may not exist — fall through to regex fallback
            segments = [];
        }

        // Fallback: regex search matching ANY keyword
        if (segments.length === 0) {
            const keywords = query.split(/\s+/).filter((k) => k.length > 2);
            const pattern = keywords.map(escapeRegex).join('|');

            segments = await BookSegment.find({
                bookId: bookObjectId,
                content: { $regex: pattern, $options: 'i' },
            })
                .select('_id bookId content segmentIndex pageNumber wordCount')
                .sort({ segmentIndex: 1 })
                .limit(limit)
                .lean();
        }

        console.log(`Search complete. Found ${segments.length} results`);

        return {
            success: true,
            data: serializeData(segments),
        };
    } catch (error) {
        console.error('Error searching segments:', error);
        return {
            success: false,
            error: (error as Error).message,
            data: [],
        };
    }
};

export const updateBook = async (bookId: string, data: { title?: string; author?: string }) => {
    try {
        await connectToDatabase();

        const { auth } = await import("@clerk/nextjs/server");
        const { userId } = await auth();

        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        const updateData: any = { ...data };

        // If title is changing, we should probably update the slug too to keep it consistent
        if (data.title) {
            updateData.slug = `${generateSlug(data.title)}-${userId.slice(-6)}`;
        }

        const book = await Book.findOneAndUpdate(
            { _id: bookId, clerkId: userId },
            { $set: updateData },
            { new: true }
        ).lean();

        if (!book) {
            return { success: false, error: 'Book not found' };
        }

        revalidatePath('/');
        revalidatePath(`/books/${book.slug}`);

        return {
            success: true,
            data: serializeData(book)
        };
    } catch (e) {
        console.error('Error updating book', e);
        return { success: false, error: 'Failed to update book' };
    }
}

export const deleteBook = async (bookId: string) => {
    try {
        await connectToDatabase();

        const { auth } = await import("@clerk/nextjs/server");
        const { userId } = await auth();

        if (!userId) {
            return { success: false, error: 'Unauthorized' };
        }

        const book = await Book.findOneAndDelete({ _id: bookId, clerkId: userId });

        if (!book) {
            return { success: false, error: 'Book not found' };
        }

        // Clean up related data
        await BookSegment.deleteMany({ bookId });
        const ChatMessage = (await import("@/database/models/chat-message.model")).default;
        await ChatMessage.deleteMany({ bookId, clerkId: userId });

        revalidatePath('/');

        return {
            success: true
        };
    } catch (e) {
        console.error('Error deleting book', e);
        return { success: false, error: 'Failed to delete book' };
    }
}