"""
LangChain integration module for handwritten form extraction.
Provides structured LLM interactions with HuggingFace models and LangFuse tracing.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
import os
import base64
import json
import requests
from PIL import Image
from io import BytesIO

try:
    from langfuse import Langfuse
    LANGFUSE_AVAILABLE = True
except ImportError:
    LANGFUSE_AVAILABLE = False
    print("⚠ LangFuse not available. Install with: pip install langfuse")


# Pydantic models for structured output
class FormField(BaseModel):
    """Represents a single field extracted from a form."""
    label: str = Field(description="Descriptive field name based on what is visible in the form")
    value: str = Field(description="The actual handwritten text extracted from the field")


class ExtractedFormData(BaseModel):
    """Container for all extracted form fields."""
    fields: List[FormField] = Field(description="List of all fields extracted from the form")


# Extraction prompt
EXTRACTION_PROMPT = """You are an AI expert at reading and extracting information from handwritten forms and documents.

TASK:
Carefully analyze this handwritten form image. Identify all visible fields, labels, and their corresponding handwritten values. Create field names based on what you see in the form.

INSTRUCTIONS:
1. Look for any printed or handwritten labels (like "Name:", "Date:", "Address:", etc.)
2. Extract the handwritten values next to each label
3. If you see fields without clear labels, create appropriate descriptive labels based on the content
4. Include ALL text you can read from the image
5. If text is unclear or illegible, mark the value as "unreadable"

OUTPUT FORMAT (STRICT JSON ONLY):
{
  "fields": [
    {
       "label": "descriptive field name based on what you see",
       "value": "the actual handwritten text you read"
    }
  ]
}

CRITICAL RULES:
- Return ONLY valid JSON, no explanations or additional text
- Create labels dynamically based on what's actually in the image
- Do not assume or invent fields that aren't visible
- Extract exactly what you see, maintain original spelling and formatting
- Be thorough - include all visible text fields"""


class LangChainFormExtractor:
    """
    Handles form extraction using HuggingFace API with LangFuse tracing.
    """
    
    def __init__(self, hf_token: Optional[str] = None, langfuse_enabled: bool = True):
        """
        Initialize the form extractor.
        
        Args:
            hf_token: HuggingFace API token. If None, will try to get from environment.
            langfuse_enabled: Whether to enable LangFuse tracing.
        """
        self.hf_token = hf_token or self._get_hf_token()
        self.langfuse_enabled = langfuse_enabled and LANGFUSE_AVAILABLE
        self.langfuse_client = None
        
        if self.langfuse_enabled:
            self._setup_langfuse()
    
    def _get_hf_token(self) -> str:
        """Get HuggingFace token from environment."""
        token = (
            os.environ.get("HUGGINGFACE_API_KEY") or 
            os.environ.get("HF_TOKEN") or 
            os.environ.get("HUGGING_FACE_API_KEY")
        )
        
        if not token:
            raise ValueError(
                "HUGGINGFACE_API_KEY not found. "
                "Please configure your API key in .env or environment variable."
            )
        
        # Strip whitespace and newline characters that may cause header errors
        return token.strip()
    
    def _setup_langfuse(self):
        """Setup LangFuse client for tracing."""
        try:
            public_key = os.environ.get("LANGFUSE_PUBLIC_KEY")
            secret_key = os.environ.get("LANGFUSE_SECRET_KEY")
            host = os.environ.get("LANGFUSE_HOST", "https://cloud.langfuse.com")
            
            if public_key and secret_key:
                self.langfuse_client = Langfuse(
                    public_key=public_key,
                    secret_key=secret_key,
                    host=host
                )
                print("✓ LangFuse tracing enabled")
            else:
                print("⚠ LangFuse keys not found. Tracing disabled.")
                self.langfuse_enabled = False
                self.langfuse_client = None
        except Exception as e:
            print(f"⚠ Failed to initialize LangFuse: {e}")
            self.langfuse_enabled = False
            self.langfuse_client = None
    
    def _image_to_base64(self, image_path: str) -> str:
        """Convert image to base64 string."""
        with Image.open(image_path) as img:
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            buffered = BytesIO()
            img.save(buffered, format="JPEG", quality=95)
            img_bytes = buffered.getvalue()
            img_base64 = base64.b64encode(img_bytes).decode()
        
        return f"data:image/jpeg;base64,{img_base64}"
    
    def _call_huggingface_api(self, image_base64: str) -> Dict[str, Any]:
        """Call HuggingFace API for vision-language model."""
        headers = {
            "Authorization": f"Bearer {self.hf_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "Qwen/Qwen2.5-VL-7B-Instruct",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": EXTRACTION_PROMPT
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": image_base64
                            }
                        }
                    ]
                }
            ],
            "max_tokens": 1000,
            "temperature": 0.1
        }
        
        api_url = "https://router.huggingface.co/v1/chat/completions"
        response = requests.post(api_url, headers=headers, json=payload, timeout=120)
        
        if response.status_code == 503:
            return {
                "fields": [
                    {"label": "Model Status", "value": "Model is loading, please try again in 20-30 seconds"},
                    {"label": "Status Code", "value": "503"}
                ]
            }
        
        if response.status_code != 200:
            error_msg = response.text if response.text else f"HTTP {response.status_code}"
            return {
                "fields": [
                    {"label": "API Error", "value": f"Hugging Face API returned an error"},
                    {"label": "Details", "value": error_msg[:200]},
                    {"label": "Status Code", "value": str(response.status_code)}
                ]
            }
        
        result = response.json()
        
        # Parse the response
        if isinstance(result, dict) and "choices" in result:
            content = result["choices"][0]["message"]["content"]
            if isinstance(content, list):
                generated_text = " ".join([
                    item.get("text", "") if isinstance(item, dict) else str(item)
                    for item in content
                ])
            else:
                generated_text = content
        elif isinstance(result, list) and len(result) > 0:
            generated_text = result[0].get("generated_text", "")
        elif isinstance(result, dict):
            generated_text = result.get("generated_text", str(result))
        else:
            generated_text = str(result)
        
        # Extract JSON from response
        try:
            start_idx = generated_text.find('{')
            end_idx = generated_text.rfind('}') + 1
            
            if start_idx != -1 and end_idx > start_idx:
                json_str = generated_text[start_idx:end_idx]
                extracted_data = json.loads(json_str)
                
                if "fields" in extracted_data and isinstance(extracted_data["fields"], list):
                    return extracted_data
                else:
                    return {"fields": [{"label": "Parsing Error", "value": "JSON structure is invalid"}]}
            else:
                return {
                    "fields": [
                        {"label": "Raw AI Response", "value": generated_text[:500]},
                        {"label": "Note", "value": "AI did not return valid JSON. Showing raw response."}
                    ]
                }
        
        except json.JSONDecodeError as e:
            return {
                "fields": [
                    {"label": "JSON Parse Error", "value": str(e)},
                    {"label": "Raw Response", "value": generated_text[:300]}
                ]
            }
    
    def extract_from_image(
        self, 
        image_path: str,
        trace_name: Optional[str] = None,
        trace_metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Extract form fields from an image using HuggingFace API.
        
        Args:
            image_path: Path to the image file
            trace_name: Optional name for the LangFuse trace
            trace_metadata: Optional metadata to attach to the trace
        
        Returns:
            Dictionary containing extracted fields in the format:
            {"fields": [{"label": "...", "value": "..."}, ...]}
        """
        try:
            # Convert image to base64
            image_data = self._image_to_base64(image_path)
            
            # Create LangFuse trace if enabled
            trace = None
            generation = None
            if self.langfuse_enabled and self.langfuse_client:
                try:
                    # Create trace with descriptive name for UI display
                    trace_display_name = trace_name or "chat-completion-trace"
                    
                    # Format input as a list of messages for the Generation (Rich View)
                    chat_input_objs = [
                        {"role": "system", "content": EXTRACTION_PROMPT},
                        {"role": "user", "content": [
                            {"type": "text", "text": "Extract data from this handwritten form."},
                            {"type": "image_url", "image_url": {"url": "..."}} # Truncated for display
                        ]}
                    ]
                    
                    # Format input as a STRING for the Trace (Table View) to ensure visibility
                    # Mimic the style seen in the screenshot: [SystemMessage | text = "..."]
                    trace_input_str = f'[SystemMessage | text = "{EXTRACTION_PROMPT[:50]}..."]\n[UserMessage | text = "Extract data..."]'

                    # Create trace
                    trace = self.langfuse_client.trace(
                        name=trace_display_name,
                        metadata={
                            **(trace_metadata or {}),
                            "image_path": image_path,
                            "model": "Qwen/Qwen2.5-VL-7B-Instruct",
                            "task_type": "handwritten_form_extraction"
                        },
                        input=trace_input_str, # Send STRING to Trace for Table View
                        user_id=trace_metadata.get("task_id") if trace_metadata else None
                    )
                    
                    # Create generation span for the API call
                    generation = trace.generation(
                        name="chat-completion",
                        model="Qwen/Qwen2.5-VL-7B-Instruct",
                        model_parameters={
                            "temperature": 0.1,
                            "max_tokens": 1000
                        },
                        input=chat_input_objs, # Send OBJECTS to Generation for Detail View
                        metadata={
                            "image_path": image_path,
                            "format": "base64_jpeg"
                        }
                    )
                    print(f"✓ LangFuse trace created: {trace.id}")
                except Exception as e:
                    print(f"⚠ LangFuse trace creation failed: {e}")
            
            # Call HuggingFace API
            result = self._call_huggingface_api(image_data)
            
            # Update trace and generation if created
            if trace and generation:
                try:
                    # Estimate token usage
                    input_text = str(chat_input_objs)
                    output_text = str(result)
                    input_tokens = int(len(input_text.split()) * 1.3)
                    output_tokens = int(len(output_text.split()) * 1.3)
                    
                    # Update generation with output and usage stats
                    generation.end(
                        output=result, # Keep object for generation
                        usage={
                            "input": input_tokens,
                            "output": output_tokens,
                            "total": input_tokens + output_tokens,
                            "unit": "TOKENS"
                        }
                    )
                    
                    # Update trace with final output as JSON STRING for Table View
                    import json
                    trace.update(output=json.dumps(result))
                    
                    # Flush to ensure data is sent
                    self.langfuse_client.flush()
                    print(f"✓ LangFuse trace updated and flushed")
                except Exception as e:
                    print(f"⚠ LangFuse trace update failed: {e}")
            
            return result
        
        except Exception as e:
            error_result = {
                "fields": [
                    {"label": "Extraction Error", "value": str(e)},
                    {"label": "Error Type", "value": type(e).__name__}
                ]
            }
            
            # Log error to trace if available
            if trace:
                try:
                    trace.update(
                        output=error_result,
                        level="ERROR"
                    )
                    self.langfuse_client.flush()
                except:
                    pass
            
            return error_result

    
    def extract_from_pdf_pages(
        self,
        page_images: List[str],
        trace_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Extract form fields from multiple PDF pages.
        
        Args:
            page_images: List of paths to page image files
            trace_name: Optional base name for LangFuse traces
        
        Returns:
            Dictionary containing all extracted fields from all pages
        """
        all_fields = []
        
        for page_num, image_path in enumerate(page_images, start=1):
            page_trace_name = f"{trace_name}_page_{page_num}" if trace_name else None
            page_metadata = {"page_number": page_num, "total_pages": len(page_images)}
            
            page_data = self.extract_from_image(
                image_path,
                trace_name=page_trace_name,
                trace_metadata=page_metadata
            )
            
            if "fields" in page_data:
                for field in page_data["fields"]:
                    field["label"] = f"Page {page_num} - {field['label']}"
                    all_fields.append(field)
        
        return {
            "fields": all_fields if all_fields else [
                {"label": "No Data", "value": "No text extracted from PDF"}
            ]
        }


# Global extractor instance (initialized on first use)
_extractor_instance: Optional[LangChainFormExtractor] = None


def get_extractor() -> LangChainFormExtractor:
    """Get or create the global extractor instance."""
    global _extractor_instance
    
    if _extractor_instance is None:
        _extractor_instance = LangChainFormExtractor()
    
    return _extractor_instance
