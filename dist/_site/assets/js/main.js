


$(async function () {


  $('.owl-carousel').owlCarousel();
  handleScrollTop();
  setData()
})


/**
 * reload and chanhe language
 * 
 * @param {*} lang 
 */
function switchLanguage(lang) {
  if(lang==='ar') {
    window.location="/"
    return;
  }
  window.location = "/?lang=" + lang
}

/**
 * 
 * set data to correct langiage
 * 
 */
function setData() {

  // get url params & query
  var qs = (function (a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
      var p = a[i].split('=', 2);
      if (p.length == 1)
        b[p[0]] = "";
      else
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
  })(window.location.search.substr(1).split('&'));

  if (qs && qs.lang !== undefined) {

    switch (qs.lang) {
      case 'ar':
        setArabeLang()
        break;
      case 'en':

        setEnglishLang()
        break;
      default:

        setArabeLang()
    }
  } else {
    setArabeLang()
  }


}


function fillProperty(data,buttons,index){
if(index%2===0){
  console.log(index)
}

var content=`   <div class="columns item-s">
`
var buttonHtml=` <div class="buttons">
<a href="http://www.platinummzadat.qa/download" class="download button  is-primary">${buttons.download.title}</a>
<a href="" class="more button  is-primary">${buttons.more.title}</a>

</div>`
var ImageHtml=`  <div class="column is-6 is-offset-2 col-slider">
<div class="owl-carousel slider">`
var sub='<div class="column is-4  description">  <ul class="list">'
if(index%2!==0){
  ImageHtml=`  <div class="column is-6  col-slider">
  <div class="owl-carousel slider">`
  sub='<div class="column is-4 is-offset-2 description">  <ul class="list">'
}

data.imgs.forEach(function(item){
  ImageHtml+=` <div class="item">
  <img src="${item}" alt="">
</div>`

})
ImageHtml+="</div></div>"

data.sub.forEach(function(item){
if(item.startsWith('رابط الموقع') || item.startsWith('Location Link')){
  var x=item.split(":")
  var href=`${x[1]}:${x[2]}`
  sub+="<li><a href='"+href+"'>"+item+"</a></li>"
}else{
  sub+="<li>"+item+"</li>"
}


})


if(index%2===0){
  content+=sub+"<ul>"
  content+=buttonHtml+"</div>"
  content+=ImageHtml+"</div>"
}else{
  content+=ImageHtml
  content+=sub+"<ul>"
  content+=buttonHtml+"</div>"
  content+="</div>"
}

$("section.property .container").prepend(content)
}




/**
 * set arabic language
 * 
 * 
 */
function setArabeLang() {
  document.body.classList.toggle('ar')
  $('.top-banner p').text(window.dataArabe.banner.title)
  $('.introd p').html(window.dataArabe.majles.title)
  window.dataArabe.items.forEach(function(item,index){
    fillProperty(item, window.dataArabe.buttons,index)
  })
  $('.owl-carousel').owlCarousel({
    items:1,
    nav:true,
    dots:true
  });
}


/**
 * set english data
 * 
 */
function setEnglishLang() {
  document.body.classList.toggle('en')
  $('.top-banner p').text(window.dataEng.banner.title)
  $('.introd p').html(window.dataEng.majles.title)
  window.dataEng.items.forEach(function(item,index){
    fillProperty(item, window.dataEng.buttons,index)
  })
  $('.owl-carousel').owlCarousel({
    items:1,
    nav:true,
    dots:true
  });
}



/**
 * 
 * handling scroll
 * 
 */
function handleScrollTop() {
  var btn = $('#scrolltop');

  $(window).scroll(function () {
    if ($(window).scrollTop() > 300) {
      btn.addClass('show');
    } else {
      btn.removeClass('show');
    }
  });

  btn.on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, '300');
  });
}
