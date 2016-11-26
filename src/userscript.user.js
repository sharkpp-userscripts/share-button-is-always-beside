// ==UserScript==
// @name         share button is always beside
// @namespace    http://www.sharkpp.net/
// @version      0.1
// @description  Append share button in all pages.
// @author       sharkpp
// @include      *
// @exclude     https://twitter.com/*
// @exclude     https://www.google.co.jp/_/chrome/newtab*
// ==/UserScript==

(function() {
    'use strict';

    if (window != parent) { // exit when if loaded in iframe
        return;
    }

    var NS = 'sns-share-button-for-all-pages-';

    var evaluate_ = function (xpath, resultOnce) {
        resultOnce = 'undefined' == typeof resultOnce ? false : resultOnce;
        var items = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        return resultOnce ? (items.snapshotLength ? items.snapshotItem(0) : null)
                          : items;
    };
    //console.log(evaluate_('//a[starts-with(@href, "https://twitter.com/share")]',true));

    var applyStyles = function (elm, styles, overwriteStyles) {
        overwriteStyles = overwriteStyles || {};
        for (var name in styles) {
            elm.style[name] = overwriteStyles[name] || styles[name];
        }
    };

    var baseElmStyles = {
        inital: {
            top:          '10px',
            left:         '-1px',
            width:        '30px',
            height:       '50px',
            borderRadius: '0 2px 2px 0',
        　　　　padding: '2px',
            transition: ''
        },
        initalOpen: {
            left:         '10px',
            width:        'auto',
            height:       'auto',
            borderRadius: '3px',
        　　　　padding: '6px',
            transition: ''
        },
        stick: {
            top:          '-1px',
            left:         '-1px',
            width:        '50px',
            height:       '50px',
            borderRadius: '0 0 50px 0',
        　　　　padding: '2px',
            transition:   ''
        },
        stickOpen: {
            top:          '10px',
            left:         '10px',
            width:        'auto',
            height:       'auto',
            borderRadius: '3px',
        　　　　padding: '6px',
            transition:   ''
        },
    };
    var panelOpenElmStyles = {
        inital: {
            display:    'block',
            width:      '100%',
            height:     '44px',
            lineHeight: '44px',
            fontSize:   '20px',
            transform:  '',
        },
        initalOpen: {
            display:    'none',
        },
        stick: {
            display:    'block',
            width:      '35px',
            height:     '35px',
            lineHeight: '35px',
            fontSize:   '30px',
            transform:  'rotate(45deg)',
        },
        stickOpen: {
            display:    'none',
        },
    };
    var panelCloseElmStyles = {
        inital: {
            display:    'none',
        },
        initalOpen: {
            display:    'block',
            width:      '100%',
            height:     '20px',
            lineHeight: '20px',
            fontSize:   '20px',
            transform:  '',
        },
        stick: {
            display:    'none',
        },
        stickOpen: {
            display:    'block',
            width:      '100%',
            height:     '20px',
            lineHeight: '20px',
            fontSize:   '20px',
            transform:  '',
        },
    };
    var shareElmStyles = {
        inital: {
            display:    'none',
        },
        initalOpen: {
            display:    'block',
        },
        stick: {
            display:    'none',
        },
        stickOpen: {
            display:    'block',
        },
    };

    var baseElm = document.createElement('div');
    baseElm.id = NS + 'base';
    baseElm.style.cssText = [
        'box-sizing: border-box;',
        'position: fixed;',
        'background-color: #fff;',
        'border: 1px solid #ccc;',
        'border-radius: 0 2px 2px 0;',
        'z-index: 2147483647;', // for Youtube
    ].join(" ");

    var panelOpenElm = document.createElement('div');
    panelOpenElm.innerHTML = '&#187;';
    panelOpenElm.style.cssText = [
        'display: block;',
        'margin: 0;',
        'padding: 0;',
        'top: 0;',
        'left: 0;',
        'vertical-align: middle;',
        'text-align: center;',
        'pointer-events: none;'
    ].join(" ");

    var panelCloseElm = document.createElement('div');
    panelCloseElm.innerHTML = '&#171;';
    panelCloseElm.style.cssText = [
        'display: none;',
        'margin: 0;',
        'padding: 0;',
        'top: 0;',
        'left: 0;',
        'vertical-align: middle;',
        'text-align: center;',
        'pointer-events: none;'
    ].join(" ");

    var shareElm = document.createElement('div');
    shareElm.style.cssText = [
    ].join(" ");

    baseElm.appendChild(shareElm);
    baseElm.appendChild(panelOpenElm);
    baseElm.appendChild(panelCloseElm);

    var onDocumentScroll = function(){
        //console.log(document.body.scrollTop, (Math.max(100 - document.body.scrollTop, 10)));
        //baseElm.style.top = ''+(Math.max(100 - document.body.scrollTop, 10))+'px';
        var prevTop = parseInt(baseElm.style.top);
        var top = Math.max(100 - document.body.scrollTop, 10);
        var isSticky = top <= 10;
        var state = isSticky?'stick':'inital';
        var transition = 10 == prevTop || 10 == top ? 'all 300ms 0s ease' : '';
        if (!isSticky) {
            applyStyles(baseElm, baseElmStyles[state], {
                    top: ''+top+'px',
                    transition: transition
                });
        }
        else {
            applyStyles(baseElm, baseElmStyles[state], {
                    transition: transition
                });
        }
        applyStyles(panelOpenElm,  panelOpenElmStyles[state]);
        applyStyles(panelCloseElm, panelCloseElmStyles[state]);
        applyStyles(shareElm,      shareElmStyles[state]);
    };
    
    var onSharePanelShow = function () {
        var top = Math.max(100 - document.body.scrollTop, 10);
        var isSticky = top <= 10;
        var state = (isSticky?'stick':'inital')+'Open';
        applyStyles(baseElm, baseElmStyles[state], {
                transition: 'all 300ms 0s ease'
            });
        applyStyles(panelOpenElm,  panelOpenElmStyles[state]);
        applyStyles(panelCloseElm, panelCloseElmStyles[state]);
        applyStyles(shareElm,      shareElmStyles[state]);
    };
    var onSharePanelHide = function () {
        var top = Math.max(100 - document.body.scrollTop, 10);
        var isSticky = top <= 10;
        var state = (isSticky?'stick':'inital');
        applyStyles(baseElm, baseElmStyles[state], {
                top: isSticky ? baseElmStyles.stick.top : ''+top+'px',
                transition: 'all 300ms 0s ease'
            });
        applyStyles(panelOpenElm,  panelOpenElmStyles[state]);
        applyStyles(panelCloseElm, panelCloseElmStyles[state]);
        applyStyles(shareElm,      shareElmStyles[state]);
    };
    var onClick = function () {
        ('none' != panelOpenElm.style.display ? onSharePanelShow : onSharePanelHide)();
    };

    baseElm.addEventListener('click', onClick);

    // Twitter
    var buttonTweet = document.createElement('div');
    buttonTweet.style.cssText = '';
    var buttonTweetA = document.createElement('a');
    (function(data){ for (var k in data) { this.setAttribute(k, data[k]); } }).call(buttonTweetA, {
        href: 'https://twitter.com/share',
        class: 'twitter-share-button',
        'data-url': location.href,
    });
    buttonTweetA.innerHTML = 'Tweet';
    buttonTweet.appendChild(buttonTweetA);
    var buttonTweetScript = document.createElement('script');
    buttonTweetScript.innerHTML = [
        "!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';",
        "if(!d.getElementById(id)){js=d.createElement(s);",
        "js.id=id;",
        "js.src=p+'://platform.twitter.com/widgets.js';",
        "fjs.parentNode.insertBefore(js,fjs);",
        "}}(document, 'script', 'twitter-wjs');"
    ].join('');
    buttonTweet.appendChild(buttonTweetScript);
    shareElm.appendChild(buttonTweet);

    document.body.appendChild(baseElm);

    //buttonTweetA.click();
    //console.log([baseElm]);

    document.addEventListener('scroll', onDocumentScroll);
    onSharePanelHide();
    onDocumentScroll();

})();