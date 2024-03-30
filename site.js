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
        res.render(route.template);
    });
}

app.use((req, res) => {
    res.status(404).render('404.html', { title: 'Page not found' });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
