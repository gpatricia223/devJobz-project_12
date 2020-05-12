const app = $('#app');

const state = {
    posts: [],   
    type: false,
}


async function fetchQuote() {
    const response = await fetch('/cowspiration');
    const { cow } = await response.json();
  
    $('#results').empty().append($(`<pre>${ cow }</pre>`))
  }
  
  fetchQuote();


const fetchPosts = async () => {
    try {
        const res = await fetch('/job-search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
                description: state.posts,
                fulltime: state.type,
        }),
    });
    const { results } = await res.json();
    console.log(results)
    state.posts = results
    return results;
    }
     catch (e) {
            console.log(error)
      }
}

function renderPreview(posts) {
    console.log(posts)
    $('#results').empty().append(posts.map(post => createJobCard(post)))
}

//build out template//
function createJobCard (job) {
    return $(`<div class="card">
    <div class="card-header">
    <h2><a href="${ job.company_url ? job.company_url : "" }">${job.company}</a></h2>
    <img class="float-right" src="${ job.company_logo ? job.company_logo : "" }"></div>
    <div class="card-body">
    <h1 class="card-title">${job.title}</h1>
    <div class="card-text">${job.description}</div>
    </div>
    <ul class="list-group-item">${job.how_to_apply}</ul>
    <div class="card-body">
    <div class="card-link">${job.type}</div>
    <div class="card-link">${job.created_at}</div>
    </div>`)   
}

$('#search-button').on('click', async function (event){
    event.preventDefault();
    await fetchPosts();
    renderPreview(state.posts);
})

async function fetchWeather() {
    if (!navigator || !navigator.geolocation) {
      $('#weather').append($('<h3>Weather not available on this browser</h3>'))
    }
  
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { coords: { latitude, longitude } } = position;
  
      const response = await fetch(`/weather?lat=${ latitude }&lon=${ longitude }`);
      const { results } = await response.json();
  
      if (results.daily) {
        $('#weather').empty();
  
        results.daily.forEach(day => {
          const { weather: [{ icon }] } = day;
  
          $('#weather').append($(`
            <img src="http://openweathermap.org/img/wn/${ icon }@2x.png" />
          `));
        });
      }
    }, async (error) => {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      if (result.state == "denied") {
        $('#weather').html(
          $(`<div>
              <h3>You have denied access to location services.</h3>
              <h4>If you wish to see your forecast, update your settings and refresh.</h4>
            </div>`)
        )
      }
    });
  }
  
  fetchWeather();