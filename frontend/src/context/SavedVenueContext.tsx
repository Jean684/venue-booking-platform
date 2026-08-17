import { useToast } from "@chakra-ui/react";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

type SavedVenueProps = {
    children: ReactNode
}

type SavedVenueContext = {
    savedIds: string[];
    setSavedIds: React.Dispatch<React.SetStateAction<string[]>>
    addVenueToWishlist: (id: string) => void
}

const SavedVenueContext = createContext({} as SavedVenueContext)

export function useSavedVenue() {
    return useContext(SavedVenueContext)
}

export function SavedVenuesProvider({ children }: SavedVenueProps) {
    const toast = useToast();

    // Probs can make this into a single getSavedIds() ?
    // Next won't load with window initially (SSR) because Window is client-side
    // stored ids in "savedVenues" and parse if there is any ids
    // else, return empty array
    const [savedIds, setSavedIds] = useState<string[]>(() => {
        if (typeof window === "undefined") return [];
        const stored = localStorage.getItem("savedVenues");
        return stored ? JSON.parse(stored) : [];
    });

    // Debug
    // useEffect(() => {
    //     console.log("savedIds updated:", savedIds);
    // }, [savedIds]);

    useEffect(() => {
        localStorage.setItem("savedVenues", JSON.stringify(savedIds));
    }, [savedIds]);
    
    // Before adding need to check whether item was added already
    function addVenueToWishlist(newId: string) {
        if (savedIds.includes(newId)) {
            toast({
              title: "Error!",
              description: "You have already wishlisted!",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            return;
        } else {
            setSavedIds((prev) => {
                const updated = [...prev, newId]
                return updated
            })

            toast({
              title: "Success!",
              description: "You have wishlisted the venue",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
        }

    }

    return <SavedVenueContext.Provider value={{ savedIds, setSavedIds, addVenueToWishlist }}>
        {children}
    </SavedVenueContext.Provider>
}

