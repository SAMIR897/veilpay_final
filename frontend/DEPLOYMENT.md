# VeilPay Deployment Guide

This guide covers how to deploy the VeilPay frontend to Vercel.

## Prerequisites

1.  **GitHub Repository**: Ensure you have pushed your latest code to GitHub (as you mentioned you would).
2.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com) if you haven't already.

## Option A: Deploy via Vercel Dashboard (Recommended)

This method connects Vercel to your GitHub repo, so every time you `git push`, Vercel automatically redeploys.

1.  **Log in to Vercel**.
2.  Click **"Add New..."** -> **"Project"**.
3.  **Import Git Repository**:
    *   Select your GitHub account.
    *   Find the `veilpay` repository and clicking **"Import"**.
4.  **Configure Project**:
    *   **Framework Preset**: It should auto-detect **Vite**. If not, select it manually.
    *   **Root Directory**: **IMPORTANT!** Click "Edit" next to Root Directory and select `frontend`.
        *   *Why?* Your repo has both `programs/` (backend) and `frontend/`. Vercel only needs to build the `frontend` folder.
5.  **Environment Variables**:
    *   Expand the "Environment Variables" section.
    *   Copy the values from your local `.env.local` file (e.g., `VITE_SOLANA_NETWORK`, `VITE_RPC_URL`).
6.  **Deploy**: Click **"Deploy"**.

Vercel will build your project. In about a minute, you'll get a live URL (e.g., `https://veilpay.vercel.app`).

## Option B: Deploy via Command Line

If you have the Vercel CLI installed:

1.  Open your terminal in the `frontend` folder:
    ```bash
    cd frontend
    ```
2.  Run the deploy command:
    ```bash
    npx vercel
    ```
3.  Follow the prompts:
    *   *Set up and deploy?* **Y**
    *   *Which scope?* (Select your account)
    *   *Link to existing project?* **N**
    *   *Project name?* `veilpay-frontend`
    *   *In which directory is your code located?* `./` (Just press Enter)
    *   *Want to modify these settings?* **N** (Auto-detection usually works)

## Post-Deployment Checklist

- [ ] **Check Routing**: Refresh the page on a sub-route (if any) to ensure the `vercel.json` rewrite works.
- [ ] **Test Wallet Connection**: Ensure standard wallets (Phantom, Solflare) connect successfully on the live site.
- [ ] **Verify Matrix Rain**: Check that the background animation performs well on mobile/desktop.
