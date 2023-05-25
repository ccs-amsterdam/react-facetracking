# Installing WebGazer

npm install webgazer seems to fail.

Instead, build it locally. (You can do this in another folder so you don't include all the install stuff in the current repo)

```
git clone git@github.com:brownhci/WebGazer
npm i
npm run build
npm pack
```

clone the .tgz to this project. Then in package.json use `"webgazer": "file:webgazer-[version].tgz"` to install it from the tgz.
