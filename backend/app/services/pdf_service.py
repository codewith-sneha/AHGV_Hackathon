import fitz  # PyMuPDF

def chunk_text(text: str, words_per_chunk: int = 100, overlap: int = 20):
    """Splits a large string into smaller overlapping word chunks."""
    words = text.split()
    if not words:
        return []
    
    chunks = []
    for i in range(0, len(words), words_per_chunk - overlap):
        chunk = " ".join(words[i:i + words_per_chunk])
        chunks.append(chunk)
    return chunks

def extract_pdf_chunks(pdf_file_path: str, approx_total_video_duration_sec: float = 600.0):
    """Extracts text page-by-page and splits it into precise sub-chunks."""
    doc = fitz.open(pdf_file_path)
    total_pages = len(doc)
    chunks = []

    if total_pages == 0:
        return chunks

    time_per_page = approx_total_video_duration_sec / total_pages

    for page_idx in range(total_pages):
        page = doc[page_idx]
        raw_text = page.get_text("text").strip()
        
        if not raw_text:
            continue

        # Clean formatting
        clean_text = " ".join(raw_text.split())
        
        # Break the single page into 100-word overlapping chunks
        sub_chunks = chunk_text(clean_text, words_per_chunk=100, overlap=20)
        
        start_sec = round(page_idx * time_per_page, 2)
        end_sec = round((page_idx + 1) * time_per_page, 2)
        page_num = page_idx + 1

        for i, chunk_str in enumerate(sub_chunks):
            chunks.append({
                "text": f"[Slide/Page {page_num}]: {chunk_str}",
                "source_type": "pdf",
                "page_num": page_num,
                "chunk_index": i + 1,  # Useful for UI sorting if needed
                "start_sec": start_sec,
                "end_sec": end_sec
            })
            
    doc.close()
    return chunks