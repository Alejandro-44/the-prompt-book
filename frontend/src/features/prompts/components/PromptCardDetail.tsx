import {
  Avatar,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { usePrompt } from "../hooks";
import { PromptTags } from "./PromptTags";
import { CopyIcon } from "lucide-react";
import { Link } from "react-router";
import { useRedirectOn } from "@/features/auth/hooks";

type Props = {
  promptId: string;
};

export function PromptCardDetail({ promptId }: Props) {
  const { data: prompt, error } = usePrompt({ promptId });
  useRedirectOn({ when: error?.status === 404, to: "/404" });

  return (
    <Card component="article" sx={{ maxWidth: "md", mx: "auto" }}>
      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid container size={12}>
            <Typography variant="body1">{prompt?.model}</Typography>
            <PromptTags tags={prompt?.hashtags || []} />
          </Grid>
          <Grid size={12}>
            <Typography component="h1" variant="h4" fontWeight={600}>
              {prompt?.title}
            </Typography>
          </Grid>
          <Grid size={12}>
            <Stack
              component={Link}
              to={`/users/${prompt?.authorHandle}`}
              display="inline-flex"
              direction="row"
              alignItems="center"
              spacing={1}
              data-testid="author-link"
            >
              <Avatar sx={{ backgroundColor: "#f14b09ff" }}>
                {prompt?.authorName.slice(0, 2).toUpperCase()}
              </Avatar>
              <Typography sx={{ ":hover": { textDecoration: "underline" } }}>
                {prompt?.authorName}
              </Typography>
            </Stack>
          </Grid>
          <Grid size={12}>
            <Typography>{prompt?.description}</Typography>
          </Grid>
          <Grid size={12}>
            <Divider />
          </Grid>
          <Grid size={12}>
            <Stack direction="row" justifyContent="space-between">
              <Typography component="h2" variant="h6" fontWeight={600}>
                Prompt
              </Typography>
              <Button variant="outlined" size="small" startIcon={<CopyIcon />}>
                Copy
              </Button>
            </Stack>
            <Paper
              sx={{
                mt: 2,
                p: 3,
                bgcolor: "#E8E8E8",
              }}
              variant="outlined"
            >
              <Typography
                component="pre"
                sx={{
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                  whiteSpace: "pre-wrap",
                  m: 0,
                  color: "text.primary",
                  lineHeight: 1.6,
                }}
              >
                {prompt?.prompt}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={12}>
            <Divider />
          </Grid>
          <Grid size={12}>
            <Typography
              component="h2"
              variant="h6"
              fontWeight={600}
              gutterBottom
            >
              Result
            </Typography>
            <Typography sx={{ lineHeight: 1.7 }}>
              {prompt?.resultExample}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
