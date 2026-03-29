# Ubayed Telecom - Retail Management System (Backend)

## 🎯 Project Purpose

The **Ubayed Telecom Management System** is a specialized retail platform designed to streamline the complex financial operations of a multi-service telecommunications and mobile banking shop. 

In a typical retail environment of this nature, shopkeepers handle multiple digital wallets (bKash, Nagad, Rocket, etc.) alongside physical cash. This system solves the critical challenge of tracking fragmented balances, calculating accurate profits from varying commission structures, and monitoring business growth against targets.

---

## 💼 Core Business Logic & Workflows

### 1. Mobile Banking (MFS) Management
The system acts as a ledger for the six major mobile financial services in Bangladesh. It handles the four primary transaction types that define current agency operations:

- **Cash In**: Customer provides physical cash to the shop → Shopkeeper sends digital money from their platform balance. 
    *   *System Action*: Increases **Main Wallet** (Cash), Decreases **Platform Balance** (Digital).
- **Cash Out**: Customer sends digital money to the shop's agent account → Shopkeeper provides physical cash.
    *   *System Action*: Decreases **Main Wallet** (Cash), Increases **Platform Balance** (Digital).
- **B2B In/Out**: Rebalancing transactions between the agent and other business entities.

### 2. Profit Generation Rules
Accurate profit tracking is built directly into the transaction engine:
- **Variable Commission**: Automatically calculates shop earnings based on platform-specific rates (e.g., bKash vs. Nagad) during Cash In/Out.
- **Service Profits**: Fixed or percentage-based margins for high-frequency services:
    - **Flexiload**: Fixed commission per recharge.
    - **Photocopy & Printing**: Margin-based profit calculation.
    - **Customer Service**: Direct service charge tracking.
- **Manual Overrides**: Allows the shopkeeper to set custom profits for special cases, ensuring the records always match reality.

### 3. Dual-Layer Balance Tracking
The system maintains a real-time "Net Worth" view by tracking two distinct layers of capital:
- **Main Wallet (Cash in Hand)**: The literal physical cash available in the shop's drawer. 
- **Digital Platforms**: The current liquidity held across various agent accounts.

### 4. Growth & Performance Monitoring
The system is built to drive business growth through:
- **Sales Targets**: Monthly goals that track "True Sales" (Cash In/Out and Services) vs. non-sales transactions (B2B/Expenses).
- **Debt Tracking**: Monitoring credit given to customers, ensuring no loss goes unrecorded.
- **Automated Summaries**: Real-time dashboards showing Today's vs. Monthly performance in terms of both Volume (Sales) and Earnings (Profit).

---

## 🏗 Modular Architecture

The backend is structured into domain-specific modules for long-term maintainability:
- **Transaction Module**: The core engine handling all inflow/outflow logic.
- **PlatformBalance Module**: Manages the state and history of digital and physical wallets.
- **Target Module**: Handles the configuration and progress of business goals.
- **Auth Module**: Secures sensitive financial data via role-based access.

---

## 🔒 Security & Reliability
Designed for the high-stakes environment of financial management, the system emphasizes:
- **Transaction Atomicity**: Ensuring both "Cash" and "Digital" balances update correctly or not at all (via Mongoose Sessions).
- **Data Integrity**: strict schema validation and error handling to prevent record corruption.
- **Serverless Performance**: Optimized for Vercel's global infrastructure for zero-downtime availability.
