import { DataSource, Repository } from 'typeorm';
import { EmailVerificationEntity } from '../entity/email-verification.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailVerificationRepository extends Repository<EmailVerificationEntity> {
  constructor(private dataSource: DataSource) {
    super(EmailVerificationEntity, dataSource.createEntityManager());
  }
}
