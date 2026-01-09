import type { PromptSummary } from "@/services";
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router";
import { PromptTags } from "./PromptTags";
import { Pencil, Sparkles } from "lucide-react";

type Props = {
  prompt: PromptSummary;
  editable?: boolean;
};

export function PromptCard({ prompt, editable = false }: Props) {
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        position: "relative",
        height: "100%",
        transition: "all 0.2s ease-in-out",
        "&:hover .edit-button": { opacity: 1 },
      }}
      data-testid="prompt-card"
    >
      {editable && (
        <Tooltip title="Edit">
          <IconButton
            className="edit-button"
            sx={{
              position: "absolute",
              right: 4,
              top: 4,
              zIndex: 10,
              opacity: 0,
              backgroundColor: "#DFDFDF",
            }}
            data-testid="edit-button"
            onClick={() => navigate(`/prompts/${prompt.id}/edit`)}
          >
            <Pencil fill="inherit" stroke="1px" />
          </IconButton>
        </Tooltip>
      )}
      <CardActionArea
        sx={{ height: "inherit", mb: 2 }}
        component={Link}
        to={`/prompts/${prompt.id}`}
        data-testid="prompt-link"
      >
        <CardContent
          sx={{
            height: "100%",
          }}
        >
          <Grid
            sx={{ height: "inherit" }}
            container
            spacing={1}
            alignItems="space-between"
          >
            <Grid size={12} alignContent="space-between">
              <Stack alignItems="baseline" direction="row" spacing={2}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Sparkles fill="inherit" stroke={"1px"} size={16} />
                  <Typography>{prompt.model}</Typography>
                </Stack>
                <PromptTags tags={prompt.hashtags} />
              </Stack>
            </Grid>
            <Grid size={12}>
              <Typography component="h3" variant="h6">
                {prompt.title}
              </Typography>
            </Grid>
            <Grid size={12}>
              <Typography>By {prompt.authorName}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
