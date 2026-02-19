"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export default function TimeAgo({ date }: { date: Date | string }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <span suppressHydrationWarning>
            {formatDistanceToNow(new Date(date), { addSuffix: true, locale: idLocale })}
        </span>
    );
}
