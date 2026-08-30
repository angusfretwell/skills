# Writing Style

## Sentences

- Short, declarative, one idea per sentence. Avoid hedges ("might", "could possibly").
- Lead with the point. Pair a claim or instruction with its reason when the reason isn't obvious.
- Prefer active voice; name the actor ("run the migration", not "the migration was run").
- Write instructions as imperatives ("Run the migration"), not "the user should run the migration".

## Plain language

- Drop filler jargon: "use", not "leverage" or "utilize"; "set up", not "facilitate".
- Spell out a non-obvious term once, then use it consistently. Match the project's existing vocabulary rather than inventing synonyms.
- Treat domain nouns as common nouns in running text: lowercase "invoice", "workspace", "admin" mid-sentence; capitalise only genuine proper nouns (product names, a person's name). Titles, labels, and headers follow [Interface copy](#interface-copy).
- "set up" is the verb (two words); "setup" is the noun. Write "Set up a passkey", not "Setup a passkey".
- "sign-in" is the noun and adjective ("sign-in link", "sign-in page"); "sign in" is the verb ("Sign in to your account").

## Punctuation and formatting

- Avoid em-dashes. Use a period, semicolon, parenthesis, or comma.
- Use the Oxford comma ("north, south, east, and west"). It prevents list ambiguity.
- Avoid lists using the `- **Bold** — description` format. Consider using subheadings or tables instead to improve readability.
- Title case for top-level headings, sentence case for other headings.
- Backticks for code, paths, commands, and identifiers; not for emphasis.
- Spell out zero to nine; use numerals for 10 and up. Always numerals for versions, ports, and sizes ("Node 18", "port 3000").

## Interface copy

Case interface text by where it sits, not by what it says. Title case capitalises the principal words ("Edit Profile"); sentence case capitalises only the first word and any proper nouns ("Date of birth"). Proper nouns stay capitalised in both.

| Element                          | Case          | Example         |
| -------------------------------- | ------------- | --------------- |
| Page headings                    | Title case    | Edit Project    |
| Dialog and sheet titles          | Title case    | Edit Profile    |
| Card titles                      | Sentence case | Billing details |
| Subheadings                      | Sentence case | Payment method  |
| Fieldset legends                 | Sentence case | Postal address  |
| Field labels                     | Sentence case | First name      |
| Button labels                    | Title case    | Save Changes    |
| Dropdown menu labels and items   | Title case    | Change Status   |
| Select placeholders (`Select …`) | Title case    | Select Role     |
| Table headers                    | Title case    | Due Date        |
| Attribute labels                 | Sentence case | Date of birth   |

Dialog titles read as a short title-case action, not a question: "Approve Request", not "Approve this request?". A confirmation acting on a specific named record may name it instead: "Delete Acme Corp".

The placeholder rule covers the "Select …" prompts ("Select Role"). Free-text input placeholders that are example values or full sentences keep their natural case ("user@example.com", "Why is this request being rejected?").
