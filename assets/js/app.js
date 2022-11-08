const search = document.querySelector('#search'),
      submit = document.querySelector('#submit'),
      random = document.querySelector('#random'),
      meals_el = document.querySelector('#meals'),
      result_heading = document.querySelector('#result-heading'),
      single_meal_el = document.querySelector('#single-meal');

const searchMeal = e => {
   e.preventDefault();
   
   const term = search.value;
   if(term.trim()) {
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then(res => res.json())
      .then(data => {
         console.log(data);
         result_heading.innerHTML = `<h2>Search results for '${term}':</h2>`;
         if(data.meals === null){
            result_heading.innerHTML = `<p>There are no search results. Try again!</p>`;
         }else{
            meals_el.innerHTML = data.meals.map(meal => `
               <div class="meal">
                  <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                  <div class="meal-info" data-mealID="${meal.idMeal}">
                     <h3>${meal.strMeal}</h3>
                  </div>
               </div>`).join('');
            search.value = '';
         }
      }).catch(err => console.log(err));
      ;
   }else{
      console.log('Please enter a search term');
   }
}

const getMealById = mealID => {
   fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
   .then(res => res.json())
   .then(data => {
      const meal = data.meals[0];
      addMealToDOM(meal);
   });
};

const getRandomMeal = () => {
   meals_el.innerHTML = '';
   result_heading.innerHTML = '';
   fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
   .then(res => res.json())
   .then(data => {
      const meal = data.meals[0];
      addMealToDOM(meal);
   });
};


const addMealToDOM = meal => {
   const ingredients = [];
   for(let i = 1; i <= 20; i++){
      if(meal[`strIngredient${i}`]){
         ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
      }else{
         break;
      }
   }
   single_meal_el.innerHTML = `
      <div class="single-meal">
         <h1>${meal.strMeal}</h1>
         <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
         <div class="single-meal-info">
            ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
            ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
         </div>
         <div class="main">
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
               ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
         </div>
      </div>
   `;
};


submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

meals_el.addEventListener('click', e => {
   const meal_info = e.path.find(item => {
      console.log(item);
      if(item.classList){
         return item.classList.contains('meal-info');
      }else{
         return false;
      }
   });
   if(meal_info){
      const mealID = meal_info.getAttribute('data-mealid');
      getMealById(mealID);
   }
});