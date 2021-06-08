// ==UserScript==
// @name         Widescreen Wallpaper Finder
// @namespace    http://theundarkpixel.com/
// @version      1.1
// @description  Filter images on a page by a minimum width
// @author       UndarkAido
// @source       https://github.com/UndarkAido/WidescreenWallpaperFinder
// @updateURL    https://raw.githubusercontent.com/UndarkAido/WidescreenWallpaperFinder/master/WidescreenWallpaperFinder.meta.js
// @downloadURL  https://raw.githubusercontent.com/UndarkAido/WidescreenWallpaperFinder/master/WidescreenWallpaperFinder.user.js
// @supportURL   https://github.com/UndarkAido/WidescreenWallpaperFinder/issues
// @include      https://www.pidgi.net/*
// @include      https://wowpedia.fandom.com/*
// @include      https://wall.alphacoders.com/*
// @include      http://www.thevideogamegallery.com/*
// @include      https://press.activision.com/*
// @include      https://blizzard.gamespress.com/*
// @include      https://www.pexels.com/*
// @include      https://commons.wikimedia.org/*
// @include      https://www.deviantart.com/*
// @grant        none
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant              GM_getValue
// @grant              GM_setValue
// ==/UserScript==
/* globals $, waitForKeyElements, GM_config */

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

let host = window.location.hostname;
console.log(host);

let isPidgiWiki =			host.includes("pidgi.net");						// 🔗 https://www.pidgi.net/wiki/index.php?title=Special:NewFiles&limit=5000
let isWowpedia =			host.includes("wowpedia.fandom.com");				// 🔗 https://wow.gamepedia.com/Special:NewFiles?limit=500
let isAlphaCoders =			host.includes("https://wall.alphacoders.com");
let isTheVideoGameGallery =	host.includes("thevideogamegallery.com");		// ⚰️ RIP
let isActivisionPress =		host.includes("press.activision.com");
let isBlizzardPress =		host.includes("blizzard.gamespress.com");
let isPexels =				host.includes("pexels.com");
let isWikimediaCommons =	host.includes("commons.wikimedia.org");
let isDeviantArt =			host.includes("deviantart.com");				// ⚠ Will result in 403s

var contentIndex = 0;
var script = document.createElement('script');
script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);
script.onload = function() {
    let jQuery_360 = $.noConflict(true);
    console.log("$ calls: " + $.fn.jquery + ", jQuery_360 calls: " + jQuery_360.fn.jquery);
    window.addEventListener('keydown', (e) => KeyCheck(e, jQuery_360), true);
}

function KeyCheck(e, $){
    switch(String.fromCharCode(e.keyCode)) {
        case 'C':
            GM_config.open();
            break;
        case 'F':
            hidestuff($);
            break;
        case 'L':
            loadmore($);
            break;
        default:
            // Do nothing
    }
}

function hidestuff($){
    if (isPidgiWiki || isWowpedia || isWikimediaCommons){
        $(".gallerytext").each(function() {
            console.log($(this).text());
            console.log($(this).text().split(/\r?\n/));
            console.log($(this).text().split(/\r?\n/)[4]);
            let width = parseInt(
                isWikimediaCommons | isWowpedia
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

function loadmore($){
    if(isBlizzardPress){
        if($(".morelink:visible").length > 0){
            $(".morelink:visible").each(function() {
                this.click();
                function check() {
                    if($(".morelink.butLoading:visible").length > 0) {
                        return setTimeout(check, 100);
                    }
                    loadmore($);
                }
                check();
            });
        }else{
            let i = 0;
            $(".Expandable-caretOpen").each(function() {
                let x = this;
                setTimeout(function(){
                    x.click()
                },i++*100);
            });
            $(".tn-more").each(function() {
                let x = this;
                setTimeout(function(){
                    x.click()
                },i++*100);
            });
        }
    }
}
