from bson.objectid import ObjectId

prompt_create_mocks = [
  {
    "title": "Integration test",
    "prompt": "Write a poem",
    "result_example": "A small poem",
    "model": "gpt-5",
    "tags": ["ai", "poem"]
  },
  {
    "title": "Write a perfect essay",
    "prompt": "Write a essay...",
    "result_example": "A prefect essay...",
    "model": "gpt-5",
    "tags": ["ai", "poem"]
  },
  {
    "title": "Integration test",
    "prompt": "Write a poem",
    "result_example": "A small poem",
    "model": "Claude",
    "tags": ["ai", "poem"]
  }
]

mock_prompts = [{
  "_id": ObjectId("69398c1d5393462cecf974b8"),
  "title": "Generate a marketing headline",
  "prompt": "Write a catchy marketing headline for a SaaS that helps users automate workflows.",
  "result_example": "Automate Everything: The Smartest Way to Scale Your Productivity.",
  "model": "gpt-4",
  "tags": [
    "marketing",
    "copywriting",
    "saas"
  ],
  "user_id": ObjectId("6939872c7f7a423bcb83fe0b"),
  "pub_date": "2024-01-15T10:30:00.000Z"
},
{
  "_id": ObjectId("69398c1d5393462cecf974b9"),
  "title": "Refactor JavaScript Code",
  "prompt": "Refactor the following JavaScript snippet for readability and performance: {{code}}",
  "result_example": "I've simplified the conditional logic and removed unnecessary variables.",
  "model": "gpt-4o",
  "tags": [
    "javascript",
    "refactor",
    "programming"
  ],
  "user_id": ObjectId("6939872c7f7a423bcb83fe0b"),
  "pub_date": "2024-02-02T16:45:00.000Z"
},
{
  "_id": ObjectId("69398c1d5393462cecf974ba"),
  "title": "Character backstory generator",
  "prompt": "Create a fantasy-style backstory for a character named Arin who is a rogue alchemist.",
  "result_example": "Arin grew up scavenging ingredients from abandoned ruins...",
  "model": "gpt-3.5",
  "tags": [
    "storytelling",
    "writing",
    "fantasy"
  ],
  "user_id": ObjectId("6939872c7f7a423bcb83fe0b"),
  "pub_date": "2024-02-10T08:12:00.000Z"
},
{
  "_id": ObjectId("69398c1d5393462cecf974bb"),
  "title": "Create a blog intro",
  "prompt": "Write an engaging introduction for a blog post about AI productivity tools.",
  "result_example": "AI is transforming productivity workflows faster than ever...",
  "model": "gpt-4",
  "tags": [
    "writing",
    "blog",
    "ai"
  ],
  "user_id": ObjectId("6939872c7f7a423bcb83fe0b"),
  "pub_date": "2024-01-15T10:30:00.000Z"
},
{
  "_id": ObjectId("69398c1d5393462cecf974bc"),
  "title": "Generate product description",
  "prompt": "Write a short product description for a smart lamp that adapts to ambient light.",
  "result_example": "A smart lamp that adjusts brightness automatically...",
  "model": "gpt-4",
  "tags": [
    "marketing",
    "copywriting"
  ],
  "user_id": ObjectId("693987497f7a423bcb83fe0c"),
  "pub_date": "2024-01-20T11:10:00.000Z"
},
{
  "_id": ObjectId("69398c1d5393462cecf974bd"),
  "title": "Explain JavaScript closures",
  "prompt": "Explain JavaScript closures in a simple and friendly way.",
  "result_example": "A closure is created when a function remembers its lexical scope...",
  "model": "gpt-4o",
  "tags": [
    "javascript",
    "education",
    "programming"
  ],
  "user_id": ObjectId("693987497f7a423bcb83fe0c"),
  "pub_date": "2024-02-01T09:32:00.000Z"
},
{
  "_id": ObjectId("69398c1d5393462cecf974be"),
  "title": "Fantasy world generator",
  "prompt": "Generate a fantasy world description with geography and culture.",
  "result_example": "Elaria is a land shaped by ancient magic...",
  "model": "gpt-3.5",
  "tags": [
    "fantasy",
    "worldbuilding"
  ],
  "user_id": ObjectId("693987497f7a423bcb83fe0c"),
  "pub_date": "2024-02-02T13:10:00.000Z"
},
{
  "_id": ObjectId("69398c1d5393462cecf974bf"),
  "title": "SQL Query Optimization",
  "prompt": "Optimize the following SQL query for performance: {{query}}",
  "result_example": "I removed redundant subqueries and added indexes...",
  "model": "gpt-4o",
  "tags": [
    "sql",
    "backend"
  ],
  "user_id": ObjectId("693987497f7a423bcb83fe0c"),
  "pub_date": "2024-02-10T08:12:00.000Z"
},
{
  "_id": ObjectId("69398c1d5393462cecf974c0"),
  "title": "Character dialogue",
  "prompt": "Write a humorous dialogue between a robot and a medieval knight.",
  "result_example": "Knight: What sorcery powers you? Robot: Lithium-ion, good sir.",
  "model": "gpt-4",
  "tags": [
    "dialogue",
    "creative"
  ],
  "user_id": ObjectId("6939875e7f7a423bcb83fe0d"),
  "pub_date": "2024-02-10T12:20:00.000Z"
},
{
  "_id": ObjectId("69398c1d5393462cecf974c1"),
  "id": "p-007",
  "title": "Improve UI microcopy",
  "prompt": "Rewrite this button text to be more user-friendly: {{text}}",
  "result_example": "Instead of 'Submit', try 'Save changes'.",
  "model": "gpt-4",
  "tags": [
    "ux",
    "copywriting"
  ],
  "user_id": ObjectId("6939875e7f7a423bcb83fe0d"),
  "pub_date": "2024-02-11T14:44:00.000Z"
},
{
  "_id": ObjectId("69398c1d5393462cecf974c2"),
  "title": "Python function explanation",
  "prompt": "Explain what this Python function does: {{code}}",
  "result_example": "This function iterates through the list...",
  "model": "gpt-4o",
  "tags": [
    "python",
    "education"
  ],
  "user_id": ObjectId("6939875e7f7a423bcb83fe0d"),
  "pub_date": "2024-02-13T18:00:00.000Z"
},
{
  "_id": ObjectId("69398c1d5393462cecf974c3"),
  "title": "Short horror story",
  "prompt": "Write a 3-paragraph horror story about a cabin in the woods.",
  "result_example": "The cabin door creaked open on its own...",
  "model": "gpt-4",
  "tags": [
    "storytelling",
    "horror"
  ],
  "user_id": ObjectId("6939875e7f7a423bcb83fe0d"),
  "pub_date": "2024-02-15T19:10:00.000Z"
},
{
  "_id": ObjectId("69398c1d5393462cecf974c4"),
  "title": "Interview questions generator",
  "prompt": "Generate 10 interview questions for a senior React developer.",
  "result_example": "1. Can you explain concurrent rendering?",
  "model": "gpt-4",
  "tags": [
    "react",
    "interview"
  ],
  "user_id": ObjectId("6939875e7f7a423bcb83fe0d"),
  "pub_date": "2024-02-16T08:50:00.000Z"
},
{
  "_id": ObjectId("69398c1d5393462cecf974c5"),
  "title": "Email subject lines",
  "prompt": "Generate 5 catchy subject lines for a newsletter about mindfulness.",
  "result_example": "Slow Down to Speed Up: Your Weekly Reset",
  "model": "gpt-3.5",
  "tags": [
    "email",
    "marketing",
    "mindfulness"
  ],
  "user_id": ObjectId("6939876c7f7a423bcb83fe0e"),
  "pub_date": "2024-02-17T11:32:00.000Z"
},
{
  "_id": ObjectId("69398c1d5393462cecf974c6"),
  "title": "Game idea generator",
  "prompt": "Generate a unique concept for an indie 2D platformer.",
  "result_example": "You control time by drawing runes...",
  "model": "gpt-4",
  "tags": [
    "game-dev",
    "ideas"
  ],
  "user_id": ObjectId("6939876c7f7a423bcb83fe0e"),
  "pub_date": "2024-02-20T15:23:00.000Z"
},
{
  "_id": ObjectId("69398c1d5393462cecf974c7"),
  "title": "Rewrite text professionally",
  "prompt": "Rewrite the following message using a formal tone: {{text}}",
  "result_example": "Please let me know if you require further assistance.",
  "model": "gpt-4o",
  "tags": [
    "writing",
    "tone"
  ],
  "user_id": ObjectId("6939876c7f7a423bcb83fe0e"),
  "pub_date": "2024-02-21T17:40:00.000Z"
},
{
  "_id": ObjectId("69398c1d5393462cecf974c8"),
  "title": "Code documentation generator",
  "prompt": "Document the following function in JSDoc format: {{code}}",
  "result_example": "/** Calculates total price... */",
  "model": "gpt-4o",
  "tags": [
    "documentation",
    "jsdoc"
  ],
  "user_id": ObjectId("6939876c7f7a423bcb83fe0e"),
  "pub_date": "2024-02-22T09:12:00.000Z"
},
{
  "_id": ObjectId("69398c1d5393462cecf974c9"),
  "title": "TikTok script idea",
  "prompt": "Write a short funny TikTok script about studying with AI.",
  "result_example": "AI: 'I analyzed your habits... you need coffee.'",
  "model": "gpt-3.5",
  "tags": [
    "tiktok",
    "script"
  ],
  "user_id": ObjectId("6939876c7f7a423bcb83fe0e"),
  "pub_date": "2024-02-23T12:05:00.000Z"
}]
