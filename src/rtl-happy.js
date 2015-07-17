/*!
 * RTL-Happy jQuery Based User-Script
 * It Makes RTL-Support Client-Side Solution for Web Based Services/Applications
 * https://github.com/ykh/rtl-happy
 *
 * Copyright 2015 - YaserKH.ir
 * Released under the MIT license
 * https://github.com/ykh/rtl-happy/LICENSE.md
 *
 * Date: 2015-07-18
 */
var $ = require('../bower_components/jquery/dist/jquery.js');

(function ($, document) {
    var services = [
            {
                'name': 'Phabricator',
                'urlMatch': [
                    'phabricator'
                ],
                'targetList': 'h1, h2, h3, p ,a, ul, td',
                'blackList': [
                    '.phui-object-item-list-view'
                ],
                'inputList': 'textarea, input[type=text]'
            },
            {
                'name': 'Trello',
                'urlMatch': [
                    'trello'
                ],
                'targetList': 'h1, h2, h3, p ,a, ul, .list-header',
                'blackList': [],
                'inputList': 'textarea, input[type=text]'
            }
        ],
        settings = {
            'languages': [
                /[\u0600-\u06FF]/, // Persian, Arabic
                /[\u0590-\u05FF]/ // Hebrew
            ],
            'cssRules': [
                {
                    'sign': 'ykh-rtl',
                    'css': '{direction:rtl;}'
                },
                {
                    'sign': 'ykh-right',
                    'css': '{text-align:right;}'
                },
                {
                    'sign': 'ykh-ubd',
                    'css': '{unicode-bidi:embed;}'
                },
                {
                    'sign': 'ykh-pr1',
                    'css': '{padding-right:20px;}'
                }
            ],
            currentUrl: window.location.href,
            currentService: ''
        };

    $(document).ready(function () {
        // Figure Out Service Name
        services.forEach(function (service) {
            if ('' !== settings.currentService) {
                return true;
            }

            service.urlMatch.forEach(function (str) {
                if (settings.currentUrl.indexOf(str) > -1) {
                    console.log(str + ' is matched!');
                    settings.currentService = service;
                    return true;
                }

                return false;
            });
        });
        // Check Service is Defined
        if ('' === settings.currentService) {
            return false;
        }

        // Prepare to Apply Changes
        prepareRTLHappy();
    });

    /**
     *
     */
    function prepareRTLHappy() {
        var style;

        // Inject own css rules to <head>
        style = $('<style type=\'text/css\'>');
        $(settings.cssRules).each(function () {
            style.append('.' + $(this)[0].sign + $(this)[0].css);
        });
        $('head').append(style);

        //
        $(settings.currentService.targetList).each(function () {
            updateStyle($(this));
        });

        // Update doms style for the first time
        setTimeout(function () {
            $(settings.currentService.targetList).each(function () {
                updateStyle($(this));
            });
        }, 1000);

        // Update doms style intervally
        setInterval(function () {
            $(settings.currentService.targetList).each(function () {
                updateStyle($(this));
            });
        }, 1000);

        // Update doms style on any kind of data entry
        $('body').on('input blur focus', settings.currentService.inputList, function (e) {
            updateStyle($(this));
        });
    }

    /**
     *
     * @param target
     * @returns {boolean}
     */
    function updateStyle(target) {
        var value,
            tagName = target[0].tagName,
            blackList = settings.currentService.blackList;

        if (0 < blackList.length) {
            blackList = blackList.join(', ');
        }

        // Check black list
        if (target.is(blackList)) {
            return false;
        }

        value = target.text();

        if (target.is('textarea') || target.is('input[type=text]')) {
            value = target.val();
        }

        if (!isMatched(value)) {
            $(settings.cssRules).each(function () {
                target.removeClass($(this).sign);
            });

            return false;
        }
        target.addClass('ykh-rtl');
        target.addClass('ykh-right');

        if (tagName === 'UL') {
            target.addClass('ykh-pr1');
        }

        if (target.is('a') || tagName === 'H1' || tagName === 'H2' || tagName === 'H3') {
            target.addClass('ykh-ubd');
        }
    }

    /**
     *
     * @param val
     * @returns {boolean}
     */
    function isMatched(val) {
        var matched;

        for (var i = 0; i < settings.languages.length; i++) {
            matched = val.match(settings.languages[i]);

            if (matched) {
                return true;
            }
        }

        return false;
    }
})($, document);