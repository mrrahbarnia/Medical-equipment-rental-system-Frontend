"use client"

// import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";


export const ReactQueryProvider = ({ children }: Readonly<{children: React.ReactNode}>) => {
    const client: QueryClient = new QueryClient()

    return (
        <QueryClientProvider client={client}>
            {children}
            <ReactQueryDevtools />
        </QueryClientProvider>
    )
}
