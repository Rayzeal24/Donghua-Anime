import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const CONTACT_EMAIL = "donghuanime17@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Adresse email invalide." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"DonghuaStream Contact" <${process.env.GMAIL_USER}>`,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `[DonghuaStream] ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Nouveau message de contact</h2>
          <hr style="border: 1px solid #e5e7eb;" />
          <p><strong>Nom :</strong> ${name}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Sujet :</strong> ${subject}</p>
          <hr style="border: 1px solid #e5e7eb;" />
          <h3>Message :</h3>
          <p style="white-space: pre-wrap; background: #f9fafb; padding: 16px; border-radius: 8px;">${message}</p>
          <hr style="border: 1px solid #e5e7eb;" />
          <p style="color: #9ca3af; font-size: 12px;">Envoyé depuis le formulaire de contact DonghuaStream</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message." },
      { status: 500 }
    );
  }
}
