# hsl_backend

Demo backend for demoing HSL open data. App registers to HSL mqtt service bus and listens tram positions. It sends the data via socket connection. 

Install node.

Install packages
```sh
npm i
```

Start app
```sh
node src/index.js
```

When working properly, you should see message
>listening on *:3000
>connected /hfp/v2/journey/ongoing/vp/tram/+/+/+/+/+/+/+/+/#
