import Base from './base';
import $ from 'jquery';

class AppPhabricator extends Base {
    constructor() {
        super();

        this.app.name = 'Phabricator';
        this.app.css = 'phabricator.css';
        this.app.targetList = 'h1, h2, h3, p ,a, ul, ol, td, .mlt.mlb.msr.msl';
        this.app.blackList = [
            '.phui-object-item-list-view',
        ];
        this.app.inputList = 'textarea, input[type=text]';

        this.injectResources();

        console.log('Phabricator Detected!');
    }

    rtl() {
        console.log('rtl');

        $(document).ready(function () {
            // Load textarea Toolbar HTML
            $.get(chrome.extension.getURL('html/textarea-toolbar.html'), function (data) {
                $('.aphront-form-control-textarea').before($(data));

                $('.ykh-phab-toolbar .ykh-icon-buttons .ykh-icon').on('click', function (e) {
                    insertIcon($(this).attr('data-ykh-icon'), $('.ykh-phab-toolbar').parent().find('textarea:first'));
                });

                $('.ykh-phab-toolbar-colors .ykh-icon').on('click', function (e) {
                    let color;

                    $('.ykh-phab-toolbar-colors .ykh-icon.selected').removeClass('selected');
                    $(this).addClass('selected');
                    color = $(this).data('color');
                    $('.ykh-icon-buttons .ykh-icon').removeClass('black blue orange red');
                    $('.ykh-icon-buttons .ykh-icon').addClass(color);
                });
            });
        });

        this.prepareRTLHappy();
    }


    insertIcon(icon, textarea) {
        let markup,
            color = $('.ykh-phab-toolbar-colors .ykh-icon.selected').data('color');

        markup = '{icon ' + icon + ' color=' + color + '}';
        insertAtCaret(textarea, markup);
    }

    insertAtCaret(textareaObj, text) {
        let txtarea = textareaObj;
        let scrollPos = txtarea.scrollTop;
        let strPos = 0;
        let br = ((txtarea.selectionStart || txtarea.selectionStart === '0') ?
            "ff" : (document.selection ? "ie" : false ) );
        let range;

        if (br === "ie") {
            txtarea.focus();
            range = document.selection.createRange();
            range.moveStart('character', -txtarea.value.length);
            strPos = range.text.length;
        }
        else if (br === "ff") strPos = txtarea.selectionStart;

        let front = (txtarea.val()).substring(0, strPos);
        let back = (txtarea.val()).substring(strPos, txtarea.val().length);
        txtarea.val(front + text + back);
        strPos = strPos + text.length;
        if (br === "ie") {
            txtarea.focus();
            range = document.selection.createRange();
            range.moveStart('character', -txtarea.val().length);
            range.moveStart('character', strPos);
            range.moveEnd('character', 0);
            range.select();
        }
        else if (br === "ff") {
            txtarea.selectionStart = strPos;
            txtarea.selectionEnd = strPos;
            txtarea.focus();
        }
        txtarea.scrollTop = scrollPos;
    }
}

export default AppJira;