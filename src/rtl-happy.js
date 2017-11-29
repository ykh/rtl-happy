import $ from 'jquery';

import appJira from './applications/jira';
import './assets/styles/style.scss';

const applications = [
    {
        name: 'Jira',
        patterns: [
            'jira.'
        ],
    },
    {
        name: 'Trello',
        patterns: [
            'trello.'
        ],
    },
    {
        name: 'Phabricator',
        patterns: [
            'phabricator.'
        ],
    },
];

const config = {
    'languages': [
        /[\u0600-\u06FF]/, // Persian, Arabic
        /[\u0590-\u05FF]/ // Hebrew
    ],
    currentUrl: window.location.href,
    currentService: '',
};

class RTLHappy {
    detect() {
        let detectedApp;

        detectedApp = null;

        for (let index in applications) {
            let current;

            if (!applications.hasOwnProperty(index)) {
                continue;
            }

            current = applications[index];

            for (let patternIndex in current.patterns) {
                let pattern;

                if (!current.patterns.hasOwnProperty(patternIndex)) {
                    continue;
                }

                pattern = current.patterns[patternIndex];

                if (config.currentUrl.indexOf(pattern) > -1) {
                    // ChromeExtension Active Icon.
                    chrome.runtime.sendMessage({msg: "active_icon"}, function (response) {
                        console.log(response.sender);
                    });

                    // Load Dynamic Resources (js, css) for This Service.
                    //injectResources(app);

                    detectedApp = current;

                    break;
                }
            }
        }

        if (!detectedApp) {
            return false;
        }

        switch (detectedApp.name) {
            case 'Jira':
                return new appJira();
                break
        }

        return false;
    }
}

$(document).ready(() => {
    let rtlHappy;
    let app;

    rtlHappy = new RTLHappy();

    if (app = rtlHappy.detect()) {
        app.rtl();
    }
});
