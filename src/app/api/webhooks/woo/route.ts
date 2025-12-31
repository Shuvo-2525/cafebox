import { NextResponse } from "next/server";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = req.headers.get("x-wc-webhook-signature");
        const secret = process.env.WOOCOMMERCE_WEBHOOK_SECRET;

        if (!secret || !signature) {
            return NextResponse.json({ error: "Missing secret or signature" }, { status: 401 });
        }

        // Verify Signature
        const hash = crypto
            .createHmac("sha256", secret)
            .update(body)
            .digest("base64");

        if (hash !== signature) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        // Parse payload
        const payload = JSON.parse(body);
        const topic = req.headers.get("x-wc-webhook-topic");

        console.log(`Webhook Received: ${topic}`, payload.id);

        // Update Real-time Trigger
        try {
            const { db } = await import("@/lib/firebase");
            const { doc, setDoc } = await import("firebase/firestore");

            await setDoc(doc(db, "system", "sync"), {
                lastUpdate: Date.now(),
                source: "webhook",
                type: topic
            }, { merge: true });

            console.log("Real-time trigger updated");
        } catch (fbError) {
            console.error("Firebase Trigger Failed:", fbError);
            // Don't fail the webhook response just because FB failed
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Webhook Error", error);
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }
}
