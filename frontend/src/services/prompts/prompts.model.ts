export type Prompt = {
  id: string;
  title: string;
  prompt: string;
  resultExample: string;
  model: string;
  tags: string[];
  pubDate: Date;
  author: {
    id: string;
    username: string;
    email: string;
  };
};

export type PromptSummary = {
  id: string;
  title: string;
  tags: string[];
  model: string;
  pubDate: Date;
  authorId: string;
  authorName: string;
};

export type PromptCreate = {
  title: string;
  prompt: string;
  resultExample: string;
  model: string;
  tags: string[];
}

export type PromptCreateResponse = {
  message: string;
  id: string;
}

export type PromptUpdate = Partial<PromptCreate>;

export type PromptComment = {
  id: string;
  content: string;
  promptId: string;
  author: string;
  pubDate: Date;
}

export type PromptCommentCreate = {
  content: string;
}
