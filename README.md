# 🛒 LiveMART - Online Delivery System

A full-stack e-commerce platform connecting **Customers**, **Retailers**, and **Wholesalers**, built using **FastAPI**, **React**, and **SQLModel**.

## ⚙️ Features
- Multi-role authentication (Customer, Retailer, Wholesaler)
- Product management & real-time stock updates
- Order placement, tracking, and notifications
- Location-based search (Google Maps API)
- Clean REST API and modular architecture

## 🧱 Tech Stack
- **Backend:** FastAPI, SQLModel, Pydantic, Passlib, JWT
- **Frontend:** React, TailwindCSS, Axios
- **Database:** SQLite (can be swapped with PostgreSQL)
- **APIs:** Google Maps / Distance Matrix

## 🚀 Setup
```bash
# backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# frontend
cd ../frontend
npm install
npm run dev
```