# 🏛️ Auction Management System - Group 16

# Login Details - username: admin , password : admin
# Login Details - username: sellr , password : seller
# Login Details - username: bidder , password : bidder

A full-stack **Auction Management System** built with **ASP.NET Core (.NET 9)** for the backend and **React.js** for the frontend. Uses **SQL Server** as the database.

---

## 🚀 Table of Contents

- [Prerequisites](#-prerequisites)
- [Backend Setup (ASP.NET)](#️-backend-setup-aspnet)
- [Frontend Setup (React)](#️-frontend-setup-react)
- [Running the Project](#-running-the-project)
- [Tips & Notes](#️-tips--notes)
- [Folder Structure](#-folder-structure)
- [Gmail SMTP Configuration](#-gmail-smtp-configuration-for-aspnet-applications)

---

## 🛠️ Prerequisites

Make sure you have installed:

- [Visual Studio 2022 (v17.8+)](https://visualstudio.microsoft.com/) (for backend)
- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [SQL Server / SQL Server Management Studio (SSMS)](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)
- [Node.js (v18+) & npm (v9+)](https://nodejs.org/) (for frontend)

**Version Check Commands:**
```bash
# Check .NET version
dotnet --version

# Check Node.js version
node --version

# Check npm version
npm --version
```

**Check Visual Studio version:**
- Open Visual Studio → Help → About Microsoft Visual Studio

---

## 🖥️ Backend Setup (ASP.NET)

### 1️⃣ Create a SQL Server database

- Open **SQL Server Management Studio**
- Connect to your server
- Copy the **server name** for later

### 2️⃣ Open backend project

```
AuctionManagementSystem/
```

Open in **Visual Studio 2022**.

### 3️⃣ Install Required NuGet Packages

#### **Option A: Using Visual Studio GUI (Recommended for Beginners)**

1. Right-click on your project in **Solution Explorer**
2. Select **Manage NuGet Packages**
3. Click on the **Browse** tab
4. Search for and install each package:
   - `Microsoft.EntityFrameworkCore` (Version 9.0.0)
   - `Microsoft.EntityFrameworkCore.SqlServer` (Version 9.0.0)
   - `Microsoft.EntityFrameworkCore.Tools` (Version 9.0.0)
   - `Swashbuckle.AspNetCore` (Version 6.5.0)
5. Click **Install** for each package and accept any license agreements

#### **Option B: Using Package Manager Console**

Open **Package Manager Console** in Visual Studio (`Tools → NuGet Package Manager → Package Manager Console`) and run:

```powershell
# Entity Framework Core packages
Install-Package Microsoft.EntityFrameworkCore -Version 9.0.0
Install-Package Microsoft.EntityFrameworkCore.SqlServer -Version 9.0.0
Install-Package Microsoft.EntityFrameworkCore.Tools -Version 9.0.0

# Swagger/Swashbuckle for API documentation
Install-Package Swashbuckle.AspNetCore -Version 6.5.0
```

### 4️⃣ Update database connection

Open `appsettings.json` and replace the server name with yours:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=AuctionDB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  }
}
```

### 5️⃣ Apply Entity Framework migrations

Open **Package Manager Console** in Visual Studio and run:

```powershell
Add-Migration InitialMigration
Update-Database
```

### 6️⃣ Run the backend

Press `F5` or click **Run** in Visual Studio.

---

## ⚛️ Frontend Setup (React)

### 1️⃣ Open frontend project

```
frontend-react/
```

Open terminal/command prompt in this folder.

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Run frontend

```bash
npm run dev
```

Or using Yarn:

```bash
yarn dev
```

### 4️⃣ Other frontend run commands

```bash
npm start
yarn start
npm run dev
yarn dev
```

---

## 🏃 Running the Project

1. Start the backend in Visual Studio (press `F5`)
2. Start the frontend with `npm run dev`
3. The React development server will automatically open your browser at `http://localhost:3000` (or the port shown in terminal)
4. The Auction Management System UI should appear and connect to your database
5. Access Swagger API documentation at `https://localhost:XXXXX/swagger` (backend URL)

---

## ⚠️ Tips & Notes

- Ensure SQL Server is running before starting backend
- If migration errors appear, delete the `Migrations` folder and try `Add-Migration` again
- Make sure the connection string in `appsettings.json` matches your server exactly
- Run `npm install` after pulling changes from GitHub
- Check `launchSettings.json` (backend) or `.env` (frontend) if ports conflict
- If you encounter SSL certificate errors, add `TrustServerCertificate=True` to your connection string

---

## 📁 Folder Structure

```
AuctionManagementSystem/   → Backend (ASP.NET Core)
frontend-react/            → Frontend (React.js)
```

---

## 📧 Gmail SMTP Configuration for ASP.NET Applications

This guide walks you through setting up Gmail SMTP with App Passwords for secure email sending in your ASP.NET application.

### Prerequisites

* A Google account
* An ASP.NET application

### Setup Steps

#### 1. Sign in to your Google account

Navigate to [Google Account](https://myaccount.google.com/) and sign in.

#### 2. Enable 2-Step Verification

Two-factor authentication is required to use App Passwords.

1. Go to **Google Account** → **Security**
2. Find **2-Step Verification** (also known as 2FA)
3. Click and follow the prompts to turn it **ON**

#### 3. Access App Passwords

After enabling 2-Step Verification:

1. Return to **Security** section
2. Scroll down to find **App passwords**
3. Click to access the App passwords page

#### 4. Generate an App Password

1. Click **Create** or **Select app**
2. Choose **Mail** (or select **Other (Custom name)** and enter a name like `ASPNET_Email`)
3. Click **Generate**

#### 5. Copy the App Password

Google will display a 16-character password (without spaces). **Copy this password immediately** — you won't be able to see it again.

#### 6. Configure Your Application

Add the following configuration to your `appsettings.json`:

```json
{
  "Email_Config": {
    "HOST": "smtp.gmail.com",
    "PORT": 587,
    "EMAIL": "your-email@gmail.com",
    "PASSWORD": "your-google-app-password"
  }
}
```

Replace:
* `your-email@gmail.com` with your actual Gmail address
* `your-google-app-password` with the 16-character password from Step 5

---

**Built with ❤️ using ASP.NET Core & React by Group 16**

Hamdhi MHM,
Fernando BP,
Gayantha DPAR,
Induranga SPGN,
Kavinas AGOC,
Pushpakumara RDK,
Vimansa SPD,
Wickramasinghe WMRD
