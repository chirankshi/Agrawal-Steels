# Aggarwal Steels — FastAPI Backend Service

Production-ready industrial backend service built with **Python 3.13** and **FastAPI**, engineered for high performance, automatic OpenAPI documentation, and seamless integration with the Aggarwal Steels Next.js frontend.

---

## 🚀 Key Features

* **Direct Quotation & RFQ Service:** Endpoint to capture customer inquiries and steel specifications from the website.
* **Product Catalog API:** Query stock items (MS TMT Bars, HR Plates/Coils, ISMB Beams, ISMC Channels, SS Sheets) with category filtering and text search.
* **Real-time Order & Dispatch Tracking:** Check shipment and dispatch status using tracking IDs (e.g. `AS-2026-7891`).
* **Auto Database Seeding:** Automatically creates SQLite database (`aggarwal_steels.db`) and seeds initial steel inventory and demo tracking records upon first launch.
* **CORS Configured:** Out-of-the-box support for Next.js frontend running on `http://localhost:3000`.
* **Interactive API Documentation:** Automatically generated Swagger UI and ReDoc.

---

## 📂 Project Architecture

```
backend/
├── app/
│   ├── config.py              # Pydantic Settings & environment variables
│   ├── database.py            # SQLAlchemy database engine and session
│   ├── main.py                # FastAPI app initialization, CORS, lifespan
│   ├── models/                # SQLAlchemy ORM models
│   │   ├── enquiry.py         # Customer quotation enquiries
│   │   ├── product.py         # Steel product catalog
│   │   └── order.py           # Order & dispatch tracking
│   ├── schemas/               # Pydantic validation schemas
│   │   ├── enquiry.py
│   │   ├── product.py
│   │   └── order.py
│   ├── routers/               # API endpoints
│   │   ├── enquiries.py       # /api/v1/enquiries
│   │   ├── products.py        # /api/v1/products
│   │   ├── orders.py          # /api/v1/orders
│   │   └── health.py          # /api/v1/health
│   └── services/
│       └── seed.py            # Initial catalog & demo order seeder
├── .env                       # Environment configuration
├── .env.example               # Template environment configuration
├── requirements.txt           # Python dependencies
├── run.py                     # Convenience runner script
└── README.md                  # Documentation
```

---

## 🛠️ Setup & Running

### 1. Requirements
Ensure Python 3.10+ is installed.

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Start the Backend Server
```bash
python run.py
```
*Alternatively, you can run:*
```bash
uvicorn app.main:app --reload --port 8000
```

The server will start at:
* **Base URL:** `http://localhost:8000`
* **Interactive Swagger UI:** `http://localhost:8000/docs`
* **Interactive ReDoc:** `http://localhost:8000/redoc`

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Service health status and database check |
| `POST` | `/api/v1/enquiries` | Submit new quotation request from website form |
| `GET` | `/api/v1/enquiries` | List all inquiries (optional `?status=pending`) |
| `GET` | `/api/v1/products` | List products with `?category=` and `?search=` filters |
| `GET` | `/api/v1/products/{id_or_slug}` | Get details of a single product |
| `GET` | `/api/v1/products/categories` | List distinct steel product categories |
| `GET` | `/api/v1/orders/track/{tracking_no}` | Track shipment (e.g. `AS-2026-7891`) |

---

## 🔗 Connecting with Next.js Frontend
In your Next.js application, submit quotation forms to:
```javascript
const response = await fetch('http://localhost:8000/api/v1/enquiries', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: formData.name,
    phone: formData.phone,
    email: formData.email,
    product: formData.product,
    message: formData.message,
  }),
});
```
