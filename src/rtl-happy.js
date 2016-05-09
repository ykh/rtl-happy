var jQuery = require('./vendor/jquery/dist/jquery.js');

(function ($, document) {
    var services = [
            {
                'name': 'Phabricator',
                'urlMatch': [
                    'phabricator',
                    'prj.local'
                ],
                'targetList': 'h1, h2, h3, p ,a, ul, td, .mlt.mlb.msr.msl',
                'blackList': [
                    '.phui-object-item-list-view'
                ],
                'inputList': 'textarea, input[type=text]',
                'css': [
                    'style.phab.css'
                ]
            },
            {
                'name': 'Trello',
                'urlMatch': [
                    'trello'
                ],
                'targetList': 'h1, h2, h3, p ,a, ul, .list-header',
                'blackList': [],
                'inputList': 'textarea, input[type=text]',
                'css': [
                    'style.trello.css'
                ]
            },
            {
                'name': 'BPMS',
                'urlMatch': [
                    '10.10.20.41'
                ],
                'targetList': 'h1, h2, h3, p ,a, ul, .list-header',
                'blackList': [],
                'inputList': 'textarea, input[type=text]',
                'css' : [
                    'style.bpms.css'
                ],
                'js': [

                ]
            }
        ],
        settings = {
            'languages': [
                /[\u0600-\u06FF]/, // Persian, Arabic
                /[\u0590-\u05FF]/ // Hebrew
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
                    //console.log(str + ' is matched!');
                    // ChromeExtension Active Icon
                    /*chrome.runtime.sendMessage({msg: "active-icon"}, function (response) {
                        //console.log(response.sender);
                    });*/
                    // Load Dynamic Resources (js, css) for This Service
                    injectResources(service);
                    //
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
     * Inject css/js Files to Page According to Service
     */
    function injectResources(service) {
        if (!service.css.length) {
            return;
        }

        service.css.forEach(function (file) {
            //console.log(file);
            /*chrome.runtime.sendMessage({'msg': "inject_file", 'file': file}, function (response) {
                //console.log(response.sender);
            });*/
        });
    }

    /**
     *
     */
    function prepareRTLHappy() {
        var style;

        /*var fontface = document.createElement("style");
        fontface.type = "text/css";
        fontface.textContent = "@font-face {" +
            "font-family: 'DroidNaskh';" +
            "src: url('" + chrome.extension.getURL('/vendor/vazir-font/dist/Vazir.eot') + "'); " +
            "src: url('" + chrome.extension.getURL('/vendor/vazir-font/dist/Vazir.eot?#iefix') + "') format('embedded-opentype')," +
            "url('" + chrome.extension.getURL('/vendor/vazir-font/dist/Vazir.woff') + "') format('woff')," +
            "url('" + chrome.extension.getURL('/vendor/vazir-font/dist/Vazir.woff') + "') format('woff')," +
            "url('" + chrome.extension.getURL('/vendor/vazir-font/dist/Vazir.ttf') + "') format('truetype');}";
        document.head.appendChild(fontface);*/

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
})(jQuery, document);

/**
 * Give Phabricator Cute Features
 **/
(function ($, document) {
    $(document).ready(function () {
        // Load textarea Toolbar HTML
        /*$.get(chrome.extension.getURL('html/textarea-toolbar.html'), function(data) {
            $('.aphront-form-control-textarea').before($(data));

            $('.ykh-phab-toolbar .ykh-icon-buttons .ykh-icon').on('click', function (e) {
                insertIcon($(this).attr('data-ykh-icon'), $('.ykh-phab-toolbar').parent().find('textarea:first'));
            });

            $('.ykh-phab-toolbar-colors .ykh-icon').on('click', function (e) {
                var color;

                $('.ykh-phab-toolbar-colors .ykh-icon.selected').removeClass('selected');
                $(this).addClass('selected');
                color = $(this).data('color');
                $('.ykh-icon-buttons .ykh-icon').removeClass('black blue orange red');
                $('.ykh-icon-buttons .ykh-icon').addClass(color);
            });
        });*/

        /**
         *
         * @param icon
         * @param textarea
         */
        function insertIcon(icon, textarea) {
            var markup,
                color = $('.ykh-phab-toolbar-colors .ykh-icon.selected').data('color');

            markup = '{icon ' + icon + ' color=' + color + '}';
            insertAtCaret(textarea, markup);
        }

        /**
         * @param textareaObj
         * @param text
         */
        function insertAtCaret(textareaObj,text) {
            var txtarea = textareaObj;
            var scrollPos = txtarea.scrollTop;
            var strPos = 0;
            var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
                "ff" : (document.selection ? "ie" : false ) );
            var range;

            if (br == "ie") {
                txtarea.focus();
                range = document.selection.createRange();
                range.moveStart ('character', -txtarea.value.length);
                strPos = range.text.length;
            }
            else if (br == "ff") strPos = txtarea.selectionStart;

            var front = (txtarea.val()).substring(0,strPos);
            var back = (txtarea.val()).substring(strPos,txtarea.val().length);
            txtarea.val(front+text+back);
            strPos = strPos + text.length;
            if (br == "ie") {
                txtarea.focus();
                range = document.selection.createRange();
                range.moveStart ('character', -txtarea.val().length);
                range.moveStart ('character', strPos);
                range.moveEnd ('character', 0);
                range.select();
            }
            else if (br == "ff") {
                txtarea.selectionStart = strPos;
                txtarea.selectionEnd = strPos;
                txtarea.focus();
            }
            txtarea.scrollTop = scrollPos;
        }
    });
})(jQuery, document);