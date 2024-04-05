require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const morgan = require('morgan');

const app = express();

nunjucks.configure('tmpl', {
    autoescape: true,
    express: app
});

if (process.env.LOGGING === 'true') {
    app.use(morgan('combined'));
}

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/script', express.static(path.join(__dirname, 'script')));

const routes = [
    { path: '/', template: 'index.html', data: { title: 'Home Page' } },
    { path: '/wtv-jukebox', template: 'wtv-jukebox.html', data: { title: 'Welcome to WebTV Jukebox (for all bf0 users: leave)' } }
];

for (let route of routes) {
    app.get(route.path, (req, res) => {
        res.render(route.template, route.data);
    });
}

app.use((req, res) => {
    res.status(404).render('404.html', { title: 'Page not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
