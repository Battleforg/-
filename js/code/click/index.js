const outer = document.querySelector('.outer');
const inner = document.querySelector('.inner');
const clickBtn = document.querySelector('.click-btn');

new MutationObserver(function() {
  console.log('mutate');
}).observe(outer, {
  attributes: true,
});

function onClick() {
  console.log('click', this, Date.now());
  
  setTimeout(() => {
    console.log('timeout');
  }, 0);

  Promise.resolve().then(function () {
    console.log('promise');
  });

  outer.setAttribute('data-random', Math.random());
}

const testFireClick = () => {
  console.log('fire inner click');
  inner.click();
}

outer.addEventListener('click', onClick);
clickBtn.addEventListener('click', testFireClick);
inner.addEventListener('click', onClick);