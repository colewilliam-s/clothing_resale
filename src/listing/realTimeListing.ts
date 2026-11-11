import { useEffect, useRef } from 'react';
import { supabase } from '../supabase';

let channelCount = 0;  // give each subscription its own channel name

// calls onChange whenever a listing is added, edited (photo, price, sold status, ...)
// passing the sellerId to only watch on person's listings for adds and edits

export function realTimeListing(onChange: () => void, sellerId?: string) {
    const callback = useRef(onChange);
    useEffect(() => {
        callback.current = onChange; // always call the latest version without resubscribing
    });

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | undefined;
        // wait a moment so several quick changes cause one reload, not many
        const notify = () => {
            clearTimeout(timer);
            timer = setTimeout(() => callback.current(), 300);
        };

        const filter = sellerId ? `seller_id=eq.${sellerId}` : undefined;

        const channel = supabase
            .channel(`listings:${sellerId ?? 'all'}:${++channelCount}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'listings', filter }, notify)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'listings', filter }, notify)
            // Delete events can't be filtered by seller, so any delete triggers a reload
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'listings' }, notify)
            .subscribe();
        
        return () => {
            clearTimeout(timer);
            supabase.removeChannel(channel)
        }    ;
    }, [sellerId]);
}