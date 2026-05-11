import React from 'react'
import HeroSection from "@/components/HeroSection";
import BookCard from "@/components/BookCard";
import {getAllBooks} from "@/lib/actions/book.actions";
import Search from "@/components/Search";
import {auth} from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export const dynamic = 'force-dynamic'

const Page = async ({ searchParams }: { searchParams: Promise<{ query?: string }> }) => {
    const { query } = await searchParams;
    const { userId } = await auth();

    const bookResults = await getAllBooks(query)
    const books = bookResults.success ? bookResults.data ?? [] : []

    return (
        <main className="wrapper container">
            <HeroSection />

            {!userId ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white/50 rounded-2xl border border-dashed border-gray-300 mx-auto max-w-2xl">
                    <h2 className="text-2xl font-serif font-bold mb-4 text-[#212a3b]">Please log in to see your library</h2>
                    <p className="text-gray-600 mb-8 max-w-md">You need to be authenticated to view and manage your books. Sign in to access your personal collection of interactive AI books.</p>
                    <SignInButton mode="modal">
                        <button className="bg-[#212a3b] text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-lg cursor-pointer">
                            Sign In Now
                        </button>
                    </SignInButton>
                </div>
            ) : (
                <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10">
                        <h2 className="text-3xl font-serif font-bold text-[#212a3b]">Recent Books</h2>
                        <Search />
                    </div>

                    <div className="library-books-grid">
                        {books.length > 0 ? (
                            books.map((book) => (
                                <BookCard key={book._id} _id={book._id} title={book.title} author={book.author} coverURL={book.coverURL} slug={book.slug} />
                            ))
                        ) : (
                            <p className="text-center text-gray-500 col-span-full">No books found.</p>
                        )}
                    </div>
                </>
            )}
        </main>
    )
}

export default Page