import router from './src/routes/vocabulary.route.ts';
console.log(router.stack.filter((layer:any) => layer.route).map((layer:any) => ({ path: layer.route.path, methods: Object.keys(layer.route.methods)})));
