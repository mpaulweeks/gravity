
function NewTrack(path, filename, description, url){
  return {
    path: path,
    filename: filename,
    description: description,
    url: url,
    GetFile: function(){return path + '/' + filename;}
  }
}

function NewJukebox(tracks){
  function setCookie(cname, cvalue, exdays){
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
  };

  function getCookie(cname){
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++)
    {
      var c = ca[i].trim();
      if (c.indexOf(name)==0){
        return c.substring(name.length,c.length);
      }
    }
    return null;
  };

  var self = {};

  var COOKIE_MUTE = 'audioMuted';
  var COOKIE_SONG = 'audioTrack';

  var index = 0;
  var audioElm = document.createElement('audio');
  audioElm.setAttribute('loop', true);
  var jukeboxPlaying = getCookie(COOKIE_MUTE) === "false";
  if (window.location.href.includes("file://")){
    jukeboxPlaying = false;
  }
  var infoElm = document.getElementById('jukebox');
  infoElm.innerHTML = `
      <div>you are currently listening to</div>
      <div class="song-title"><a id="jukebox-url" target="_blank" href=""></a></div>
      <div>
        <button id="jukebox-toggle" >loading...</button>
        <button id="jukebox-next">next track</button>
      </div>
  `;
  var urlElm = document.getElementById('jukebox-url');
  var toggleElm = document.getElementById('jukebox-toggle');
  var nextElm = document.getElementById('jukebox-next');

  function loadTrack(filename){
    var toLoad = tracks[0];
    for (var i = 0; i < tracks.length; i++){
      var currTitle = tracks[i].filename;
      if (currTitle == filename){
        toLoad = tracks[i];
        index = i;
      }
    }
    audioElm.setAttribute('src', toLoad.GetFile());
    urlElm.innerHTML = toLoad.description;
    urlElm.setAttribute('href', toLoad.url);
    setCookie(COOKIE_SONG, toLoad.filename, 7);
    enforceJukebox();
  }
  function enforceJukebox(){
    if (jukeboxPlaying){
      audioElm.play();
      toggleElm.innerHTML = 'stop music';
    } else {
      audioElm.pause();
      toggleElm.innerHTML = 'play music';
    }
    setCookie(COOKIE_MUTE, !jukeboxPlaying, 7);
  }
  function toggleJukebox(){
    jukeboxPlaying = !jukeboxPlaying;
    enforceJukebox();
  }
  function nextTrack(){
    var delta = 1;
    jukeboxPlaying = true;
    var newIndex = (index + delta + tracks.length) % tracks.length;
    loadTrack(tracks[newIndex].filename);
  }

  // listeners
  toggleElm.addEventListener('click', toggleJukebox);
  nextElm.addEventListener('click', nextTrack);
  if (tracks.length < 2){
    nextElm.style.display = 'none';
  }

  // on load
  loadTrack(getCookie(COOKIE_SONG) || null);

  self = {
    next: nextTrack,
    toggle: toggleJukebox,
  }
  return self;
}
