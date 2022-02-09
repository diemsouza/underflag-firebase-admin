import { IDataProvider, Feature } from 'underflag';
import * as admin from 'firebase-admin';
import { RemoteConfigTemplate } from 'firebase-admin/lib/remote-config/remote-config-api';
import { RemoteConfig } from 'firebase-admin/lib/remote-config/remote-config';
import { applicationDefault } from 'firebase-admin/app';

interface Options {
    app?: admin.app.App | admin.ServiceAccount
}

function instanceOfApp(object: any) {
    return !!object.remoteConfig;
}

export class FirebaseDataProvider implements IDataProvider {
    private params: Feature[] = [];
    private remoteConfig: RemoteConfig;

    constructor(options?: Options) {
        let app: admin.app.App;
        if (options && instanceOfApp(options.app)) {
            app = options.app as admin.app.App;
        } else if (options && options.app) {
            app = admin.initializeApp({
                credential: admin.credential.cert(options.app as any)
            });
        } else {
            app = admin.initializeApp({
                credential: applicationDefault()
            });
        }
        this.remoteConfig = app.remoteConfig();
    }

    private parseValue(valueType: string, value: any): any {
        try {
            switch (valueType) {
                case 'BOOLEAN':
                    return value === 'true';
                case 'NUMBER':
                    return parseInt(value);
                case 'JSON':
                    return JSON.parse(value);
                case 'STRING':
                default:
                    return String(value);
            }
        } catch (err) {
            return null;
        }
    }

    private mapTemplate(template: RemoteConfigTemplate): Feature[] {
        if (!template || !template.parameters) return [];
        const keys = Object.keys(template.parameters);
        const items: Feature[] = [];
        keys.forEach(key => {
            const { valueType, defaultValue, description } = template.parameters[key];
            if (valueType && defaultValue) {
                const _defaultValue = defaultValue as any;
                const value = this.parseValue(valueType, _defaultValue.value);
                items.push({ key, value, description });
            }
        });
        return items;
    }

    async getAll(): Promise<Feature[]> {
        const template: RemoteConfigTemplate = await this.remoteConfig.getTemplate();
        this.params = this.mapTemplate(template);
        return this.params;
    }

    async get(key: string): Promise<Feature | undefined> {
        if (!this.params.length) {
            this.params = await this.getAll();
        }
        const dataResult = this.params.find(a => a.key === key);
        if (!dataResult) return undefined;
        return dataResult;
    }
}