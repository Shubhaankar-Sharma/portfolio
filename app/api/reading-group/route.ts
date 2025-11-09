import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    console.log(`New reading group signup: ${email} at ${timestamp}`);

    // Send email notification via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Reading Group <hello@reading.spongeboi.com>',
            to: 'hi@spongeboi.com',
            subject: 'New Reading Group Signup',
            html: `<p><strong>${email}</strong> signed up for the reading group at ${timestamp}</p>`
          })
        });

        const data = await response.json();
        console.log('Resend response:', data);

        if (!response.ok) {
          console.error('Resend API error:', data);
        }
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing email:', error);
    return NextResponse.json(
      { error: 'Failed to process email' },
      { status: 500 }
    );
  }
}
