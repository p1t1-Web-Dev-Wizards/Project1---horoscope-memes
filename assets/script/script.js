document.addEventListener('DOMContentLoaded', function() {
   var elems = document.querySelectorAll('select');
   var instances = M.FormSelect.init(elems, {});

   console.log(elems);
 });


let submitButton = document.querySelector('#submit');
let saveButton = document.querySelector('#save');

submitButton.addEventListener('click', handleSearchFormSubmit)
saveButton.addEventListener('click', saveResults)

// var inputForm = document.querySelector('#search-form');
// inputForm.addEventListener('submit', handleSearchFormSubmit);

// CONTROL FLOW OF APP
function handleSearchFormSubmit(event) {
  console.log(`button works`)
  // event.preventDefault();
  showResultsTransition();
  var dayInput = document.querySelector('#day-input').value;
  var signInput = document.querySelector('#sign-input').value;
  let yourSignBanner = document.querySelector(`#sign-banner`);
    yourSignBanner.textContent = signInput;
  let aztroURL = createAztroFetchUrl(signInput, dayInput);
  fetchAztroData(aztroURL)
  .then(function(aztroData){
    console.log(aztroData);
    let horoscope = aztroData.description;
    let mood = aztroData.mood;
    document.getElementById('daily-horoscope').textContent = horoscope;
    document.getElementById('mood-text').textContent = mood;
    console.log(horoscope);
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

//*****UPDATE GIFS******

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
          console.log(gifObjectArray);
          let randomizer = Math.floor(Math.random() * gifObjectArray.length);
          console.log(`The randomizer value is: ${randomizer}`);
          let gifObjectEntry = gifObjectArray[randomizer];
      
            //grab relevant values from specific gif return object
            let imageOptions = gifObjectEntry.images;
            let imageURL = imageOptions.original.url;
              //create and append img El to page
              let imageEl = document.getElementById('mood-gif');
                console.log(imageEl)
              imageEl.setAttribute('src', imageURL);

      }
    )
  }
//****END GENERATING GIFS****

// submit-results transition

function timeOut(fn, ms){
  console.log('TIMEOUT FIRED')
  return new Promise(resolve => 
    setTimeout(()=> {
      fn();
      resolve();
    }, ms));
  }

async function showResultsTransition() {
  console.log(`showResultsTransition FIRED`);

    //assign elements variable names for readability
    let spinner = document.querySelector(`.preloader-position-wrapper`);
    let resultsSection = document.querySelector(`#results-display`);

    //hide results if doing multiple searches in one session
      if (!resultsSection.classList.contains(`hidden`)){
        resultsSection.classList.add(`hidden`)
      }

    //show and scroll to the spinner
    spinner.classList.remove(`hidden`);
    // spinner.scroll({behavior: `smooth`})
    spinner.scrollIntoView()

    //wait two seconds then hide spinner --> reveal results --> scroll to bottom of page
      await timeOut(() => {document.querySelector(`.preloader-position-wrapper`).classList.add(`hidden`)}, 2000);
    resultsSection.classList.remove(`hidden`)
    window.scrollTo(0,document.body.scrollHeight);
}

console.log(document.body)

//****BEGIN SAVE THE INFO ****

class horoscopeSaveObject {
  constructor(starSign, date, horoscope, imgUrl){
    this.starSign = starSign;
    this.date = date;
    this.horoscope = horoscope;
    this.imgUrl = imgUrl;
  }

  load() {
    document.querySelector(`#sign-banner`).textContent = this.starSign;
    document.querySelector(`#daily-horoscope`).textContent = this.horoscope;
    document.querySelector(`#mood-gif`).src = this.imgUrl;
  }

}

function saveResults() {
  persistResultsToLocalStorage()
  renderSavedEntryButton()
}

function persistResultsToLocalStorage() {
  console.log(`saveResult FIRED`);
  let starSign = document.querySelector(`#sign-banner`).textContent;
  let date = moment().format(`dddd, MMMM Do YYYY`);
  let horoscope = document.querySelector(`#daily-horoscope`).textContent;
  let imgUrl = document.querySelector(`#mood-gif`).src;

  let saveObject = new horoscopeSaveObject(starSign, date, horoscope, imgUrl);
  let saveObjectKey = `${starSign}-${date}`;

  localStorage.setItem(saveObjectKey, JSON.stringify(saveObject));

  
  console.log(saveObjectKey)
  console.log(saveObject)
  
  // console.log(starSign)
  // console.log(date)
  // console.log(horoscope)
  // console.log(imgUrl)
}

function renderSavedEntryButton() {

}
