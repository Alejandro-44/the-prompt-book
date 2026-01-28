import { screen } from '@testing-library/react';
import { PromptsFeed } from '../PromptsFeed';
import { renderWithProviders } from '@/tests/utils/renderWithProviders';
const mockPrompts = [
  {
    id: "69398c1d5393462cecf974c9",
    title: "TikTok script idea",
    description:
      "Prompt for generating short and humorous scripts designed for TikTok content.",
    hashtags: ['tiktok' ,'scripts'],
    model: "gpt-3.5",
    pubDate: new Date("2024-02-23T12:05:00"),
    authorName: "creative_io",
    authorHandle: "creative_io",
    likesCount: 42,
  },
  {
    id: "69398c1d5393462cecf974c8",
    title: "Code documentation generator",
    description:
      "Technical prompt for generating code documentation using the JSDoc standard.",
    hashtags: ["javascript"],
    model: "gpt-4o",
    pubDate: new Date("2024-02-22T09:12:00"),
    authorName: "creative_io",
    authorHandle: "creative_io",
    likesCount: 30,
  },
  {
    id: "69398c1d5393462cecf974c7",
    title: "Rewrite text professionally",
    description:
      "Prompt for rewriting text using a formal and professional tone.",
    hashtags: [],
    model: "gpt-4o",
    pubDate: new Date("2024-02-21T17:40:00"),
    authorName: "creative_io",
    authorHandle: "creative_io",
    likesCount: 10,
  },
]

describe('PromptsFeed', () => {
  it('renders without crashing with empty prompts array', () => {
    renderWithProviders(<PromptsFeed prompts={[]} />);
    const container = screen.getByTestId("prompts-feed");
    expect(container).toBeDefined();
  });

  it('renders a PromptCard for each prompt in the array', () => {
    renderWithProviders(<PromptsFeed prompts={mockPrompts} />);
    const cards = screen.getAllByTestId('prompt-card');
    expect(cards).toHaveLength(mockPrompts.length);
  });
});
