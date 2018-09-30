// integrating the Resoomer API
// const API_KEY = "DECBD2E2E379FF7ED5F36B90C0A43AAB";

// gets all text without html tags
function getText() {
    return document.body.innerText;
}

// gets entire html of page
function getHTML() {
    return document.body.outerHTML;
}

// calls summarizing API
function summarize(url, apiparams) {
    fetch(url, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow",
        referrer: "no-referrer",
        body: apiparams,
    }).then(response => {
        console.log(response);
        response.json().then((data) => {
            console.log(data);      // summary printed out here
            let summary = data.text.content;
            console.log(summary);   // the format is a string, so we can split on '.' to get an array of sentences
    	});
    });
}

(function() {
    let pageText = getText();
    console.log(pageText);          // pageText may contain "" or '' which can be troublesome
    console.log(getHTML());
    
    let apiparams = "API_KEY=" + API_KEY + "&text='" + pageText + "'";
    summarize("https://resoomer.pro/summarizer/", apiparams);
})();
