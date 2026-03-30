'use client'

import React from 'react'
import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";
import { SignInButton, SignUpButton, Show, UserButton, useUser } from "@clerk/nextjs";

import { cn } from 'tailwind-cn';



const navItems = [
    {label: "Library", href: '/'},
    {label: "Add New", href: '/books/new'},
]

const Navbar = () => {
    const pathName = usePathname()
    const {user} = useUser()
    return (
        <header className="w-full fixed z-50 bg-('--bg-primary)">
            <div className="wrapper navbar-height py-4 flex justify-between items-center">
                <Link href="/" className="flex gap-0.5 items-center">
                    <Image src="/assets/logo.png" alt="Bookiefied" width={42} height={26} />
                    <span className="logo-text">Bookiefied</span>
                </Link>

                <nav className="w-fit flex gap-7.5 items-center">
                    {navItems.map(({label, href}) => {
                        const isActive = pathName === href || href !== '/' && pathName.startsWith(href);

                        return (
                            <Link className={cn('nav-link-base', isActive ? 'nav-link-active' : 'text-black hover:opacity-75')} href={href} key={label}>
                                {label}
                            </Link>
                        )
                    })}

                    <div className="flex gap-7.5 items-center">
                        <Show when="signed-out">
                            <SignInButton mode="modal">
                                <button className="nav-link-base text-black hover:opacity-75 cursor-pointer">Sign In</button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <button className="nav-link-base text-black hover:opacity-75 cursor-pointer">Sign Up</button>
                            </SignUpButton>
                        </Show>
                        <Show when="signed-in">
                            <div className="nav-user-link">
                                <UserButton afterSignOutUrl="/" />
                                {user ? .firstName && (
                                    <Link href='/subscriptions' className="nav-user-name">{user.firstName}</Link>
                                    )}
                            </div>
                        </Show>
                    </div>
                </nav>
            </div>
        </header>
    )
}
export default Navbar
