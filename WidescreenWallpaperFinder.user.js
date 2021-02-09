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
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

const MINWIDTH = 3440
const DEVIANTARTTIMEOUT = 1000;

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
    //alert(e.keyCode);
    if(e.keyCode == 70){
        hideythingamabob(3440);
    }
}
window.addEventListener('keydown', KeyCheck, true);

function hideythingamabob(minWidth){
    if (isPidgiWiki || isWowWiki || isWikimediaCommons){
        $(".gallerytext").each(function() {
            let width = parseInt(
                isWikimediaCommons
                ? $(this).text().split("\n")[2].split(" ")[0].replace(/\,/g,'')
                : $(this).text().split(/\r?\n/)[4].split(' ')[0].replace(/,/g, '')
            )
            if(width < minWidth){
                $(this).parent().parent().remove();
            }
        });
    }else if(isAlphaCoders){
        $(".boxcaption span:first-child span:first-child").each(function() {
            if(parseInt($(this).text().split("x")[0]) < minWidth){
                $(this).parent().parent().parent().parent().remove();
            }
        });
    }else if(isTheVideoGameGallery){
        alert("RIP tVGG")
    }else if(isActivisionPress){
        $(".press__grid__item").each(function() {
            if($(this).find("span")[0].innerText.split(" ")[1] < minWidth){
                $(this).remove();
            }
        });
    }else if(isBlizzardPress){
        $(".imagingThumb").each(function() {
            if($(this).attr("data-origw") < minWidth){
                $(this).parent().parent().parent().remove();
            }
        });
    }else if(isPexels){
        $(".photo-item__img").each(function() {
            if($(this).attr("data-image-width") < minWidth){
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
                    if($(this).find("._2yX6g").length < 1 || parseInt($(this).find("._2yX6g")[0].innerText.split("x",1)[0]) < minWidth || $(this).find("a[data-hook='download_button']").length < 1){
                        root.remove();
                    }else{
                        //root.append($(this).find("a[data-hook='download_button']")[0])
                        a.href = $(this).find("a[data-hook='download_button']")[0].href;
                    }
                });
            }, i*DEVIANTARTTIMEOUT);
        });
    }
}
