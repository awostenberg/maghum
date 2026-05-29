#!/usr/bin/env python3
"""
Extract numbered paragraphs from the official Vatican HTML of
Magnifica Humanitas and produce data/paragraphs.json

Usage:
    python3 scripts/extract_paragraphs.py
"""

import re
import json
from html.parser import HTMLParser
from pathlib import Path

INPUT_HTML = Path("/tmp/magnifica-humanitas.html")
OUTPUT_JSON = Path("data/paragraphs.json")

# Known major sections (in order they appear)
MAJOR_SECTIONS = [
    "INTRODUCTION",
    "CHAPTER ONE",
    "CHAPTER TWO",
    "CHAPTER THREE",
    "CHAPTER FOUR",
    "CHAPTER FIVE",
    "CONCLUSION",
]

# Common subsection titles we want to capture (add more as needed after inspection)
SUBSECTION_PATTERNS = [
    r"The res novae of our time",
    r"Two biblical images",
    r"Building for the common good",
    r"Remaining human",
    r"A Church journeying through human history",
    r"The wisdom of the word of God in dialogue with the human sciences",
    r"Social Doctrine as a shared discernment",
    r"The development of Social Doctrine from Leo XIII to the present",
    r"The first stages of the Church’s Social Doctrine",
    r"The years of the Second Vatican Council",
    r"The recent Magisterium",
    r"Interpreting history in the light of faith",
    r"The foundations of Social Doctrine",
    r"The human person: image of the Triune God",
    r"The equal dignity of all human beings",
    r"The supreme value of human rights",
    r"The principles of Social Doctrine",
    r"The principle of the common good",
    r"The principle of the universal destination of goods",
    r"The principle of subsidiarity",
    r"The principle of solidarity",
    r"The principle of social justice",
    r"Integral human development",
    r"An examen for the Church",
    r"The technocratic paradigm and digital power",
    r"Artificial intelligence",
    r"A valuable tool that requires vigilance",
    r"Responsibility, transparency and the governance of AI",
    r"What must not be lost",
    r"Underlying narratives: transhumanism and posthumanism",
    r"The limit, the heart, the grandeur of the human person",
    r"The authentic “more than human”: grace and Christian humanism",
    r"Two cities and two loves",
    r"Truth as a common good",
    r"Truth and democracy",
    r"Communication and the collective imagination",
    r"Toward an ecology of communication",
    r"An educational alliance for the digital age",
    r"The central role of schools",
    r"The dignity of work at a time of digital transition",
    r"The value of work",
    r"The problem of unemployment",
    r"An economy that values dignity",
    r"Families and young people: the social conditions for hope",
    r"Protecting freedom against dependencies and commercialization",
    r"Dependencies and societal control",
    r"Breaking the chains of new forms of slavery",
    r"A shared responsibility",
    r"The civilization of love in the digital age",
    r"The culture of power",
    r"The normalization of war",
    r"Force without limits",
    r"Weapons and artificial intelligence",
    r"The crisis of multilateralism",
    r"A supposed political realism",
    r"Building the civilization of love",
    r"We can all do our part",
    r"The need to disarm words",
    r"Building peace through justice",
    r"Adopting the perspective of victims",
    r"Cultivating a healthy realism",
    r"Reviving dialogue",
    r"The necessity of diplomacy and multilateralism",
    r"Praying and hoping",
    r"The Word became flesh",
    r"One body in Christ",
    r"The construction site of our time",
    r"The song of hope: the Magnificat",
]

def clean_text(raw: str) -> str:
    """Remove HTML tags, footnote markers, and normalize whitespace."""
    # Remove footnote reference links like [1], [2], etc.
    text = re.sub(r'\[\d+\]', '', raw)
    # Remove any remaining HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    # Fix common smart quote issues if present
    text = text.replace('“', '"').replace('”', '"').replace('‘', "'").replace('’', "'")
    return text


class ParagraphExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.current_section = "Introduction"
        self.current_subsection = None
        self.paragraphs = []
        self.in_paragraph = False
        self.buffer = []
        self.last_was_header = False

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        cls = attrs_dict.get("class", "")

        if tag == "p" and "MsoNormal" in cls:
            self.in_paragraph = True
            self.buffer = []

        # Detect centered bold headers (major sections)
        style = attrs_dict.get("style", "")
        if tag == "p" and "center" in style.lower():
            self.last_was_header = True

    def handle_endtag(self, tag):
        if tag == "p" and self.in_paragraph:
            raw = "".join(self.buffer)
            self.process_paragraph_block(raw)
            self.in_paragraph = False
            self.buffer = []

    def handle_data(self, data):
        if self.in_paragraph:
            self.buffer.append(data)

    def process_paragraph_block(self, raw: str):
        text = raw.strip()
        if not text:
            return

        # Detect major section headers
        upper = text.upper().strip()
        for sec in MAJOR_SECTIONS:
            if sec in upper and len(text) < 40:
                self.current_section = sec.title() if sec != "INTRODUCTION" else "Introduction"
                self.current_subsection = None
                return

        # Detect subsection headers (bold or short distinctive phrases)
        clean = clean_text(text)
        for pattern in SUBSECTION_PATTERNS:
            if re.search(pattern, clean, re.IGNORECASE) and len(clean) < 120:
                self.current_subsection = pattern
                return

        # Match numbered paragraphs: "1. ", "2. ", etc.
        match = re.match(r'^(\d+)\.\s+(.+)$', clean, re.DOTALL)
        if match:
            num = int(match.group(1))
            para_text = match.group(2).strip()
            self.paragraphs.append({
                "number": num,
                "id": f"mh-{num}",
                "text": para_text,
                "section": self.current_section,
                "subsection": self.current_subsection,
            })


def main():
    print("Reading HTML...")
    html = INPUT_HTML.read_text(encoding="utf-8", errors="ignore")

    print("Extracting paragraphs...")
    extractor = ParagraphExtractor()
    extractor.feed(html)

    paras = extractor.paragraphs

    if not paras:
        print("ERROR: No paragraphs extracted. The HTML structure may have changed.")
        return

    # Sort just in case
    paras.sort(key=lambda p: p["number"])

    print(f"Extracted {len(paras)} paragraphs (last number: {paras[-1]['number']})")

    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_JSON.write_text(json.dumps(paras, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUTPUT_JSON}")


if __name__ == "__main__":
    main()
