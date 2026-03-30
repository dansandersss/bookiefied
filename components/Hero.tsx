import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus } from 'lucide-react'

const Hero = () => {
    return (
        <section className="wrapper mb-10 md:mb-16 ">
            <div className="library-hero-card">
                <div className="library-hero-content">
                    <div className="library-hero-text">
                        <h1 className="library-hero-title">Your Library</h1>
                        <p className="library-hero-description">
                            Convert your books into interactive AI conversations.
                            Listen, learn, and discuss your favorite reads.
                        </p>
                        <Link href="/books/new" className="library-cta-primary group">
                            <Plus className="icon-sm group-hover:rotate-90 transition-transform duration-300" />
                            Add new book
                        </Link>
                    </div>

                    <div className="library-hero-illustration-desktop">
                        <Image
                            src="/assets/hero-illustration.png"
                            alt="Vintage books and globe illustration"
                            width={400}
                            height={400}
                            className="object-contain"
                            priority
                        />
                    </div>

                    <div className="library-steps-card min-w-[240px]">
                        <div className="flex flex-col gap-6">
                            <div className="library-step-item">
                                <span className="library-step-number">1</span>
                                <div>
                                    <h3 className="library-step-title">Upload PDF</h3>
                                    <p className="library-step-description">Add your book file</p>
                                </div>
                            </div>
                            <div className="library-step-item">
                                <span className="library-step-number">2</span>
                                <div>
                                    <h3 className="library-step-title">AI Processing</h3>
                                    <p className="library-step-description">We analyze the content</p>
                                </div>
                            </div>
                            <div className="library-step-item">
                                <span className="library-step-number">3</span>
                                <div>
                                    <h3 className="library-step-title">Voice Chat</h3>
                                    <p className="library-step-description">Discuss with AI</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile illustration shows up only on smaller screens via existing css classes */}
                <div className="library-hero-illustration">
                    <Image
                        src="/assets/hero-illustration.png"
                        alt="Vintage books and globe illustration"
                        width={280}
                        height={280}
                        className="object-contain"
                    />
                </div>
            </div>

        </section>



    )
}

export default Hero
