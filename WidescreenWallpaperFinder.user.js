// ==UserScript==
// @name         Widescreen Wallpaper Finder
// @namespace    http://theundarkpixel.com/
// @version      1.0
// @description  Filter images on a page by a minimum width
// @author       UndarkAido
// @source       https://github.com/UndarkAido/WidescreenWallpaperFinder
// @updateURL    https://raw.githubusercontent.com/UndarkAido/WidescreenWallpaperFinder/master/WidescreenWallpaperFinder.meta.js
// @downloadURL  https://raw.githubusercontent.com/UndarkAido/WidescreenWallpaperFinder/master/WidescreenWallpaperFinder.user.js
// @supportURL   https://github.com/UndarkAido/WidescreenWallpaperFinder/issues
// @include      https://www.pidgi.net/*
// @include      https://wow.gamepedia.com/*
// @include      https://wall.alphacoders.com/*
// @include      http://www.thevideogamegallery.com/*
// @include      https://press.activision.com/*
// @include      https://blizzard.gamespress.com/*
// @include      https://www.pexels.com/*
// @include      https://commons.wikimedia.org/*
// @include      https://www.deviantart.com/*
// @grant        none
// @require http://code.jquery.com/jquery-3.5.1.min.js
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant              GM_getValue
// @grant              GM_setValue
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements, GM_config */

// Create the title link
var title = document.createElement('a');
title.textContent = 'Widescreen Wallpaper Finder';
title.href = 'https://github.com/UndarkAido/WidescreenWallpaperFinder';

GM_config.init(
    {
        'id': 'WidescreenWallpaperFinder', // The id used for this instance of GM_config
        'title': title, // Panel Title
        'fields': // Fields object
        {
            'MINWIDTH': // This is the id of the field
            {
                'label': 'Minimum Width', // Appears next to field
                'type': 'int', // Makes this setting a text field
                'default': 3440 // Default value if user doesn't change it
            },
            'DAINTERVAL': // This is the id of the field
            {
                'label': 'Deviantart Request Interval', // Appears next to field
                'type': 'int', // Makes this setting a text field
                'default': 1000 // Default value if user doesn't change it
            }
        }
    }
);

console.log(window.location.hostname);
console.log("YYY");

let isPidgiWiki =			window.location.hostname.includes("pidgi.net")						// 🔗 https://www.pidgi.net/wiki/index.php?title=Special:NewFiles&limit=5000
let isWowWiki =				window.location.hostname.includes("wow.gamepedia.com")				// 🔗 https://wow.gamepedia.com/Special:NewFiles?limit=500
let isAlphaCoders =			window.location.hostname.includes("https://wall.alphacoders.com")
let isTheVideoGameGallery =	window.location.hostname.includes("thevideogamegallery.com")		// ⚰️ RIP
let isActivisionPress =		window.location.hostname.includes("press.activision.com")
let isBlizzardPress =		window.location.hostname.includes("blizzard.gamespress.com")
let isPexels =				window.location.hostname.includes("pexels.com")
let isWikimediaCommons =	window.location.hostname.includes("commons.wikimedia.org")
let isDeviantArt =			window.location.hostname.includes("deviantart.com")					// ⚠ Will result in 403s

function KeyCheck(e){
    switch(String.fromCharCode(e.keyCode)) {
        case 'F':
            hideythingamabob();
            break;
        case 'C':
            GM_config.open();
            break;
        default:
            // Do nothing
    }
}
window.addEventListener('keydown', KeyCheck, true);

function hideythingamabob(){
    if (isPidgiWiki || isWowWiki || isWikimediaCommons){
        $(".gallerytext").each(function() {
            let width = parseInt(
                isWikimediaCommons
                ? $(this).text().split("\n")[2].split(" ")[0].replace(/\,/g,'')
                : $(this).text().split(/\r?\n/)[4].split(' ')[0].replace(/,/g, '')
            )
            if(width < GM_config.get('MINWIDTH')){
                $(this).parent().parent().remove();
            }
        });
    }else if(isAlphaCoders){
        $(".boxcaption span:first-child span:first-child").each(function() {
            if(parseInt($(this).text().split("x")[0]) < GM_config.get('MINWIDTH')){
                $(this).parent().parent().parent().parent().remove();
            }
        });
    }else if(isTheVideoGameGallery){
        alert("RIP tVGG")
    }else if(isActivisionPress){
        $(".press__grid__item").each(function() {
            if($(this).find("span")[0].innerText.split(" ")[1] < GM_config.get('MINWIDTH')){
                $(this).remove();
            }
        });
    }else if(isBlizzardPress){
        $(".imagingThumb").each(function() {
            if($(this).attr("data-origw") < GM_config.get('MINWIDTH')){
                $(this).parent().parent().parent().remove();
            }
        });
    }else if(isPexels){
        $(".photo-item__img").each(function() {
            if($(this).attr("data-image-width") < GM_config.get('MINWIDTH')){
                $(this).parent().parent().parent().remove();
            }
        });
    }else if(isDeviantArt){
        let i = 0;
        $("section[data-hook='deviation_std_thumb'][filtered!='true']").each(function(i) {
            //console.log(this);
            this.setAttribute("filtered", "true")
            let root = $(this).parent()//$($(this).parent()).parent()
            let a = $(this).find("a[data-hook='deviation_link']")[0];
            setTimeout(function(){
                //console.log(a.href)
                $('<div>').load(a.href,function(response,status,xhr){
                    if($(this).find("._2yX6g").length < 1 || parseInt($(this).find("._2yX6g")[0].innerText.split("x",1)[0]) < GM_config.get('MINWIDTH') || $(this).find("a[data-hook='download_button']").length < 1){
                        root.remove();
                    }else{
                        //root.append($(this).find("a[data-hook='download_button']")[0])
                        a.href = $(this).find("a[data-hook='download_button']")[0].href;
                    }
                });
            }, i*GM_config.get('DAINTERVAL'));
        });
    }
}
