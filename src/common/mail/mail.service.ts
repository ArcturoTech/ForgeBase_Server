import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

type MailgunClient = ReturnType<InstanceType<typeof Mailgun>['client']>;

export type OrganizationInviteEmail = {
  to: string;
  orgName: string;
  inviterName: string;
  acceptUrl: string;
  role: string;
};

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private client: MailgunClient | null = null;
  private domain = '';
  private from = '';

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    const apiKey = this.config.get<string>('mail.apiKey');
    this.domain = this.config.get<string>('mail.domain') ?? '';
    this.from = this.config.get<string>('mail.from') ?? `ForgeBase <no-reply@${this.domain}>`;

    if (!apiKey || !this.domain) {
      this.logger.warn(
        'Mailgun não configurado (MAILGUN_API_KEY/MAILGUN_DOMAIN ausentes). E-mails serão apenas logados.',
      );
      return;
    }

    const mailgun = new Mailgun(formData);
    this.client = mailgun.client({ username: 'api', key: apiKey });
  }

  async sendOrganizationInvite(input: OrganizationInviteEmail): Promise<void> {
    const subject = `Você foi convidado para ${input.orgName} no ForgeBase`;
    const html = this.buildInviteHtml(input);

    if (!this.client) {
      this.logger.log(`[DEV] Convite para ${input.to} → ${input.acceptUrl}`);
      return;
    }

    try {
      await this.client.messages.create(this.domain, {
        from: this.from,
        to: [input.to],
        subject,
        html,
      });
    } catch (error) {
      this.logger.error(`Falha ao enviar convite para ${input.to}`, error as Error);
    }
  }

  private buildInviteHtml(input: OrganizationInviteEmail): string {
    return `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Convite para ${input.orgName}</h2>
        <p>${input.inviterName} convidou você para participar da organização
        <strong>${input.orgName}</strong> no ForgeBase como <strong>${input.role}</strong>.</p>
        <p>
          <a href="${input.acceptUrl}"
             style="display:inline-block;padding:12px 20px;background:#FF6B5E;color:#fff;
                    border-radius:8px;text-decoration:none;font-weight:600;">
            Aceitar convite
          </a>
        </p>
        <p style="color:#888;font-size:13px;">Se você não tem uma conta, poderá criar uma e o
        convite será aceito automaticamente. Este link expira em 7 dias.</p>
      </div>
    `;
  }
}
