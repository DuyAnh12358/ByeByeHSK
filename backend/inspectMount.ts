import express from 'express';
import router from './src/routes/vocabulary.route.ts';
const app = express();
app.use('/api/vocabularies', router);
console.log('hasRouter', !!app._router);
console.log('routerKeys', app._router ? Object.keys(app._router) : null);
console.log('stack length', app._router?.stack?.length);
console.log(app._router?.stack?.map((layer:any) => ({ path: layer.route?.path, methods: layer.route ? Object.keys(layer.route.methods) : null, type: layer.name })));
