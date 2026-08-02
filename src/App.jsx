import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Layout from "./assets/layout/Layout.jsx";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

import { GuideProvider } from './context/GuideContext';

// Create a client
const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    console.log(`version-1-Build Date: ${import.meta.env.VITE_BUILD_DATE}`);
  }, [])
  return (
    <QueryClientProvider client={queryClient}>
      <GuideProvider>
        <Layout />
        <ReactQueryDevtools initialIsOpen={true} />
        <Toaster containerStyle={{ zIndex: 9999999999999 }} />
      </GuideProvider>
    </QueryClientProvider>
  );
}

export default App;
