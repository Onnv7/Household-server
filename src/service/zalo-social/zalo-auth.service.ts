import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { env } from '../../config/env-configuration.config';
import { UserInfoModel, ZaloLoginModel } from './zalo.model';

@Injectable()
export class ZaloAuthService {
  static AUTH_URL = 'https://oauth.zaloapp.com/v4/access_token';
  static GET_INFO_URL = 'https://graph.zalo.me/v2.0/me?fields=id,name,picture,phone';
  async loginZalo(code: string, codeVerifier: string) {
    const responseData = await axios.post(
      ZaloAuthService.AUTH_URL,
      {
        code: code,
        code_verifier: codeVerifier,
        grant_type: 'authorization_code',
        app_id: env.APP_ID_ZALO,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          secret_key: env.SECRET_KEY_ZALO,
        },
      },
    );
    const data: ZaloLoginModel = responseData.data;
    console.log('🚀 ~ ZaloAuthService ~ loginZalo ~ responseData:', data);
    return data;
  }

  async getUserInformation(accessToken: string) {
    const responseData = await axios.get(ZaloAuthService.GET_INFO_URL, {
      headers: {
        access_token: accessToken,
      },
    });
    const data: UserInfoModel = responseData.data;
    console.log('🚀 ~ ZaloAuthService ~ getUserInformation ~ data:', data);
    return data;
  }
}
