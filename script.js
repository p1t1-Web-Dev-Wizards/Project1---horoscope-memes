document.addEventListener('DOMContentLoaded', function() {
   var elems = document.querySelectorAll('select');
   var instances = M.FormSelect.init(elems, {});

   console.log(elems);
 });

 

 var inputForm = document.querySelector('#search-form');

function handleSearchFormSubmit(event) {
  event.preventDefault();

  var dayInput = document.querySelector('#day-input').value;
  var signInput = document.querySelector('#sign-input').value;

  console.log(dayInput);
  console.log(signInput);
}

inputForm.addEventListener('submit', handleSearchFormSubmit);