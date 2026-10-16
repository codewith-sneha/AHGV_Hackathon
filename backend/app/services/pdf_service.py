import fitz  # PyMuPDF

def extract_pdf_chunks(pdf_file_path: str, approx_total_video_duration_sec: float = 600.0):
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

        lines = [line.strip() for line in raw_text.split("\n") if line.strip()]
        total_lines = len(lines)
        clean_text = " ".join(lines)
        
        start_sec = round(page_idx * time_per_page, 2)
        end_sec = round((page_idx + 1) * time_per_page, 2)
        page_num = page_idx + 1

        chunks.append({
            "text": f"[Slide/Page {page_num}]: {clean_text}",
            "lecture_id": "L01",
            "source_type": "pdf_notes",
            "page_num": page_num,
            "line_start": 1,
            "line_end": total_lines,
            "start_sec": start_sec,
            "end_sec": end_sec
        })
            
    doc.close()
    return chunks