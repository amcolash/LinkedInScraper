// ==UserScript==
// @name         LinkedIn Scraper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Andrew McOlash
// @match        https://www.linkedin.com/jobs/search/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const startDelay = 6000;
    const scrollTime = 500;
    const scrollNum = 10;
    const scrapeTime = 2500;
    const pageDelay = 2000;

    const numberOfPages = 6;

    // Assuming we start on page 1 (0)
    var page = 0;
    var data = [];

    function scroll() {
        console.log("scroll");

        var scrollBox = $('.jobs-search-two-pane__results-container')[0];
        for (var i = 0; i < scrollNum; i++) {
            const index = i;
            setTimeout(function () {
                scrollBox.scrollTo(0, index * 500);
            }, index * scrollTime);
        }
    }

    function scrapeCard() {
        var title = $('.jobs-details-top-card__job-title')[0].innerText;
        var company = $('.jobs-details-top-card__company-url')[0].innerText;
        var location = $('.jobs-details-top-card__bullet')[0].innerText.replace(" Company Location", "");
        var level = $('.js-formatted-exp-body')[0].innerText;
        var type = $('.js-formatted-employment-status-body')[0].innerText;
        var description = $('#job-details')[0].innerHTML;
        var url = $('.jobs-details-top-card__job-title-link')[0].href.replace(/\?.*/g, "");
        return {
            title: title,
            company: company,
            location: location,
            level: level,
            type: type,
            description: description,
            url: url
        };
    }

    function getData() {
        console.log("getData");

        var cards = $('.job-card-search--two-pane');
        var time = cards.length * scrapeTime;

        for (var i = 0; i < cards.length; i++) {
            const index = i;
            const card = cards[i];

            setTimeout(function () {
                console.log("page " + (page + 1) + " progress (" + (index + 1) + "/" + cards.length + "): " + ((index + 1) / cards.length).toFixed(3) +
                    ", total progress (" + (page + 1) + "/" + numberOfPages + "): " + ((((index + 1) / cards.length) + (page + 1) * cards.length) / (numberOfPages * cards.length)).toFixed(3) +
                    ", successfully parsed: " + data.length + "/" + (index + page * cards.length));

                card.click();

                setTimeout(function () {
                    $('.view-more-icon')[0].click();
                }, scrapeTime * 0.5);

                setTimeout(function () {
                    data.push(scrapeCard());
                }, scrapeTime * 0.9);

            }, i * scrapeTime);
        }

        setTimeout(function () {
            console.log("Done scraping page: " + (page + 1));

            setTimeout(function () {
                page++;
                if (page < numberOfPages) {
                    start(page);
                } else {
                    console.log("All done scraping, copying data to clipboard");
                    console.log(data);
                    copy(data);
                }
            }, pageDelay * 2);
        }, time + 500);
    }

    function start(pageIndex) {
        console.log("start");

        var buttons = $('.page-list button');
        if (pageIndex != 0) {
            for (var i = 0; i < buttons.length; i++) {
                var button = buttons[i];
                if (Number.parseInt(button.innerText) - 1 >= pageIndex) {
                    button.click();
                    break;
                }
            }
        }

        // Scroll to load all 25 cards
        setTimeout(function () {
            scroll();
        }, pageDelay);

        // Then after grab data
        setTimeout(function () {
            getData();
        }, scrollTime * scrollNum);
    }

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    // Wait a bit before we start scraping because the site is SLOOOOOWWW
    if (confirm('Would you like to scrape the job listings?')) {
        var url = window.location.href;
        var newUrl = url.split("?")[0];
        newUrl += "?";

        if (getParameterByName("start", url) || getParameterByName("currentJobId", url)) {
            var keywords = getParameterByName("keywords", url);
            var location = getParameterByName("location", url);

            if (keywords) newUrl += "&keywords=" + keywords;
            if (location) newUrl += "&location=" + location;

            window.location.href = newUrl;
            return;
        }

        setTimeout(function () {
            start(page);
        }, startDelay);
    }

    console.log("init script");

})();