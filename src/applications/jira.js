import $ from 'jquery';
import Base from './base';

class AppJira extends Base {
    constructor() {
        let app;

        app = {};
        app.name = 'Jira';
        app.css = 'jira.css';
        app.targetList = 'h1, h2, h3, p ,a, ul, iframe, textarea, td, th';
        app.blackList = [];
        app.inputList = 'textarea, input[type=text]';

        super(app);
    }
}

export default AppJira;