$(document).ready(function () {
    var settings = {};

    if (localStorage.getItem('settings')) {
        settings = JSON.parse(localStorage.getItem('settings'));
    } else {
        // Default Settings
        settings = {
            'extActive': true,
            'appsActive': {
                'phabricator': true,
                'trello': true,
                'bpms': true
            }
        };
        localStorage.setItem('settings', JSON.stringify(settings));
    }

    // Apply settings to Forms
    $('#bpms-active').prop('checked', settings.appsActive.bpms);
    $('#phab-active').prop('checked', settings.appsActive.phabricator);
    $('#trello-active').prop('checked', settings.appsActive.trello);

    // Save Settings
    $('#save-button').on('click', function (e) {

        settings.appsActive.bpms = $('#bpms-active').prop('checked');
        settings.appsActive.phabricator = $('#phab-active').prop('checked');
        settings.appsActive.trello = $('#trello-active').prop('checked');

        localStorage.setItem('settings', JSON.stringify(settings));
    });
});