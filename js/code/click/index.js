const outer = document.querySelector('.outer');
const inner = document.querySelector('.inner');
const clickBtn = document.querySelector('.click-btn');

new MutationObserver(function() {
  console.log('mutate');
}).observe(outer, {
  attributes: true,
});

const onClick =() => {
  console.log('click');
  
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

inner.addEventListener('click', onClick);
outer.addEventListener('click', onClick);
clickBtn.addEventListener('click', testFireClick);
