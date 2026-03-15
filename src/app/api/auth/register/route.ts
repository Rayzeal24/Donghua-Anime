import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";

async function sendWelcomeEmail(email: string, name: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"DonghuaStream" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Bienvenue sur DonghuaStream !",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #e5e5e5; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #7c3aed, #6d28d9); padding: 32px; text-align: center;">
            <h1 style="margin: 0; color: white; font-size: 28px;">DonghuaStream</h1>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #e5e5e5; margin-top: 0;">Bienvenue ${name} !</h2>
            <p style="color: #a3a3a3; line-height: 1.6;">
              Votre compte a été créé avec succès. Vous pouvez dès maintenant profiter de toutes
              les fonctionnalités de DonghuaStream :
            </p>
            <ul style="color: #a3a3a3; line-height: 2;">
              <li>Parcourir notre catalogue de donghua</li>
              <li>Ajouter des titres à vos favoris</li>
              <li>Reprendre votre lecture là où vous l'avez laissée</li>
              <li>Suivre votre historique de visionnage</li>
            </ul>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${process.env.AUTH_URL}" style="background: #7c3aed; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                Commencer à regarder
              </a>
            </div>
            <hr style="border: 1px solid #262626; margin: 24px 0;" />
            <p style="color: #737373; font-size: 12px; text-align: center;">
              Vous recevez cet email car un compte a été créé avec cette adresse sur DonghuaStream.
              Si vous n'êtes pas à l'origine de cette inscription, vous pouvez ignorer cet email.
            </p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Welcome email error:", error);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 409 }
      );
    }

    const existingName = await prisma.user.findFirst({
      where: { name: { equals: parsed.data.name, mode: "insensitive" } },
    });

    if (existingName) {
      return NextResponse.json(
        { error: "Ce nom d'utilisateur est déjà pris" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(parsed.data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        hashedPassword,
      },
    });

    sendWelcomeEmail(user.email, user.name || parsed.data.name);

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
