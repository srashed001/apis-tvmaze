/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  
  const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`)
  let showArray = [];
  for (let show of res.data){
    showArray.push({
      id: show.show.id,
      name: show.show.name, 
      summary: show.show.summary,
      image: show.show.image
    })
  }
  return showArray
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
  for (let show of shows) {
    const errorImg = 'https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300';
    if (show.image) imgURL = show.image.medium;
    else imgURL = errorImg
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
          <img class="card-img-top" src="${imgURL}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
           </div>
           <button>Episodes</button>
         </div>
       </div>
      `);
   
    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);


  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`)
  let episodeArr = []
  const episodes = res.data
  for (episode of episodes){
    episodeArr.push({
      id: episode.id, 
      name: episode.name,
      season: episode.season,
      number: episode.number
    })
  } return episodeArr;

  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
}

function populateEpisodes(episodes) {
  const $episodeList = $('#episodes-list')
  $episodeList.empty();
  for (let episode of episodes) {
    let $item = $(
      `<li data-episode-id="${episode.id}">${episode.name} (season: ${episode.season}, episode: ${episode.number})</li>`
    );
    $episodeList.append($item);
    $("#episodes-area").show();
  }
}


$('#shows-list').on('click', 'BUTTON', async function addEpisodes(e){
  let id = $(e.target).parent().attr('data-show-id')
  let episodes = await getEpisodes(id);
  populateEpisodes(episodes);

})

