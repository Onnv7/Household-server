import { Role } from '../../common/enum';

export type PayloadToken = {
  id: number;
  email: string;
  role: Role;
};
