'use client';

import React, {useState} from 'react';
import {Input} from "@/components/ui/input";
import {Search as SearchIcon} from "lucide-react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

const Search = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [query, setQuery] = useState(searchParams.get('query') || '');

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        const params = new URLSearchParams(window.location.search);

        if (value) {
            params.set('query', value);
        } else {
            params.delete('query');
        }

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="library-search-wrapper">
            <div className="pl-4">
                <SearchIcon
                    size={20}
                    className="text-[var(--text-muted)]"
                />
            </div>
            <Input
                type="text"
                placeholder="Search books by title or author"
                className="library-search-input border-none shadow-none focus-visible:ring-0"
                value={query}
                onChange={handleSearch}
            />
        </div>
    );
};

export default Search;