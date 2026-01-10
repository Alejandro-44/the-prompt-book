import {
  Container,
  Typography,
  CircularProgress,
  Pagination,
  Grid,
} from "@mui/material";
import { UserCard } from "../components/UserCard";
import { useUser, useUserPrompts } from "../hooks";
import { PromptsGrid } from "@/features/prompts/components/PromptsGrid";
import { useParams } from "react-router";

type UserPageProps = {
  mode: "me" | "public";
};

export function UserPage({ mode }: UserPageProps) {
  const { userHandle } = useParams();
  const { user, isLoading, error } = useUser({ mode, userHandle });
  const { prompts, page, pages, setPage } = useUserPrompts({ mode, userHandle });

  if (isLoading) {
    return (
      <Container sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          Error loading user: {error.message}
        </Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6">User not found</Typography>
      </Container>
    );
  }

  return (
    <>
      <Container sx={{ mt: 4 }}>
        <UserCard user={user} />
      </Container>
      <Container sx={{ mt: 2 }}>
        <Typography variant="h5" component="h2">
          {mode === "me" ? "My Prompts" : `${user.username}'s prompts`}
        </Typography>
        <Grid justifyContent="center">
          {prompts ? (
            <>
              <PromptsGrid prompts={prompts} editable={mode === "me"} />
              <Pagination
                sx={{ justifySelf: "center" }}
                count={pages}
                page={page}
                onChange={(_, page) => setPage(page)}
                variant="outlined"
                shape="rounded"
              />
            </>
          ) : (
            <Typography>Share your first prompt</Typography>
          )}
        </Grid>
      </Container>
    </>
  );
}
