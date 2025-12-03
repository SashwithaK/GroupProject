# How to View Detailed Input/Output Tables in Langfuse

You have two ways to view your data in Langfuse: the **Table View** (for quick scanning) and the **Detail View** (for deep inspection).

## 1. The Table View (What you see first)
When you are on the main Traces page, you see the summary.
- **Input**: Shows a text summary (e.g., `[SystemMessage...]`)
- **Output**: Shows a text summary (e.g., `{"fields": ...}`)

## 2. The Detail View (Going Inside)
To see the rich, formatted tables:

1. **Click on any row** in the traces table. This opens the **Trace Detail Page**.
2. Scroll down to the **"Timeline"** or **"Observations"** section.
3. You will see a span named **`chat-completion`**.
4. **Click on `chat-completion`**.

### 🌟 What you will see inside `chat-completion`:

#### The Input Table
Langfuse will render the input as a structured chat conversation:
- **System**: Shows your full extraction prompt.
- **User**: Shows the user message ("Extract data...") and the image reference.

#### The Output Table
Langfuse will render the output as a formatted JSON object:
- You can expand/collapse the JSON.
- You can copy individual fields.
- It clearly shows the `fields` list with all extracted data (Name, Date, etc.).

## Summary
- **Trace Level** (Top of page): Optimized for readability (Strings).
- **Generation Level** (Inside `chat-completion`): Optimized for structure (Rich Tables/JSON).
