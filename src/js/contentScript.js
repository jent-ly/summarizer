// gets all text without html tags
function getText(){
    return document.body.innerText
}

// gets entire html of page
function getHTML(){
    return document.body.innerHTML
}

// console.log(getText())
// console.log(getHTML())

// document.body.innerHTML = "<b>" + getHTML() + "</b>"
var sentences = [
  // "Could the concept of ikigai contribute to longevity?"
  "people have ikigai (pronounced Ick-ee-guy)"
]

var delim = "(<\/?.*?>| )*"

sentences = sentences.map(x => x.replace(/\(/, delim + "\\(" + delim))
sentences = sentences.map(x => x.replace(/\)/, delim + "\\)" + delim))
sentences = sentences.map(x => x.replace(/[ .,\/#!$%\^&\*;:{}=\-_`~]/g, delim + "$&" + delim))
// sentences = sentences.map(x => x.replace(new RegExp(" ", "g"), delim) + delim + "?")
sentences_i = 0
console.log(sentences)

// var items = document.getElementsByTagName("*");
// for (var i = 0; i < items.length; i++) {
  var html = getHTML()
  var regex = new RegExp(sentences[sentences_i], "gi")
  var match = html.match(regex)
  console.log("item")
  if (match && match.length > 0) {
    console.log(match)
    var match_len = match[0].length
    var start_index = html.search(regex)
    console.log(start_index)
    console.log(match_len)
    var begin = html.substring(0, start_index)
    var middle = html.substr(start_index, match_len)
    var end = html.substr(start_index + match_len)
    document.body.innerHTML = begin + "<b>" + middle + "</b>" + end
  }
// }
