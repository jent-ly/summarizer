// gets all text without html tags
function getText(){
    return document.body.innerText
}

// gets entire html of page
function getHTML(){
    return document.body.outerHTML
}

console.log(getText());
console.log(getHTML());
