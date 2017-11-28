import $ from 'jquery';
import Base from './base';

class AppJira extends Base {
    constructor() {
        super();

        this.app.name = 'Jira';
        this.app.css = 'jira.css';
        this.app.targetList = 'h1, h2, h3, p ,a, ul, iframe, textarea, td, th';
        this.app.blackList = [];
        this.app.inputList = 'textarea, input[type=text]';

        this.injectResources();

        console.log('Jira Detected!');
    }

    rtl() {
        console.log('rtl');

        this.prepareRTLHappy(this.app.targetList);

        setInterval(() => {
            this.prepareRTLHappy(this.app.targetList);
        }, 1000);
    }
}

export default AppJira;