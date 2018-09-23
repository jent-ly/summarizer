chrome.storage.sync.get({
    apiKey: ""
  }, function(items) {
      console.log(items.apiKey);
      fetch('https://textanalysis-text-summarization.p.mashape.com/text-summarizer', {
          method: "POST",
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "X-Mashape-Key": items.apiKey,
          },
          body: '{"url":"' + document.URL + '","text":"","sentnum":8}',
      }).then(response => {
          return response.json();
      }).then(myJson => {
          console.log(myJson.sentences);
      });
  });
