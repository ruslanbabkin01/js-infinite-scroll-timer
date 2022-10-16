const BASE_URL = 'https://the-one-api.dev/v2';

const containerEl = document.querySelector('.container');
const sentinelEL = document.querySelector('.js-sentinel');

let page = 1;

let options = {
  root: null,
  rootMargin: '200px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(onScroll, options);

const getCharacter = async function (page = 1) {
  const options = {
    headers: {
      Authorization: 'Bearer 9Md7WaRItR6DhLF6hAwY',
    },
  };
  const response = await fetch(
    `${BASE_URL}/character?limit=300&page=${page}`,
    options
  );
  return await response.json();
};

function onScroll(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      getCharacter(page)
        .then(
          containerEl.insertAdjacentHTML(
            'beforeend',
            data.docs.map(createMarcup).join('')
          )
        )
        .catch(error => console.log(error));
    }
  });
}

getCharacter()
  .then(data => {
    containerEl.insertAdjacentHTML(
      'beforeend',
      data.docs.map(createMarcup).join('')
    );

    observer.observe(sentinelEL);
  })
  .catch(error => console.log(error));

function createMarcup({ name, race, gender }) {
  return `
    <li>
		<p>Имя ${name}</p>
		<p>Раса ${race}</p>
		<p>Пол ${gender}</p>
	</li>
    `;
}
