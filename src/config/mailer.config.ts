import { HandlebarsAdapter, MailerOptions } from '@nest-modules/mailer';
import { MailerAsyncOptions } from '@nest-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { strict } from 'assert';
import { join } from 'path';
import { config } from 'process';

export default class MailerConfig {
  static getConfig(): MailerOptions {
    return {
      transport: {
        host: process.env.MAIL_HOST,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"No Reply " <${process.env.MAIL_FROM}>`,
      },
      template: {
        dir: join(__dirname, './../templates/email'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  }
}

export const mailerAsyncOptions: MailerAsyncOptions = {
  useFactory: async (configService: ConfigService): Promise<MailerOptions> => MailerConfig.getConfig(),
};
