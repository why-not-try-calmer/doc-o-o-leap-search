from lunr import lunr
from bs4 import BeautifulSoup
from pydantic import BaseModel
import requests

from typing import Any, Dict, List
import json


class LunrDoc(BaseModel):
    number: str
    contents: str
    permalink: str
    title: str


def parse(data_str: str) -> List[LunrDoc]:
    """ Parses the input into a list of LunrDoc instances. """
    root = BeautifulSoup(data_str, 'html.parser')
    chapters = root.find_all(class_="chapter")
    res = []
    for c in chapters:
        titles = c.find_all(class_="titlepage")
        contents = [c.get_text() for c in c.find_all("p")]
        for i, t in enumerate(titles):
            names = t.find_all(class_="name")[0].get_text()
            permalink = t.find_all(class_="permalink")[0]["href"]
            number = t.find_all(class_="number")[0].get_text().strip()
            res.append(LunrDoc(number=number, title=names,
                       permalink=permalink, contents="".join(contents[i])))
    return res


def make_leap_index(raw: str) -> Dict[str, Any]:
    """ Extracts an lunr-compliant index from the input. """
    lunr_docs = parse(raw)
    to_dicts = (doc.dict() for doc in lunr_docs)
    idx = lunr(ref="permalink", fields=("contents", "title"), documents=to_dicts)
    return idx.serialize()


def main() -> None:
    response = requests.get(url)
    raw_text = response.text
    index = make_leap_index(raw_text)
    with open("leap_index.json", "w") as f:
        json.dump(index, f, ensure_ascii=False)


if __name__ == "__main__":
    url = "https://doc.opensuse.org/documentation/leap/reference/single-html/book-reference/index.html"
    main()
