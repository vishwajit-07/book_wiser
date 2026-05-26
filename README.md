# 📚 BookWiser — Book Management System

A React-based Book Management System that allows users to view, add, update, and delete books with image upload support via Cloudinary.

---

## 🔗 Links

- **GitHub Repository:** [https://github.com/vishwajit-07/book_wiser](https://github.com/vishwajit-07/book_wiser)
- **Live Demo:** [https://bookorg.vercel.app](https://bookorg.vercel.app)

---

##  Features

-  View a list of books with title, author, genre, publication year, and cover image
-  Add new books via a form with Cloudinary image upload
-  Edit existing book entries
-  Delete books
-  Search books by title or author
-  Filter books by genre
-  Loading states and error handling for all API interactions

---

##  Tech Stack

- **Frontend:** React + Vite
- **Styling:** *(CSS / Tailwind)*
- **Image Storage:** Cloudinary
- **Mock API:** MockAPI / JSON Server 

---

##  Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A [Cloudinary](https://cloudinary.com/) account (free tier works)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/vishwajit-07/book_wiser
cd book_wiser
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project:

```bash
touch .env
```

Add the following variables to your `.env` file:

```dotenv
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
```

> **How to get these values:**
>
> 1. Log in to your [Cloudinary Dashboard](https://console.cloudinary.com/)
> 2. **Cloud Name:** Found on the dashboard homepage under your account name
> 3. **Upload Preset:**
>    - Go to **Settings → Upload**
>    - Scroll to **Upload presets**
>    - Click **Add upload preset**
>    - Set **Signing mode** to `Unsigned`
>    - Save and copy the preset name

### 4. Start the Development Server

```bash
npm run dev
```

The app will be running at **http://localhost:5173**

---

##  Project Structure

```
book_wiser/
├── public/
├── src/
│   ├── assets/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page-level components
│   ├── App.jsx
│   └── main.jsx
├── .env                   # Environment variables (not committed)
├── index.html
├── package.json
└── vite.config.js
```

---

##  Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

To preview the production build locally:

```bash
npm run preview
```

---

##  Deployment

### Deploy on Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Under **Environment Variables**, add:
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_UPLOAD_PRESET`
4. Click **Deploy**


