export type ZaloLoginModel = {
  access_token: string;
  refresh_token_expires_in: string;
  refresh_token: string;
  expires_in: string;
};

export type UserInfoModel = {
  is_sensitive: boolean;
  name: string;
  id: string;
  error: number;
  message: string;
  picture: {
    data: {
      url: string;
    };
  };
};
