import $ from 'jquery';

const settings = {
    languages: [
        /[\u0600-\u06FF]/, // Persian, Arabic
        /[\u0590-\u05FF]/ // Hebrew
    ],
    currentUrl: window.location.href,
    currentService: ''
};

class Base {
    constructor() {
        this.app = {
            name: '',
            css: '',
            targetList: '',
            blackList: '',
            inputList: '',
        };

        Object.seal(this.app);
    }

    rtl() {
        throw new TypeError('This Is Abstract Class! Implement It.');
    }

    injectResources($parent) {
        let path;

        path = 'css/' + this.app.css;

        if ($parent) {
            let fileUrl;
            let $link;
            let id;

            id = 'css-' + $parent.attr('id');

            if ($parent.find('#' + id).length > 0) {
                return;
            }

            fileUrl = chrome.extension.getURL(path);

            $link = $('<link>');
            $link.attr({
                rel: 'stylesheet',
                type: 'text/css',
                href: fileUrl,
                id: id,
            });

            $parent.find('head').append($link);

            return;
        }

        chrome.runtime.sendMessage({
            msg: 'file_injected',
            file: 'css/' + this.app.css,
        }, (response) => {
            console.log(arguments);
        });
    }

    prepareRTLHappy(targetList, $parent) {
        let $targets;

        if ($parent) {
            $targets = $parent.find(targetList);
        } else {
            $targets = $(targetList);
        }

        $targets.each((index, el) => {
            this.updateStyle($(el));
        });

        // Update doms style on any kind of data entry
        $('body').on('input blur focus', this.app.inputList, (e) => {
            this.updateStyle($(e.target));
        });
    }

    updateStyle($target) {
        let value;
        let tagName;
        let blackList;

        tagName = $target[0].tagName;
        blackList = this.app.blackList;

        if (blackList.length > 0) {
            blackList = blackList.join(', ');
        }

        // Check black list
        if ($target.is(blackList)) {
            return false;
        }

        value = $target.text();

        if ($target.is('textarea') || $target.is('input[type=text]')) {
            value = $target.val();
        }

        if ($target.is('iframe')) {
            let $iframe;

            $iframe = $($target.contents());
            this.injectResources($iframe);
            this.prepareRTLHappy(this.app.targetList, $iframe);

            setInterval(() => {
                this.prepareRTLHappy(this.app.targetList, $($target.contents()));
            }, 1000);
        }

        if (!Base.isMatched(value)) {
            $(settings.cssRules).each((index, el) => {
                $target.removeClass($(el).sign);
            });

            return false;
        }

        $target.addClass('ykh-rtl');
        $target.addClass('ykh-right');

        if (tagName === 'UL') {
            $target.addClass('ykh-pr1');
        }

        if ($target.is('a') || tagName === 'H1' || tagName === 'H2' || tagName === 'H3') {
            $target.addClass('ykh-ubd');
        }
    }

    static isMatched(val) {
        let matched;

        for (let i = 0; i < settings.languages.length; i++) {
            matched = val.match(settings.languages[i]);

            if (matched) {
                return true;
            }
        }

        return false;
    }
}

export default Base;