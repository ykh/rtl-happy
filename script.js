(function ($, document) {
    var doms = 'h1, h2, h3, p ,a, ul',
        blackList = [
            '.phui-object-item-list-view'
        ],
        inputs = 'textarea, input[type=text]',
        languages = [],
        cssRules = [
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
        ];

    // Persian/Arabic
    languages.push(/[\u0600-\u06FF]/);
    // Hebrew
    languages.push(/[\u0590-\u05FF]/);

    // Join items with ',' as string
    blackList = blackList.join(', ');

    $(document).ready(function () {
        // Inject own css rules to <head>
        style = $('<style type=\'text/css\'>');
        $(cssRules).each(function () {
            style.append('.' + $(this)[0].sign + $(this)[0].css);
        });
        $('head').append(style);

        $(doms).each(function () {
            updateStyle($(this));
        });

        // Update doms style for the first time
        setTimeout(function () {
            $(doms).each(function () {
                updateStyle($(this));
            });
        }, 1000);

        // Update doms style intervally
        setInterval(function () {
            $(doms).each(function () {
                updateStyle($(this));
            });
        }, 1000);
    });

    $('body').on('input blur focus', inputs, function (e) {
        updateStyle($(this));
    });

    function updateStyle(target) {
        var value,
            tagName = target[0].tagName,
            classStr = [];

        // Check black list
        if (target.is(blackList)) {
            return false;
        }

        value = target.text();

        if (target.is('textarea') || target.is('input[type=text]')) {
            value = target.val();
        }

        if (!isMatched(value)) {
            $(cssRules).each(function () {
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

    function isMatched(val) {
        for (var i = 0; i < languages.length; i++) {
            matched = val.match(languages[i]);

            if (matched) {
                return true;
            }
        }

        return false;
    }
})($, document);