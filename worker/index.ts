export interface Env {
  DB: D1Database;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
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
          service: "travel-agencie-south-india",
          status: "healthy",
          timestamp: new Date().toISOString(),
          database: dbStatus,
          focus: "Tamil Nadu, Kerala, Karnataka",
        });
      }

      // ================= VEHICLES API =================
      // GET /api/vehicles
      if (request.method === "GET" && url.pathname === "/api/vehicles") {
        const type = url.searchParams.get("type"); // 'Car' or 'Bus'
        let query = "SELECT * FROM vehicles";
        const params: any[] = [];
        if (type && type !== "All") {
          query += " WHERE type = ?";
          params.push(type);
        }
        query += " ORDER BY per_km_rate ASC";

        const stmt = env.DB.prepare(query);
        const { results } = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all();
        return jsonResponse({ vehicles: results });
      }

      // POST /api/vehicles (Admin add vehicle)
      if (request.method === "POST" && url.pathname === "/api/vehicles") {
        const body: any = await request.json();
        const {
          name,
          type,
          category,
          per_km_rate,
          base_fare = 500,
          capacity,
          ac_type = "Full AC",
          luggage_capacity = 4,
          image_url,
          description = "",
        } = body;

        if (!name || !type || !per_km_rate || !capacity) {
          return jsonResponse({ error: "Name, type, per_km_rate, and capacity are required." }, 400);
        }

        const fallbackImg =
          type === "Bus"
            ? "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"
            : "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80";

        const result = await env.DB.prepare(
          `INSERT INTO vehicles (name, type, category, per_km_rate, base_fare, capacity, ac_type, luggage_capacity, image_url, description)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            name,
            type,
            category || (type === "Bus" ? "Mini Bus" : "Sedan"),
            Number(per_km_rate),
            Number(base_fare),
            Number(capacity),
            ac_type,
            Number(luggage_capacity),
            image_url || fallbackImg,
            description
          )
          .run();

        return jsonResponse(
          {
            success: true,
            vehicle_id: result.meta?.last_row_id,
            message: "Vehicle added successfully to fleet!",
          },
          201
        );
      }

      // DELETE /api/vehicles/:id
      if (request.method === "DELETE" && url.pathname.startsWith("/api/vehicles/")) {
        const id = url.pathname.split("/")[3];
        await env.DB.prepare("DELETE FROM vehicles WHERE id = ?").bind(id).run();
        return jsonResponse({ success: true, message: "Vehicle removed" });
      }

      // ================= PACKAGES API (South India) =================
      // GET /api/packages
      if (request.method === "GET" && url.pathname === "/api/packages") {
        const state = url.searchParams.get("state");
        const category = url.searchParams.get("category");
        const search = url.searchParams.get("search");

        let query = "SELECT * FROM packages WHERE 1=1";
        const params: any[] = [];

        if (state && state !== "All") {
          query += " AND state = ?";
          params.push(state);
        }

        if (category && category !== "All") {
          query += " AND category = ?";
          params.push(category);
        }

        if (search) {
          query += " AND (title LIKE ? OR destination LIKE ? OR state LIKE ?)";
          params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        query += " ORDER BY featured DESC, price ASC";

        const stmt = env.DB.prepare(query);
        const { results } = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all();

        return jsonResponse({ packages: results });
      }

      // POST /api/packages (Admin add South India trip)
      if (request.method === "POST" && url.pathname === "/api/packages") {
        const body: any = await request.json();
        const {
          title,
          destination,
          state,
          category = "Hill Station",
          price,
          duration_days = 3,
          image_url,
          description = "",
          highlights = "",
          featured = 0,
        } = body;

        if (!title || !destination || !state || !price) {
          return jsonResponse({ error: "Title, destination, state, and price are required." }, 400);
        }

        const fallbackImg =
          "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1000&q=80";

        const result = await env.DB.prepare(
          `INSERT INTO packages (title, destination, country, state, category, price, duration_days, image_url, description, highlights, featured)
           VALUES (?, ?, 'India', ?, ?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            title,
            destination,
            state,
            category,
            Number(price),
            Number(duration_days),
            image_url || fallbackImg,
            description,
            highlights,
            featured ? 1 : 0
          )
          .run();

        return jsonResponse(
          {
            success: true,
            package_id: result.meta?.last_row_id,
            message: "South India trip plan created successfully!",
          },
          201
        );
      }

      // DELETE /api/packages/:id
      if (request.method === "DELETE" && url.pathname.startsWith("/api/packages/")) {
        const id = url.pathname.split("/")[3];
        await env.DB.prepare("DELETE FROM packages WHERE id = ?").bind(id).run();
        return jsonResponse({ success: true, message: "Package removed" });
      }

      // ================= BOOKINGS API =================
      // POST /api/bookings
      if (request.method === "POST" && url.pathname === "/api/bookings") {
        const body: any = await request.json();
        const {
          booking_type = "package", // 'package' or 'route_rental'
          package_id,
          package_title,
          vehicle_id,
          vehicle_name,
          pickup_location,
          dropoff_location,
          distance_km,
          customer_name,
          customer_email,
          customer_phone = "",
          travel_date,
          travelers_count = 1,
          special_requests = "",
          total_price,
        } = body;

        if (!customer_name || !customer_email || !travel_date) {
          return jsonResponse({ error: "Name, email, and travel date are required." }, 400);
        }

        let computedTotal = Number(total_price) || 0;

        // If route rental and total_price not sent, compute from vehicle per_km_rate
        if (booking_type === "route_rental" && vehicle_id && (!computedTotal || computedTotal <= 0)) {
          const v: any = await env.DB.prepare("SELECT per_km_rate, base_fare FROM vehicles WHERE id = ?")
            .bind(vehicle_id)
            .first();
          if (v) {
            const km = Number(distance_km) || 100;
            computedTotal = Math.round(km * v.per_km_rate + v.base_fare);
          }
        }

        // If package booking and total_price not sent, compute from package price
        if (booking_type === "package" && package_id && (!computedTotal || computedTotal <= 0)) {
          const p: any = await env.DB.prepare("SELECT price FROM packages WHERE id = ?")
            .bind(package_id)
            .first();
          if (p) {
            computedTotal = p.price * (Number(travelers_count) || 1);
          }
        }

        if (computedTotal <= 0) computedTotal = 2500;

        const result = await env.DB.prepare(
          `INSERT INTO bookings (
            package_id, package_title, vehicle_id, vehicle_name, booking_type,
            pickup_location, dropoff_location, distance_km, customer_name, customer_email,
            customer_phone, travel_date, travelers_count, special_requests, status, total_price
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed', ?)`
        )
          .bind(
            package_id || null,
            package_title || null,
            vehicle_id || null,
            vehicle_name || null,
            booking_type,
            pickup_location || null,
            dropoff_location || null,
            distance_km ? Number(distance_km) : null,
            customer_name,
            customer_email,
            customer_phone,
            travel_date,
            Number(travelers_count) || 1,
            special_requests,
            computedTotal
          )
          .run();

        return jsonResponse(
          {
            success: true,
            booking_id: result.meta?.last_row_id,
            total_price: computedTotal,
            message: "Reservation confirmed successfully with Travel Agencie!",
          },
          201
        );
      }

      // GET /api/bookings
      if (request.method === "GET" && url.pathname === "/api/bookings") {
        const { results } = await env.DB.prepare(
          "SELECT * FROM bookings ORDER BY created_at DESC LIMIT 100"
        ).all();
        return jsonResponse({ bookings: results });
      }

      // PATCH /api/bookings/:id (Admin update status)
      if (request.method === "PATCH" && url.pathname.startsWith("/api/bookings/")) {
        const id = url.pathname.split("/")[3];
        const body: any = await request.json();
        const { status } = body;

        if (!status) return jsonResponse({ error: "Status is required." }, 400);

        await env.DB.prepare("UPDATE bookings SET status = ? WHERE id = ?").bind(status, id).run();
        return jsonResponse({ success: true, message: `Booking status updated to ${status}` });
      }

      // ================= INQUIRIES API =================
      // POST /api/inquiries
      if (request.method === "POST" && url.pathname === "/api/inquiries") {
        const body: any = await request.json();
        const { name, email, subject = "South India Tour Inquiry", message } = body;

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

      // ================= AUTH & USER ROLES API =================
      // POST /api/auth/google (Google OAuth Login / Sign Up)
      if (request.method === "POST" && url.pathname === "/api/auth/google") {
        const body: any = await request.json();
        let { credential, email, name, picture } = body;

        // Decode Google JWT if credential provided
        if (credential && (!email || !name)) {
          try {
            const parts = credential.split(".");
            if (parts.length === 3) {
              const base64Url = parts[1];
              const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
              const decoded = JSON.parse(atob(base64));
              email = email || decoded.email;
              name = name || decoded.name;
              picture = picture || decoded.picture;
            }
          } catch (e) {
            console.error("Failed to parse Google JWT credential:", e);
          }
        }

        if (!email) {
          return jsonResponse({ error: "Email address is required for authentication." }, 400);
        }

        const normalizedEmail = email.toLowerCase().trim();
        const userName = name || normalizedEmail.split("@")[0];
        const userPic = picture || null;

        // Check if user exists in database
        let user: any = await env.DB.prepare("SELECT * FROM users WHERE email = ?")
          .bind(normalizedEmail)
          .first();

        if (user) {
          // Update profile details on login
          await env.DB.prepare(
            "UPDATE users SET name = ?, picture = COALESCE(?, picture), updated_at = CURRENT_TIMESTAMP WHERE id = ?"
          )
            .bind(userName, userPic, user.id)
            .run();

          // Refresh user to get exact role stored in DB
          user = await env.DB.prepare("SELECT * FROM users WHERE id = ?").bind(user.id).first();
        } else {
          // Insert new user into database with default 'user' role
          const insertRes = await env.DB.prepare(
            "INSERT INTO users (email, name, picture, role) VALUES (?, ?, ?, 'user')"
          )
            .bind(normalizedEmail, userName, userPic)
            .run();

          user = await env.DB.prepare("SELECT * FROM users WHERE id = ?")
            .bind(insertRes.meta?.last_row_id)
            .first();
        }

        return jsonResponse({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            picture: user.picture,
            role: user.role, // role directly from DB ('user' or 'admin')
            created_at: user.created_at,
          },
        });
      }

      // GET /api/auth/me?email=...
      if (request.method === "GET" && url.pathname === "/api/auth/me") {
        const email = url.searchParams.get("email");
        if (!email) {
          return jsonResponse({ error: "Email is required" }, 400);
        }

        const user: any = await env.DB.prepare("SELECT id, email, name, picture, role, created_at FROM users WHERE email = ?")
          .bind(email.toLowerCase().trim())
          .first();

        if (!user) {
          return jsonResponse({ error: "User not found" }, 404);
        }

        return jsonResponse({ user });
      }

      // GET /api/admin/users (View all users from DB)
      if (request.method === "GET" && url.pathname === "/api/admin/users") {
        const { results } = await env.DB.prepare(
          "SELECT id, email, name, picture, role, created_at FROM users ORDER BY created_at DESC"
        ).all();
        return jsonResponse({ users: results });
      }

      // PATCH /api/admin/users/:id/role (Change user role in DB: 'user' <=> 'admin')
      if (request.method === "PATCH" && url.pathname.startsWith("/api/admin/users/") && url.pathname.endsWith("/role")) {
        const id = url.pathname.split("/")[4];
        const body: any = await request.json();
        const { role } = body;

        if (role !== "user" && role !== "admin") {
          return jsonResponse({ error: "Role must be 'user' or 'admin'." }, 400);
        }

        await env.DB.prepare("UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
          .bind(role, id)
          .run();

        const updated: any = await env.DB.prepare("SELECT id, email, name, picture, role FROM users WHERE id = ?")
          .bind(id)
          .first();

        return jsonResponse({
          success: true,
          message: `User role updated to ${role}`,
          user: updated,
        });
      }

      return jsonResponse({ error: "Not Found" }, 404);
    } catch (err: any) {
      return jsonResponse({ error: err.message || "Internal server error" }, 500);
    }
  },
};
