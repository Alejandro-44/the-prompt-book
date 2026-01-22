import { createBrowserRouter } from "react-router";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { Layout } from "@/components/Layout";
import { UserPage } from "@/features/users/page/UserPage";
import { HomePage } from "@/features/home/pages/HomePage";
import { PromptDetail } from "@/features/prompts/pages/PromptDetail";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { CreatePrompt } from "@/features/prompts/pages/CreatePrompt";
import { PromptOwnerGuard } from "@/features/auth/components/PromptOwnerGuard";
import { EditPrompt } from "@/features/prompts/pages/EditPrompt";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { UnauthorizedPage } from "@/pages/UnauthorizedPage";
import { SearchPage } from "@/features/explore/pages/SearchPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "login",
        Component: LoginPage,
      },
      {
        path: "register",
        Component: RegisterPage,
      },
      {
        path: "users",
        children: [
          {
            Component: ProtectedRoute,
            children: [
              {
                path: "me",
                Component: () => <UserPage mode="me" />,
              },
            ],
          },
          {
            path: ":userHandle",
            Component: () => <UserPage mode="public" />,
          },
        ],
      },
      {
        path: "explore",
        Component: SearchPage,
      },
      {
        path: "prompts",
        children: [
          {
            path: ":promptId",
            Component: PromptDetail,
          },
          {
            Component: ProtectedRoute,
            children: [
              {
                path: "new",
                Component: CreatePrompt,
              },
            ],
          },
          {
            Component: ProtectedRoute,
            children: [
              {
                Component: PromptOwnerGuard,
                children: [
                  {
                    path: ":promptId/edit",
                    Component: EditPrompt,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "404",
        Component: NotFoundPage,
      },
      {
        path: "403",
        Component: UnauthorizedPage,
      },
    ],
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);
