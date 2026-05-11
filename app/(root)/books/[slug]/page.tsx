import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { ArrowLeft, MicOff, Mic } from 'lucide-react';
import { getBookBySlug } from '@/lib/actions/book.actions';
import VapiControls from "@/components/VapiControls";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const BookDetailsPage = async ({ params }: PageProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const { slug } = await params;
  const result = await getBookBySlug(slug);

  if (!result.success || !result.data) {
    redirect('/');
  }

  const book = result.data;

  return (
    <div className="book-page-container">
      {/* Floating Back Button */}
      <Link href="/" className="back-btn-floating">
        <ArrowLeft className="size-6 text-[#212a3b]" />
      </Link>

        {/* Transcript Area */}
          <VapiControls book={book} />
    </div>
  );
};

export default BookDetailsPage;
