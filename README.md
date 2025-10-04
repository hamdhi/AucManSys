# 🏛️ Auction Management System - Group 16

A full-stack **Auction Management System** built with **ASP.NET Core (.NET 6)** for the backend and **React.js** for the frontend. Uses **SQL Server** as the database.

---

## 🚀 Table of Contents

- [Prerequisites](#-prerequisites)
- [Backend Setup (ASP.NET)](#️-backend-setup-aspnet)
- [Frontend Setup (React)](#️-frontend-setup-react)
- [Running the Project](#-running-the-project)
- [Tips & Notes](#️-tips--notes)
- [Folder Structure](#-folder-structure)

---

## 🛠️ Prerequisites

Make sure you have installed:

- [Visual Studio 2022+](https://visualstudio.microsoft.com/) (for backend)
- [SQL Server / SQL Server Management Studio](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)
- [Node.js & npm](https://nodejs.org/) (for frontend)

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

Open in Visual Studio.

### 3️⃣ Update database connection

Open `appsettings.json` and replace the server name with yours:

```json
"ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=AuctionDB;Trusted_Connection=True;MultipleActiveResultSets=true"
}
```

### 4️⃣ Apply Entity Framework migrations

Open **Package Manager Console** in Visual Studio and run:

```powershell
Add-Migration "InitialMigration"
Update-Database
```

### 5️⃣ Run the backend

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

1. Start the backend in Visual Studio
2. Start the frontend with `npm run dev`
3. Open your browser at `http://localhost:5173` (or the port shown)
4. The Auction Management System UI should appear and connect to your database

---

## ⚠️ Tips & Notes

- Ensure SQL Server is running before starting backend
- If migration errors appear, delete the `Migrations` folder and try `Add-Migration` again
- Make sure the connection string in `appsettings.json` matches your server exactly
- Run `npm install` after pulling changes from GitHub
- Check `launchSettings.json` (backend) or `.env` (frontend) if ports conflict

---

## 📁 Folder Structure

```
AuctionManagementSystem/   → Backend (ASP.NET Core)
frontend-react/            → Frontend (React.js)
```

---

**Built with ❤️ using ASP.NET Core & React by Group 16**

Fernando, BP
Gayantha, DPAR
Hamdhi, MHM
Induranga, SPGN
Kavinas, AGOC
Pushpakumara, RDK
Vimansa, SPD
Wickramasinghe, WMRD
