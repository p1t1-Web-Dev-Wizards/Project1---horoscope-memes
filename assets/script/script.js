document.addEventListener('DOMContentLoaded', function() {
   var elems = document.querySelectorAll('select');
   var instances = M.FormSelect.init(elems, {});

   console.log(elems);
 });



var inputForm = document.querySelector('#search-form');
inputForm.addEventListener('submit', handleSearchFormSubmit);


function handleSearchFormSubmit(event) {
  console.log(`button works`)
  event.preventDefault();
  var dayInput = document.querySelector('#day-input').value;
  var signInput = document.querySelector('#sign-input').value;
  let aztroURL = createAztroFetchUrl(signInput, dayInput);
  fetchAztroData(aztroURL)
  .then(function(aztroData){
    console.log(aztroData);
    clearGifs();
    let giphyURL = createGiphyFetchUrl(aztroData.mood)
    fetchGiphyData(giphyURL);
    }
  )
}

//*****BEGIN ACCESS HOROSCOPE LOGIC****
function createAztroFetchUrl(userInputSign, userSelectedDay) {
  let aztroURL = `https://aztro.sameerkumar.website?sign=${userInputSign}&day=${userSelectedDay}`;
return aztroURL;
}

function fetchAztroData(aztroURL) {
return fetch(aztroURL, {
  method: 'POST'
})
  .then (response => response.json())
  .then (json => {
    console.log(json)
    console.log(`Your Color: ${json.color}`)
    console.log(`Your Compatibility: ${json.compatibility}`)
    console.log(`The Current Date: ${json.current_date}`)
    console.log(`Your Sign's Birthdate Range: ${json.date_range}`)
    console.log(`Your Horoscope For Selected Day: ${json.description}`)
    console.log(`Your Lucky Number: ${json.lucky_number}`)
    console.log(`Your Lucky Time For Selected Day: ${json.lucky_time}`)
    console.log(`Your Mood: ${json.mood}`)
    return json;
  })
}
//*****END ACCESS HOROSCOPE LOGIC****



//****BEGIN GENERATE GIF LOGIC****
function clearGifs() {
let previousGifsHTMLCollection = document.querySelector('#mood').children;
  for (let i = previousGifsHTMLCollection.length -1; i >= 0; i--) {
    previousGifsHTMLCollection[i].remove();
  }
}


// async function renderGifs(){
//     console.log(`renderMemes FIRED`)
//     let userInputSign = captureUserInput();
//     fetchGiphyAPIResults(userInputSign);
// }


// function captureUserInput() {
//     console.log(`captureUserInput FIRED`)
//     let userInputSign = document.querySelector(`#sign`).value;
//     return userInputSign;
// }

function createGiphyFetchUrl(userInputSign){
  let giphyAPIKey = `DZltucdua4H0cmMrv8M5wNuJ1Dlf74Ci`;
  let URLTemplate = `https://api.giphy.com/v1/gifs/search?q=${userInputSign}&rating=g&api_key=${giphyAPIKey}`;
return URLTemplate;
}

function fetchGiphyData(giphyURL) {
  fetch(giphyURL)
      .then( response => response.json() )
      .then( data => {
          //actual gif entries minus irrelevant metadata
          let gifObjectArray = data.data;
          let randomizer = Math.floor(Math.random() * gifObjectArray.length);
          console.log(`The randomizer value is: ${randomizer}`);
          let gifObjectEntry = gifObjectArray[randomizer];
      
            //grab relevant values from specific gif return object
            let imageOptions = gifObjectEntry.images;
            let imageURL = imageOptions.original.url;
              //create and append img El to page
              let imageEl = document.createElement(`img`);
              let gifEl = document.querySelector('#mood');
              imageEl.setAttribute('src', imageURL);
              gifEl.appendChild(imageEl);
      }
    )
  }
//****END GENERATING GIFS****