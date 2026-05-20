import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY ?? "");
  }
  return _resend;
}

export async function sendWaitlistConfirmation(email: string, name: string): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.warn("Resend not configured — skipping confirmation email");
    return;
  }

  try {
    await getResend().emails.send({
      from: "VenturePilot OS <hello@venturepilot.ai>",
      to: email,
      subject: "You're on the list — VenturePilot OS",
      html: `
        <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;background:#ffffff;">
          <div style="margin-bottom:32px;">
            <span style="font-size:18px;font-weight:800;color:#0A0A0F;">VenturePilot </span>
            <span style="font-size:18px;font-weight:800;color:#00C9A7;">OS</span>
          </div>

          <h1 style="font-size:28px;font-weight:800;color:#0A0A0F;margin-bottom:12px;line-height:1.2;">
            You're on the list, ${name}.
          </h1>

          <p style="font-size:16px;color:#64748B;line-height:1.7;margin-bottom:32px;">
            We're onboarding 50 teams this month. We'll review your application and reach out within 24 hours with your early access invite.
          </p>

          <div style="background:#F0FFFE;border-radius:12px;border-left:4px solid #00C9A7;padding:24px;margin-bottom:32px;">
            <p style="font-size:14px;font-weight:700;color:#0A0A0F;margin:0 0 16px;">
              While you wait — here's what happens when you get access:
            </p>
            <table cellpadding="0" cellspacing="0" style="width:100%;">
              ${[
                "Set up your Founder Context profile in 60 seconds",
                "DeepSearch runs your first live market scan",
                "See 3 venture paths with full evidence scoring",
                "Your Project HUB execution board gets generated",
                "Your Adaptive Venture Twin goes live and starts monitoring",
              ]
                .map(
                  (item) => `
                <tr>
                  <td style="padding:4px 0;vertical-align:top;width:20px;">
                    <span style="color:#00C9A7;font-weight:700;">✓</span>
                  </td>
                  <td style="padding:4px 0 4px 8px;font-size:14px;color:#334155;line-height:1.5;">
                    ${item}
                  </td>
                </tr>`
                )
                .join("")}
            </table>
          </div>

          <p style="font-size:14px;color:#64748B;margin-bottom:8px;">
            Questions? Reply to this email. We read every one.
          </p>
          <p style="font-size:14px;color:#64748B;">
            — The VenturePilot OS Team
          </p>

          <div style="margin-top:40px;padding-top:24px;border-top:1px solid #E2E8F0;">
            <p style="font-size:12px;color:#94A3B8;margin:0;">
              From intelligence to execution, in one adaptive engine.
            </p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    // Silent fail — email must never crash the waitlist signup
    console.error("Email send error:", error);
  }
}
