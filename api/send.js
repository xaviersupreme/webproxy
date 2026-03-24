const rateLimit = new Map();

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).end();
    }

    const WEBHOOK = process.env.WEBHOOK_URL;
    const SECRET = process.env.SECRET;

    if (SECRET && req.headers.authorization !== SECRET) {
        return res.status(403).end();
    }

    const ip = req.headers["x-forwarded-for"] || "unknown";
    const now = Date.now();

    if (rateLimit.has(ip)) {
        const last = rateLimit.get(ip);
        if (now - last < 2000) {
            return res.status(429).end();
        }
    }

    rateLimit.set(ip, now);

    try {
        const body = req.body;

        if (!body || typeof body !== "object") {
            return res.status(400).end();
        }

        await fetch(WEBHOOK, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        return res.status(200).end();
    } catch {
        return res.status(500).end();
    }
}
