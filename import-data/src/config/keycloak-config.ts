import {KeycloakConnectOptions} from 'nest-keycloak-connect/interface/keycloak-connect-options.interface';
import { ConfigService } from './config.service';

const configService = new ConfigService();
const KeycloakConfig = new Promise<KeycloakConnectOptions>(async resolve => {
    const keycloakConfig: KeycloakConnectOptions = {
        authServerUrl: configService.get('KEYCLOAK_AUTH_SERVER_URL'),
        realm: configService.get('KEYCLOAK_REALM'),
        clientId:configService.get('KEYCLOAK_CLIENT_ID'),
        secret: configService.get('KEYCLOAK_SECRET')
    };

    resolve(keycloakConfig);
})
export = async () => { return await KeycloakConfig };
