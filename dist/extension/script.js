var style,
    fontface;

fontface = document.createElement("style");
fontface.type = "text/css";
fontface.textContent = "@font-face {" +
"font-family: 'DroidNaskh';" +
"src: url('" + chrome.extension.getURL('/vendor/vazir-font/dist/Vazir.eot') + "'); " +
"src: url('" + chrome.extension.getURL('/vendor/vazir-font/dist/Vazir.eot?#iefix') + "') format('embedded-opentype')," +
"url('" + chrome.extension.getURL('/vendor/vazir-font/dist/Vazir.woff') + "') format('woff')," +
"url('" + chrome.extension.getURL('/vendor/vazir-font/dist/Vazir.woff') + "') format('woff')," +
"url('" + chrome.extension.getURL('/vendor/vazir-font/dist/Vazir.ttf') + "') format('truetype');}";

document.head.appendChild(fontface);