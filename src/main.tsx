import { setQueryClient } from "@/services/sse-service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

// Request, Query 의 차이점
// Request: 서버에 요청을 보내고 응답을 받는 것
// Query: 서버에 요청을 보내고 응답을 캐싱하는 것

const queryClient = new QueryClient();

// SSE 서비스에 QueryClient 전달
setQueryClient(queryClient);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
