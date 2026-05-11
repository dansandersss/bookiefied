'use client';
import Link from "next/link";
import {BookCardProps} from "@/types";
import Image from "next/image";
import BookSettings from "@/components/BookSettings";

const BookCard = ({ _id, title, author, coverURL, slug }: BookCardProps) => {
    return (
        <div className="relative group">
            <div 
                className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 z-20"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                <BookSettings book={{ _id, title, author, slug }} variant="card" />
            </div>

            <Link href={`/books/${slug}`}>
                <article className="book-card">
                    <figure className="book-card-figure">
                        <div className="book-card-cover-wrapper">
                            <Image src={coverURL} alt={title} width={133} height={200} className="book-card-cover" />
                        </div>

                        <figcaption className="book-card-meta">
                            <h3 className="book-card-title">{title}</h3>
                            <p className="book-card-author">{author}</p>
                        </figcaption>
                    </figure>
                </article>
            </Link>
        </div>
    )
}
export default BookCard