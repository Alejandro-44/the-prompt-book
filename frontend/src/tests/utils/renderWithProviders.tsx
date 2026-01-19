import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryRouter, RouterProvider } from "react-router";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { PromptOwnerGuard } from "@/features/auth/components/PromptOwnerGuard";
import { PromptDetail } from "@/features/prompts/pages/PromptDetail";

export function renderWithProviders(
  ui: React.ReactNode,
  initialEntries: string[] = ["/test"]
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <div>Home</div>,
      },
      {
        path: "test",
        element: ui,
      },
      {
        path: "prompts",
        children: [
          {
            path: ":promptId",
            children: [
              {
                index: true,
                Component: PromptDetail,
              },
              {
                Component: PromptOwnerGuard,
                children: [
                  {
                    path: "edit",
                    element: <div>Edit Prompt</div>,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "users/:id",
        element: <div>Author page</div>,
      },
      {
        path: "login",
        element: <div>Login page</div>,
      },
      {
        Component: ProtectedRoute,
        children: [
          {
            path: "private",
            element: <div>Private Page</div>,
          },
        ],
      },
      {
        path: "404",
        element: <div>404</div>,
      },
      {
        path: "403",
        element: <div>403</div>,
      },
    ],
    {
      initialEntries,
    }
  );

  const renderResult = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );

  return { ...renderResult, router };
}
