
# Firebase admin remote config provider

This is a Firebase admin remote config provider for underflag (feature flag/feature toggle)

## Install

Using npm:

```bash
npm install underflag underflag-firebase-admin
```

Using yarn:

```bash
yarn add underflag underflag-firebase-admin
```

## How to use

Import the underflag and prepare to load data provider

```js
import { Underflag } from "underflag";
import { FirebaseDataProvider } from "underflag-firebase-admin";
import serviceAccount from './service-account.json';

// use data privider
const dataProvider = new FirebaseDataProvider({ app: serviceAccount as any });
const underflag = new Underflag({ dataProvider });
if (await underflag.isOn("feature")) {
    // ...
}
```

_Attention: Do not forget of create firebase account, add remote config params and download service-account.json from firebase console. Load service-account.json in code or use global env ex:_

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/home/user/Downloads/service-account-file.json"
```

Know more on [underflag npm page](https://www.npmjs.com/package/underflag)

### License

[MIT](LICENSE)