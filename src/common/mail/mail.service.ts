import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';

export type OrganizationInviteEmail = {
  to: string;
  orgName: string;
  inviterName: string;
  acceptUrl: string;
  role: string;
};

export type PasswordResetEmail = {
  to: string;
  resetUrl: string;
};

export type EmailVerificationEmail = {
  to: string;
  code: string;
};

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private client: SESClient | null = null;
  private from = '';

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    const region = this.config.get<string>('mail.region');
    const accessKeyId = this.config.get<string>('mail.accessKeyId');
    const secretAccessKey = this.config.get<string>('mail.secretAccessKey');
    this.from = this.config.get<string>('mail.from') ?? '';

    if (!region || !accessKeyId || !secretAccessKey || !this.from) {
      this.logger.warn(
        'AWS SES não configurado (AWS_SES_REGION/AWS_SES_ACCESS_KEY_ID/AWS_SES_SECRET_ACCESS_KEY/MAIL_FROM ausentes). E-mails serão apenas logados.',
      );
      return;
    }

    this.client = new SESClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  async sendOrganizationInvite(input: OrganizationInviteEmail): Promise<void> {
    await this.sendEmail({
      to: input.to,
      subject: `Você foi convidado para ${input.orgName} no Entur-Forge`,
      html: this.wrap(
        `<h2 style="margin:0 0 12px">Convite para ${input.orgName}</h2>
         <p>${input.inviterName} convidou você para participar da organização
         <strong>${input.orgName}</strong> no Entur-Forge como <strong>${input.role}</strong>.</p>
         ${this.button(input.acceptUrl, 'Aceitar convite')}
         <p style="color:#888;font-size:13px;">Se você não tem uma conta, poderá criar uma ao aceitar. Este link expira em 7 dias.</p>`,
      ),
    });
  }

  async sendPasswordReset(input: PasswordResetEmail): Promise<void> {
    await this.sendEmail({
      to: input.to,
      subject: 'Redefinir sua senha do Entur-Forge',
      html: this.wrap(
        `<h2 style="margin:0 0 12px">Redefinir senha</h2>
         <p>Recebemos um pedido para redefinir a senha da sua conta no Entur-Forge.</p>
         ${this.button(input.resetUrl, 'Criar nova senha')}
         <p style="color:#888;font-size:13px;">Se não foi você, ignore este e-mail. Este link expira em 30 minutos.</p>`,
      ),
    });
  }

  async sendEmailVerification(input: EmailVerificationEmail): Promise<void> {
    await this.sendEmail({
      to: input.to,
      subject: 'Seu código de verificação do Entur-Forge',
      html: this.wrap(
        `<h2 style="margin:0 0 12px">Confirme seu e-mail</h2>
         <p>Use o código abaixo para verificar sua conta no Entur-Forge:</p>
         <p style="font-size:30px;font-weight:700;letter-spacing:6px;margin:16px 0;color:#FF6B5E;">${input.code}</p>
         <p style="color:#888;font-size:13px;">O código expira em 15 minutos.</p>`,
      ),
    });
  }

  private async sendEmail(params: SendEmailParams): Promise<void> {
    if (!this.client) {
      this.logger.log(`[DEV] E-mail para ${params.to} · ${params.subject}`);
      return;
    }

    try {
      await this.client.send(
        new SendEmailCommand({
          Source: this.from,
          Destination: { ToAddresses: [params.to] },
          Message: {
            Subject: { Data: params.subject, Charset: 'UTF-8' },
            Body: { Html: { Data: params.html, Charset: 'UTF-8' } },
          },
        }),
      );
    } catch (error) {
      this.logger.error(`Falha ao enviar e-mail para ${params.to}`, error as Error);
    }
  }

  private wrap(content: string): string {
    return `<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color:#222;">${content}</div>`;
  }

  private button(url: string, label: string): string {
    return `<p>
      <a href="${url}" style="display:inline-block;padding:12px 20px;background:#FF6B5E;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">${label}</a>
    </p>`;
  }
}
