import { cleanup, screen } from "@testing-library/react";
import { PromptsGrid } from "../PromptsGrid";
import { renderWithProviders } from "@/tests/utils/renderWithProviders";

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

describe("PromptsGrid", () => {
  beforeEach(() => {
    renderWithProviders(<PromptsGrid prompts={mockPrompts} />);
  });
  afterEach(() => {
    cleanup();
  });

  it("render PromptCard components when prompts are passed", async () => {
    mockPrompts.forEach((prompt) => {
      expect(screen.getByText(prompt.title)).toBeDefined();
    });
    
    const grid = screen.getByTestId('prompts-grid');
    expect(grid).toBeDefined();

    const promptCards = screen.getAllByTestId("prompt-card");
    expect(promptCards).toHaveLength(mockPrompts.length);

    const children = Array.from(grid!.children);
    expect(children).toHaveLength(9);

    const emptyDivs = screen.getAllByTestId("prompt-card-empty");
    expect(emptyDivs).toHaveLength(6);
  });
});

describe("PromptsGrid with empty prompts", () => {
  it("renders 9 empty divs when no prompts are provided", () => {
    renderWithProviders(<PromptsGrid prompts={[]} />);
    const emptyDivs = screen.getAllByTestId("prompt-card-empty");
    expect(emptyDivs).toHaveLength(9);
  });
});

describe("PromptsGrid with custom itemsLimit", () => {
  it("renders prompts and fillers up to itemsLimit", () => {
    renderWithProviders(<PromptsGrid prompts={mockPrompts.slice(0,2)} itemsLimit={5} />);

    const grid = screen.getByTestId('prompts-grid');
    expect(grid).toBeDefined();
    expect(grid.children).toHaveLength(5);

    const promptCards = screen.getAllByTestId("prompt-card");
    expect(promptCards).toHaveLength(2);

    const emptyDivs = screen.getAllByTestId("prompt-card-empty");
    expect(emptyDivs).toHaveLength(3);
  });

  it("renders no fillers when prompts length equals itemsLimit", () => {
    renderWithProviders(<PromptsGrid prompts={mockPrompts.slice(0,3)} itemsLimit={3} />);
    const grid = screen.getByTestId('prompts-grid');
    expect(grid).toBeDefined();
    expect(grid.children).toHaveLength(3);

    const promptCards = screen.getAllByTestId("prompt-card");
    expect(promptCards).toHaveLength(3);

    const emptyDivs = promptCards.filter(card => card.getAttribute('data-testid') === 'prompt-card-empty');
    expect(emptyDivs).toHaveLength(0);
  });

  it("renders all prompts when prompts length exceeds itemsLimit", () => {
    renderWithProviders(<PromptsGrid prompts={mockPrompts.slice(0,3)} itemsLimit={2} />);

    const grid = screen.getByTestId('prompts-grid');
    expect(grid).toBeDefined();
    expect(grid.children).toHaveLength(3);

    const promptCards = screen.getAllByTestId("prompt-card");
    expect(promptCards).toHaveLength(3);
  });
});

describe("PromptsGrid with editable", () => {
  it("passes editable true to PromptCard enable edit button", () => {
    renderWithProviders(<PromptsGrid prompts={mockPrompts} editable={true} />);
    screen.debug()
    const editButtons = screen.getAllByTestId("edit-button");
    expect(editButtons).toHaveLength(mockPrompts.length);
  });
});
