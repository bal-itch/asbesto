require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');

const app = express();

nunjucks.configure('tmpl', {
    autoescape: true,
    express: app
});

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/script', express.static(path.join(__dirname, 'script')));

const routes = [
    { path: '/', template: 'index.html' }
];

for (let route of routes) {
    app.get(route.path, (req, res) => {
        res.render(route.template, { title: route.title });
    });
}

app.use((req, res) => {
    res.status(404).render('404.html', { title: 'Page not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
