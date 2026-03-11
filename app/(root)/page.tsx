import React from 'react'
import Hero from "@/components/Hero";
import {sampleBooks} from "@/lib/constants";
import BookCard from "@/components/BookCard";

const Page = () => {
    return (
        <main className="container wrapper">
            <Hero />

            <div className="library-books-grid">
                {sampleBooks.map((book) => (
                     <BookCard id={book._id} title={book.title} author={book.author} slug={book.slug} coverURL={book.coverURL} coverColor={book.coverColor} />
                ))}
            </div>
        </main>
    )
}

export default Page
