export interface Env {
  DB: D1Database;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    try {
      // Health Check
      if (url.pathname === "/api/health" || url.pathname === "/") {
        let dbStatus = "unknown";
        try {
          const check = await env.DB.prepare("SELECT 1 as alive").first();
          if (check) dbStatus = "connected";
        } catch (e: any) {
          dbStatus = `error: ${e.message}`;
        }

        return jsonResponse({
          service: "travel-agencie",
          status: "healthy",
          timestamp: new Date().toISOString(),
          database: dbStatus,
          routes: [
            "GET /api/packages",
            "GET /api/packages/:id",
            "POST /api/bookings",
            "GET /api/bookings",
            "POST /api/inquiries",
            "GET /api/inquiries",
          ],
        });
      }

      // GET /api/packages
      if (request.method === "GET" && url.pathname === "/api/packages") {
        const search = url.searchParams.get("search");
        const category = url.searchParams.get("category");

        let query = "SELECT * FROM packages WHERE 1=1";
        const params: any[] = [];

        if (category && category !== "All") {
          query += " AND (category LIKE ?)";
          params.push(`%${category}%`);
        }

        if (search) {
          query += " AND (title LIKE ? OR destination LIKE ? OR country LIKE ?)";
          params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        query += " ORDER BY featured DESC, rating DESC";

        const stmt = env.DB.prepare(query);
        const { results } = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all();

        return jsonResponse({ packages: results });
      }

      // GET /api/packages/:id
      if (request.method === "GET" && url.pathname.startsWith("/api/packages/")) {
        const id = url.pathname.split("/")[3];
        const pkg = await env.DB.prepare("SELECT * FROM packages WHERE id = ?").bind(id).first();
        if (!pkg) {
          return jsonResponse({ error: "Package not found" }, 404);
        }
        return jsonResponse({ package: pkg });
      }

      // POST /api/bookings
      if (request.method === "POST" && url.pathname === "/api/bookings") {
        const body: any = await request.json();
        const {
          package_id,
          package_title,
          customer_name,
          customer_email,
          customer_phone = "",
          travel_date,
          travelers_count = 1,
          special_requests = "",
        } = body;

        if (!customer_name || !customer_email || !travel_date) {
          return jsonResponse(
            { error: "Customer name, email, and travel date are required." },
            400
          );
        }

        let pricePerPerson = 1200;
        let finalPackageTitle = package_title || "Custom Itinerary";

        if (package_id) {
          const pkg: any = await env.DB.prepare("SELECT title, price FROM packages WHERE id = ?")
            .bind(package_id)
            .first();
          if (pkg) {
            pricePerPerson = pkg.price;
            finalPackageTitle = pkg.title;
          }
        }

        const count = Number(travelers_count) || 1;
        const totalPrice = pricePerPerson * count;

        const result = await env.DB.prepare(
          `INSERT INTO bookings (
            package_id, package_title, customer_name, customer_email,
            customer_phone, travel_date, travelers_count, special_requests,
            status, total_price
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed', ?)`
        )
          .bind(
            package_id || null,
            finalPackageTitle,
            customer_name,
            customer_email,
            customer_phone,
            travel_date,
            count,
            special_requests,
            totalPrice
          )
          .run();

        return jsonResponse(
          {
            success: true,
            booking_id: result.meta?.last_row_id,
            total_price: totalPrice,
            message: "Booking confirmed successfully with Travel Agencie!",
          },
          201
        );
      }

      // GET /api/bookings
      if (request.method === "GET" && url.pathname === "/api/bookings") {
        const { results } = await env.DB.prepare(
          "SELECT * FROM bookings ORDER BY created_at DESC LIMIT 50"
        ).all();
        return jsonResponse({ bookings: results });
      }

      // POST /api/inquiries
      if (request.method === "POST" && url.pathname === "/api/inquiries") {
        const body: any = await request.json();
        const { name, email, subject = "General Inquiry", message } = body;

        if (!name || !email || !message) {
          return jsonResponse({ error: "Name, email, and message are required." }, 400);
        }

        const result = await env.DB.prepare(
          "INSERT INTO inquiries (name, email, subject, message) VALUES (?, ?, ?, ?)"
        )
          .bind(name, email, subject, message)
          .run();

        return jsonResponse(
          {
            success: true,
            inquiry_id: result.meta?.last_row_id,
            message: "Inquiry received. A travel specialist will contact you shortly.",
          },
          201
        );
      }

      // GET /api/inquiries
      if (request.method === "GET" && url.pathname === "/api/inquiries") {
        const { results } = await env.DB.prepare(
          "SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 50"
        ).all();
        return jsonResponse({ inquiries: results });
      }

      return jsonResponse({ error: "Not Found" }, 404);
    } catch (err: any) {
      return jsonResponse({ error: err.message || "Internal server error" }, 500);
    }
  },
};
