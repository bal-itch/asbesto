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
function doMusicTmpl() {
    const jsonPath = JSON.parse(fs.readFileSync("./tmpl/midi.json", { encoding: "utf8", flag: "r" }));
    let yeah = "";

    jsonPath.forEach((details, index) => {
        yeah += `<a href="${details.path}">${details.title}`;
        if (details.hasKar) yeah += " (Karaoke)";
        yeah += `</a>\n<br>`;
        if (index + 1 !== Object.keys(jsonPath).length) yeah += `\n`; // Make sure we don't newline at the end
    });
    return (yeah);
}

const routes = [
<<<<<<< Updated upstream
    { path: '/', template: 'index.html', data: { title: 'Home Page' } },
    { path: '/wtv-jukebox', template: 'wtv-jukebox.html', data: { title: 'WebTV Jukebox (for all bf0 users: leave)' } }
=======
    { path: '/', template: 'index.njk', data: { title: 'Home Page' } },
    { path: '/wtv-jukebox', template: 'wtv-jukebox.njk', data: { title: 'WebTV Jukebox (for all bf0 users: leave)', midiContent: doMusicTmpl() } }
>>>>>>> Stashed changes
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