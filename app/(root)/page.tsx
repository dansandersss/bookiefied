import React from 'react'
import Hero from "@/components/Hero";
import BookCard from "@/components/BookCard";
import {getAllBooks} from "@/lib/actions/book.actions";

const Page = async () => {

    const bookResults = await getAllBooks()
    const books = bookResults.success ? bookResults.data ?? [] : []
    return (
        <main className="container wrapper">
            <Hero />

            <div className="library-books-grid">
                {books.map((book) => (
                     <BookCard key={book._id} title={book.title} author={book.author} slug={book.slug} coverURL={book.coverURL} coverColor={book.coverColor} />
                ))}
            </div>
        </main>
    )
}

export default Page
