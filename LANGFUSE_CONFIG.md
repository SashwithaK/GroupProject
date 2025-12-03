# Langfuse Tracing Configuration

## ✅ Final Configuration

The Langfuse integration has been configured to match the standard "chat completion" format for optimal visibility in the dashboard.

### Trace Format

| Field | Value | Description |
|-------|-------|-------------|
| **Name** | `chat-completion-trace` | Standardized name matching typical chat completion traces |
| **Input** | `[SystemMessage | text = "..."]` | Formatted string mimicking LangChain style for table visibility |
| **Output** | `{"fields": [...]}` | JSON string of extracted data |
| **Usage** | Token Counts | Estimated input/output token usage |
| **Metadata** | `image_path`, `model` | Additional context stored separately |

### Dashboard View

When viewing traces at http://localhost:3001, you will now see:

1. **Name Column**: Shows "chat-completion-trace"
2. **Usage Column**: Shows token counts (e.g., `1.2k -> 200 (1.4k)`)
3. **Input Column**: Shows `[SystemMessage | text = "..."]`
4. **Output Column**: Shows the extracted JSON string

### ⚠️ Important: Column Visibility

If you don't see the **Input** or **Output** columns in the table:
1. Click the **"Columns"** button in the top-right of the table
2. Check the boxes for **"Input"** and **"Output"**
3. They will appear in the table view

### Technical Details

- **Trace Creation**: Uses `trace_name="chat-completion-trace"`
- **Input Handling**: Formats input as a string `[SystemMessage | text = "..."]` for the Trace (Table View)
- **Output Handling**: Passes the result as a JSON string for the Trace (Table View)
- **Generation Handling**: Keeps rich objects (list of messages) for the Detail View
- **Usage Tracking**: Estimates token usage based on text length (1 word ≈ 1.3 tokens) and sends to Langfuse

This configuration ensures that the Langfuse UI displays the information in a format consistent with standard chat completion traces, matching the reference screenshot.
