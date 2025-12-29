export const promptSummaryMocks = [
  {
    id: "abc-123",
    title: "Generate a marketing headline",
    model: "gpt-4",
    tags: ["marketing", "copywriting", "saas"],
    author_id: "123-abc",
    author_name: "johndoe",
    pub_date: "2024-01-15T10:30:00Z",
  },
  {
    id: "def-456",
    title: "Refactor JavaScript Code",
    model: "gpt-4o",
    tags: ["javascript", "refactor", "programming"],
    author_id: "123-abc",
    author_name: "johndoe",
    pub_date: "2024-02-02T16:45:00Z",
  },
  {
    id: "ghi-789",
    title: "Character backstory generator",
    model: "gpt-3.5",
    tags: ["storytelling", "writing", "fantasy"],
    author_id: "123-abc",
    author_name: "johndoe",
    pub_date: "2024-02-10T08:12:00Z",
  },
];

export const promptMocks = [
  {
    id: "abc-123",
    title: "Generate a marketing headline",
    prompt:
      "Write a catchy marketing headline for a SaaS that helps users automate workflows.",
    result_example:
      "Automate Everything: The Smartest Way to Scale Your Productivity.",
    model: "gpt-4",
    tags: ["marketing", "copywriting", "saas"],
    pub_date: "2024-01-15T10:30:00Z",
    author: {
      id: "123-abc",
      username: "johndoe",
      email: "johndoe@example.com",
    },
  },
  {
    id: "def-456",
    title: "Refactor JavaScript Code",
    prompt:
      "Refactor the following JavaScript snippet for readability and performance: {{code}}",
    result_example:
      "I've simplified the conditional logic and removed unnecessary variables.",
    model: "gpt-4o",
    tags: ["javascript", "refactor", "programming"],
    pub_date: "2024-02-02T16:45:00Z",
    author: {
      id: "123-abc",
      username: "johndoe",
      email: "johndoe@example.com",
    },
  },
  {
    id: "ghi-789",
    title: "Character backstory generator",
    prompt:
      "Create a fantasy-style backstory for a character named Arin who is a rogue alchemist.",
    result_example:
      "Arin grew up scavenging ingredients from abandoned ruins...",
    model: "gpt-3.5",
    tags: ["storytelling", "writing", "fantasy"],
    pub_date: "2024-02-10T08:12:00Z",
    author: {
      id: "123-abc",
      username: "johndoe",
      email: "johndoe@example.com",
    },
  },
];

export const users = [
  {
    id: "123-abc",
    username: "johndoe",
    email: "johndoe@example.com",
    password: "securepassword",
    is_active: true,
  },
  {
    id: "456-def",
    username: "alex",
    email: "alex@example.com",
    password: "securepassword",
    is_active: true,
  },
];

export const comments = [
  {
    id: "123-abc",
    prompt_id: "abc-123",
    content: "It's very helpfull",
    author: "alex",
    pub_date: "2024-02-10T08:12:00Z",
  },
  {
    id: "456-def",
    prompt_id: "abc-123",
    content: "It's amazing",
    author: "matt",
    pub_date: "2024-02-10T08:12:00Z",
  },
  {
    id: "789-ghi",
    prompt_id: "abc-123",
    content: "Thank you for share",
    author: "jane",
    pub_date: "2024-02-10T08:12:00Z",
  },
];
