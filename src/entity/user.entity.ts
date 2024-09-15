import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Gender, Role } from '../common/enum';
import { OrderBillEntity } from './order/order-bill.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'role',
    type: 'enum',
    enum: Role,
  })
  role: Role;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'avatarUrl', nullable: true })
  avatarUrl: string;

  @Column({ name: 'gender', type: 'enum', enum: Gender, default: Gender.MALE.toString() })
  gender: Gender;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  // @Column({ name: 'phone_number', nullable: true })
  // phoneNumber: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // =================================================================
  @OneToMany(() => OrderBillEntity, (orderBill) => orderBill.user)
  orderBillList: OrderBillEntity[];
}
