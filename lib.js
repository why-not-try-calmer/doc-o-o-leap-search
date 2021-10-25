LEAP_DOCS_URL = 'https://doc.opensuse.org/documentation/leap/reference/single-html/book-reference'

function getLeapParse() {
    return fetch(LEAP_DOCS_URL)
        .then(response => {
            response.text()
            console.log(response)
        })
        .then(text => {
            console.log(text.length)
            console.log(text)
            const root = parser.parse(text)
            const sections = root.querySelectorAll('div[class^="sect"]')
            const results = []
            for (const sec of sections) {
                let name = sec.querySelector('span.name')
                let number = sec.querySelector('.number')
                if (!number || !name) { continue }
                name = name.text
                number = number.text.trim()
                const permalink = sec.querySelector('a.permalink').getAttribute('href')
                const contents = sec.querySelectorAll('p').join('')
                results.push({ name, permalink, number, contents })
            }
            return results
        })
}

function toLeapIndex(soup) {
    return lunr(function () {
        this.ref('permalink')
        this.field('text')
        for (const s of soup) {
            this.add({ 'name': s.name, 'text': s.contents, 'permalink': s.permalink })
        }
    })
}

function makeLeapIndex() {
    return getLeapParse().then(soup => toLeapIndex(soup))
}

function search(s, idx) {
    return idx.search(s).map((l, i) => (i + 1).toString() + ') ' + LEAP_DOCS_URL + '/' + l.ref)
}
