document.addEventListener('DOMContentLoaded', function() {
   var elems = document.querySelectorAll('select');
   var instances = M.FormSelect.init(elems, {});
   loadSavedEntriesOnPageLoad()
   console.log(elems);
   document.querySelector(`.main-menu-center`).scrollIntoView({block:`center`});
 });


let submitButton = document.querySelector('#submit');
let saveButton = document.querySelector('#save');
let loadSelectedEntryButton = document.querySelector(`#load-selected-entry`);
let deleteSelectedEntryButton = document.querySelector(`#delete-selected-entry`);
let deleteAllEntriesButton = document.querySelector(`#delete-all-confirm`);

// parallax
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.parallax');
  var instances = M.Parallax.init(elems, {});
});

// modal

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems, {});
});


submitButton.addEventListener('click', handleSearchFormSubmit);
saveButton.addEventListener('click', saveResults);
loadSelectedEntryButton.addEventListener(`click`, loadSelectedEntry);
deleteSelectedEntryButton.addEventListener(`click`, deleteEntry);
deleteAllEntriesButton.addEventListener(`click`, deleteAllEntries);


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



// *****BEGIN SUBMIT CLICK TRANSITION//LOADER/SCROLL

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

    //hide previous results if doing multiple searches in one session
      if (!resultsSection.classList.contains(`hidden`)){
        resultsSection.classList.add(`hidden`)
      }

    //show and scroll to the spinner
    spinner.classList.remove(`hidden`);
    spinner.scrollIntoView()

    //wait two seconds then hide spinner 
      await timeOut(() => {document.querySelector(`.preloader-position-wrapper`).classList.add(`hidden`)}, 2000);

    // reveal results and scroll to bottom of page
    resultsSection.classList.remove(`hidden`)
    document.querySelector(`#horoscope-key-label`).style.color = ``;
    document.querySelector(`#save-result-card`).style.display = `block`;
    window.scrollTo(0,document.body.scrollHeight);
    return;
}

// *****END SUBMIT CLICK TRANSITION//LOADER/SCROLL




//****BEGIN SAVE TO LOCAL STORAGE ****

class horoscopeSaveObject {
  constructor(starSign, mood, date, horoscope, imgUrl, saveObjectKey){
    this.starSign = starSign;
    this.mood = mood;
    this.date = date;
    this.horoscope = horoscope;
    this.imgUrl = imgUrl;
    this.saveObjectKey = saveObjectKey;
  }

  load() {
    document.querySelector(`#sign-banner`).textContent = this.starSign;
    document.querySelector(`#daily-horoscope`).textContent = this.horoscope;
    document.querySelector(`#mood-gif`).src = this.imgUrl;
  }
};




//controlfunction
function saveResults() {
    let saveObject = captureResultValues();
    document.querySelector(`#horoscope-key`).value = "";
    saveResultsToLocalStorage(saveObject.saveObjectKey, saveObject);
    addSavedEntryToOptions(saveObject.saveObjectKey);
  M.AutoInit();
};

function captureResultValues() {
  console.log(`saveResult FIRED`);
    let starSign = document.querySelector(`#sign-banner`).textContent;
    let mood = document.querySelector(`#mood-text`).textContent;
    let date = moment().format(`dddd, MMMM Do YYYY`);
    let horoscope = document.querySelector(`#daily-horoscope`).textContent;
    let imgUrl = document.querySelector(`#mood-gif`).src;
    let saveObjectKey = document.querySelector(`#horoscope-key`).value;
  return new horoscopeSaveObject(starSign, mood, date, horoscope, imgUrl, saveObjectKey);
};


function saveResultsToLocalStorage(saveObjectKey, saveObject) {
  console.log(`saveResultsToLocalStorage FIRED`)
      if(saveObjectKey === "" || saveObjectKey === null) {
        M.toast({html: 'Please enter a title to reference the result save with', classes: 'red'})
        document.querySelector(`#horoscope-key-label`).style.color = `red`
        return;
      }
      document.querySelector(`#horoscope-key-label`).style.color = ``
      document.querySelector(`#save-result-card`).style.display = `none`;
    localStorage.setItem(saveObjectKey, JSON.stringify(saveObject));
    M.toast({html: `This entry has been saved under option "${saveObjectKey}"`, classes: 'green'})
};


function addSavedEntryToOptions(saveObjectKey) {
  console.log(`%caddSavedEntryToOptions FIRED`, `color:limegreen`);
  let savesList = document.querySelector(`#previous-saves`);
  console.log(savesList);
    let optionEl = document.createElement(`option`);
      console.log(optionEl);
    optionEl.value = saveObjectKey;
      console.log(optionEl.value);
    optionEl.id = saveObjectKey;
    console.log(optionEl.id);
    optionEl.textContent = saveObjectKey;
     console.log(optionEl.textContent);
    savesList.appendChild(optionEl);
}

console.log(`The number of entries in localStorage is ${localStorage.length}.`)

function loadSavedEntriesOnPageLoad() {
  for(let saveObjectKey in localStorage){
    console.log(`${saveObjectKey}: ${localStorage.getItem(saveObjectKey)}`);
    if(localStorage.getItem(saveObjectKey) === null){
        console.log(`ENTRY IS NULL`)
      continue;
    }
    addSavedEntryToOptions(saveObjectKey);
  }
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems, {});
}

//control Function
function loadSelectedEntry() {
  console.log(`loadSelectedEntry FIRED`)
  let saveObjectKey = document.querySelector('#previous-saves').value;
  let saveObject = retrieveSelectedSaveFromLocalStorage(saveObjectKey);
  renderSavedResult(saveObject);
}

function retrieveSelectedSaveFromLocalStorage(saveObjectKey) {
    let saveObject = JSON.parse(localStorage.getItem(saveObjectKey));
  return saveObject;
}

async function renderSavedResult(saveObject) {
  let signBannerEl = document.getElementById('sign-banner');
  let horoscopeEl = document.getElementById('daily-horoscope');
  let moodEl = document.getElementById('mood-text');
  let imageEl = document.getElementById('mood-gif');
    signBannerEl.textContent = `${saveObject.starSign} from ${saveObject.date}`
    horoscopeEl.textContent = saveObject.horoscope;
    moodEl.textContent = saveObject.mood;

    console.log(moodEl)
    console.log(saveObject.mood)
    imageEl.setAttribute('src', saveObject.imgUrl);
    await showResultsTransition();
    document.querySelector(`#save-result-card`).style.display = `none`
}

function deleteEntry () {
  console.log(`deleteEntry FIRED`);
    let saveObjectKey = document.querySelector('#previous-saves').value;
    localStorage.removeItem(saveObjectKey);
    let saveObjectEl = document.getElementById(`${saveObjectKey}`);
    saveObjectEl.remove()
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, {});
  M.toast({html: `Saved entry "${saveObjectKey}" has been deleted.`, classes: 'orange'})
}

function deleteAllEntries () {
  console.log(`deleteAllEntries FIRED`);
      for(let saveObjectKey in localStorage){
        console.log(`${saveObjectKey}: ${localStorage.getItem(saveObjectKey)}`);
        if(localStorage.getItem(saveObjectKey) === null){
            console.log(`ENTRY IS NULL`)
          continue;
        }
        localStorage.removeItem(saveObjectKey);
        document.getElementById(`${saveObjectKey}`).remove();
      }
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, {});
  M.toast({html: `All saved entries have been cleared.`, classes: 'red lighten-1'})
  }
