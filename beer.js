window.onload = function () {
  snowFall.snow(document.body, {round: true, shadow: true, minSize: 5, maxSize: 10, flakeCount: 60, maxSpeed: 2});

  find_nu_forfanden_en_øl_frem_henning();
}

function skriv_de_satans_øl_data_ind_arne (beer) {
  var image = document.createElement('img');
  image.src = 'img/' + beer.billede;
  
  document.querySelector('#beer-image').appendChild(image);

  document.querySelector('#beer-info h2.title span').innerText = beer.bryghus;
  document.querySelector('#beer-info h2.title strong').innerText = beer.navn;

  document.querySelectorAll('#beer-info .level p.title')[0].innerText = beer.alkohol.toFixed(1) + '%';
  document.querySelectorAll('#beer-info .level p.title')[1].innerText = beer.cl.toFixed(0);

  if (beer.rating16) {
    document.querySelector('#beer-info .icon-rating.snowflakes span').style.width = (beer.rating16 * 20) + '%';
    document.querySelector('#beer-info .icon-rating.gifts span').style.width = (beer.rating15 * 20) + '%';
    document.querySelector('#beer-info .icon-rating.trees span').style.width = (beer.rating14 * 20) + '%';
  }
  //todo
  document.querySelector('#beer-info').style.opacity = 1;
}

function find_nu_forfanden_en_øl_frem_henning () {
  var day = hvad_dag_er_det_hvis_man_ryger_hash_preben() || (new Date()).getDate();

  document.querySelector('#date > span').innerText = day + '. december';

  //$.getJSON('beer.json', øl_levering);

  // google leverer øllen i år
  Tabletop.init({
    key: '16qHJVEE3YJyrC2vapHGzuRamq_xjiVtfPwhK54uAXio',
    callback: øl_levering,
    simpleSheet: true,
    parseNumbers: true,
    prettyColumnNames: false
  });

  function øl_levering (beers) {
    // list2014 = [1, ..., 24];
    // list2015 = [4, 5, 7, 8, 9, 14, 15, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];
    // list2016 = [7, 8, 9, 10, 12, 15, 17, 20, 21, 22, 24, 25, 26, 28, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42];

    var shuffle2014 = [20, 19,  2, 17,  3, 15, 21, 12, 22,  7,  1,  9, 13, 23, 14, 24, 16,  4, 18, 11,  5, 10,  6,  8];
    var shuffle2015 = [ 9, 18, 29, 34, 25,  5, 33,  7, 21, 17, 31, 28, 14, 35,  4, 30, 20, 27, 26, 22,  8, 24, 23, 36, 32, 15];
    var shuffle2016 = [42, 38, 17,  7, 41, 10, 35, 34, 26, 12, 24, 15, 28, 22, 39, 21, 40, 33,  8,  9, 20, 25, 36, 37];

    var beers2014 = shuffle2014.map(function (i) { return beers[i-1] });
    var beers2015 = shuffle2015.map(function (i) { return beers[i-1] });
    var beers2016 = shuffle2016.map(function (i) { return beers[i-1] });

    var beer = beers2016[day-1];

    if (beer === undefined) {
      var average14 = regn_lige_gennemsnittet_ud_gunnar(beers2014, ['rating14', 'cl', 'alkohol'])
      var average15 = regn_lige_gennemsnittet_ud_gunnar(beers2015, ['rating15', 'cl', 'alkohol'])
      var average16 = regn_lige_gennemsnittet_ud_gunnar(beers2016, ['rating16', 'cl', 'alkohol'])

      console.log('Average 2014:', average14)
      console.log('Average 2015:', average15)
      console.log('Average 2016:', average16)

      beer = {
        "navn": "Nytårs Saften",
        "bryghus": "Arne og Søns Krudt og Kugle Butik",
        "alkohol": average16.alkohol,
        "cl": average16.cl,
        "rating16": average16.rating16,
        "rating15": average15.rating15,
        "rating14": average14.rating14,
        "billede": "nytårssaften.jpg"
      }
    }

    skriv_de_satans_øl_data_ind_arne(beer);
  }
}

function hvad_dag_er_det_hvis_man_ryger_hash_preben () {
  var hash = window.location.hash;
  if (hash) {
    var num = parseInt(hash.substr(1));
    if (!isNaN(num)) return num;
  }
}

function regn_lige_gennemsnittet_ud_gunnar (list, keys) {
  var average = {};

  keys.forEach(function (key) {
    average[key] = list.reduce(function (sum, el) { return sum + (el[key] || 0) }, 0) / list.length;
  })

  return average;
}
