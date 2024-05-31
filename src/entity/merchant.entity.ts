import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../common/enum';

@Entity({ name: 'merchant' })
export class MerchantEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'role', type: 'enum', enum: Role })
  role: Role;

  @Column({ name: 'username', unique: true })
  username: string;

  @Column({ name: 'password' })
  password: string;
}
