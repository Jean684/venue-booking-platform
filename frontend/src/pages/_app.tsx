import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "@chakra-ui/react/provider";
import { ChakraProvider } from "@chakra-ui/react";
import { SavedVenuesProvider } from "@/context/SavedVenueContext";

export default function App({ Component, pageProps }: AppProps) {
  return(
    <SavedVenuesProvider>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </SavedVenuesProvider>
  ) 
}


