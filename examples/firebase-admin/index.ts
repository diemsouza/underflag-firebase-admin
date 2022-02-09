import { Underflag, isOn } from 'underflag';
import { FirebaseDataProvider } from '../../src/providers/FirebaseDataProvider';
import config from './config.json';
import serviceAccount from './service-account.json';

const print = async (underflag: Underflag, key: string) => {
    const data = await underflag.getFeature(key);
    return {
        key,
        status: isOn(data) ? 'on' : 'off',
        value: data?.value,
        origin: data?.origin
    };
};

(async () => {
    // use data privider
    const dataProvider = new FirebaseDataProvider({ app: serviceAccount as any });
    const underflag = new Underflag({ dataProvider });

    // check flags
    const list: any[] = [];
    for (const key of config.features) {
        list.push(await print(underflag, key));
    }
    list.push(await print(underflag, 'other'));
    console.table(list);
})();