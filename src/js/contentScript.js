// integrating the SMMRY API
const API_KEY = "0F0300C290";

// gets all text without html tags
function getText() {
    return document.body.innerText;
}

// gets entire html of page
function getHTML() {
    return document.body.outerHTML;
}

// calls summarizing API
function summarize(url) {
    fetch(url + "?SM_API_KEY=" + API_KEY + "&SM_URL=" + document.URL, {
        method: "POST",
		mode: "cors",
        cache: "no-cache",
        headers: {
			"Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow",
        referrer: "no-referrer",
    }).then(response => {
        console.log(response);
        response.json().then((data) => {
            console.log(data.sm_api_content);           // split on period (.) to get array of sentences to highlight
    	});
    });
}

(function() {
    let pageText = getText();
    console.log(pageText);
    console.log(getHTML());
    
    summarize("https://api.smmry.com/");
})();
