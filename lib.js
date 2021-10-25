const LEAP_DOCS_URL = "https://doc.opensuse.org/documentation/leap/reference/single-html/book-reference/index.html"

var index = null

function displayResults(results) {
    document.getElementById("results-area").innerHTML = results
}

function countChars() {
    const val = document.getElementById("leap-search").value
    if (val.length >= 3) displayResults(search(val, index))
}


function search(s) {
    return index.search(s).map((l, i) => {
        const ln = (i + 1).toString() + ")"
        const href = `${LEAP_DOCS_URL}${l.ref}`
        return `
            <p><a href='${href}'>${ln} ${href}</a></p>
        `
    }).join('')
}

window.onload = () => {
    if (index === null) {
        return fetch("leap_index.json")
        .then(response => response.json())
        .then(idx => index = lunr.Index.load(idx))
    }
}