export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const WEBHOOK = process.env.WEBHOOK_URL;
    const SECRET = process.env.SECRET;

    if (req.headers.authorization !== SECRET) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    try {
        const body = req.body;

        await fetch(WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        return res.status(200).json({ success: true });
    } catch (err) {
        return res.status(500).json({ error: "Failed to send" });
    }
}
