require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');

const app = express();

nunjucks.configure('tmpl', {
    autoescape: false,
    express: app
});

if (process.env.LOGGING === 'true') {
    app.use(morgan('combined'));
}

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/script', express.static(path.join(__dirname, 'script')));

// Belongs to jukebox
function doMusicTmpl(format) {
    const jsonPath = JSON.parse(fs.readFileSync("./json/jukebox.json", { encoding: "utf8", flag: "r" }));
    let yeah = "";
    // this is fucking terrifying but it's the only way i can think of to get this to work properly right now
    jsonPath.forEach((details, index) => {
        if (details.format === format) {
            yeah += `<a href="static/audio/${format}/${details.path}">${details.title}`;
            if (details.hasKar || details.path.includes(".kar")) yeah += " (Karaoke)"; // Defining hasKar for .kar files is no longer required
            yeah += `</a>\n<br>`;
            if (index + 1 !== Object.keys(jsonPath).length) yeah += `\n`; // Make sure we don't newline at the end
        }
    });
    return (yeah);
}

const routes = [
    { path: '/', template: 'index.njk', data: { title: 'Home Page' } },
    { path: '/wtv-jukebox', template: 'wtv-jukebox.njk', data: { title: 'WebTV Jukebox (for all bf0 users: leave)', midiContent: doMusicTmpl('midi'), modContent: doMusicTmpl('mod'), s3mContent: doMusicTmpl('s3m'), xmContent: doMusicTmpl('xm') } }
];

for (let route of routes) {
    app.get(route.path, (req, res) => {
        res.render(route.template, route.data);
    });
}

app.use((req, res) => {
    res.status(404).render('404.njk', { title: 'Page not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});