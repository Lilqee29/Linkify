# 🔗 Linkify

> **One Link. Infinite Possibilities.**  
> A modern, feature-rich link-in-bio platform built for creators, influencers, and businesses.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000?style=for-the-badge&logo=vercel)](https://linkify-ruby.vercel.app/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## 🌟 What is Linkify?

**Linkify** is a next-generation link-in-bio tool that goes beyond just listing links. It's a complete creator hub that enables engagement, provides actionable analytics, and allows you to build a beautiful, personalized landing page — all in one place.

Perfect for:

- 🎨 Content Creators
- 📸 Influencers
- 🏢 Small Businesses
- 🎵 Musicians & Artists
- 💼 Freelancers & Consultants

🔗 **[Try it Live](https://linkify-ruby.vercel.app/)**

---

## ✨ Key Features

### 🎯 **Core Functionality**

- **Multiple Link Management** - Add, edit, and organize unlimited links
- **Custom Categories** - Group your links for better organization
- **Social Icons** - Support for 15+ platforms (Instagram, Twitter, GitHub, Discord, etc.)
- **Beautiful Themes** - Choose from 6 pre-designed themes or create your own
- **Custom Branding** - Upload your profile picture and write your bio

### 🎨 **Design & Customization**

- **Theme Editor** - Fully customizable colors, fonts, and backgrounds
- **Live Preview** - See changes in real-time before publishing
- **Responsive Design** - Looks perfect on desktop, tablet, and mobile
- **QR Code Generation** - Automatic QR code for easy sharing

### 💬 **Engagement Features**

- **Anonymous Messaging (AMA)** - Visitors can send you messages directly
- **Inbox Dashboard** - Manage all messages from one place
- **Real-time Notifications** - Get notified when you receive new messages

### 📊 **Analytics & Insights**

- **Click Tracking** - See how many times each link is clicked
- **Top Performers** - Visual dashboard showing your best-performing links
- **Total Stats** - Track total clicks and link count
- **Interactive Charts** - Beautiful progress bars and rankings

### 🔐 **Security & Auth**

- **Firebase Authentication** - Secure email/password and Google Sign-In
- **Email Verification** - Ensure account authenticity
- **Firestore Security Rules** - Protected data with granular permissions
- **Anonymous Access** - Visitors don't need accounts to send messages

---

## 🛠️ Tech Stack

| Technology        | Purpose                 |
| ----------------- | ----------------------- |
| **React 18**      | UI Framework            |
| **Vite**          | Build Tool & Dev Server |
| **Tailwind CSS**  | Styling                 |
| **Firebase Auth** | User Authentication     |
| **Firestore**     | Database                |
| **Lucide React**  | Icon Library            |
| **React Router**  | Navigation              |
| **React Helmet**  | SEO & Meta Tags         |
| **QRCode.react**  | QR Code Generation      |
| **Vercel**        | Deployment              |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Firebase account
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/linkify.git
   cd linkify/restaurant-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Firebase**

   - Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password & Google)
   - Enable Firestore Database
   - Copy your Firebase config

4. **Configure environment**

   - Update `src/firebase/firebase.js` with your Firebase credentials

5. **Deploy Firestore Rules**

   - Copy the rules from `firestore.rules` to your Firebase Console
   - Or use Firebase CLI: `firebase deploy --only firestore:rules`

6. **Run the development server**

   ```bash
   npm run dev
   ```

7. **Open your browser**
   - Navigate to `http://localhost:5173`

---

## 📱 Usage

### For Link Owners

1. **Create Account**

   - Sign up with email or Google
   - Verify your email

2. **Customize Profile**

   - Upload profile picture
   - Write your bio
   - Choose a theme

3. **Add Links**

   - Click "Add Link"
   - Enter title, URL, and select icon
   - Organize with categories

4. **Share Your Page**

   - Click "Share" to copy your unique link
   - Share on social media, email signatures, etc.

5. **Monitor Performance**
   - View analytics dashboard
   - See which links get the most clicks
   - Read messages from your audience

### For Visitors

1. **Visit a Profile**

   - Go to `linkify.app/username` (or the shared link)

2. **Interact**
   - Click links to visit connected profiles
   - Send anonymous messages via "Ask me anything"
   - Share the profile with others

---

## 🎨 Features in Detail

### **1. Theme Customization**

Choose from beautiful pre-made themes or create your own:

- **Classic** - Elegant lavender & pink gradient
- **Ocean** - Calming blue tones
- **Forest** - Fresh green aesthetic
- **Sunset** - Warm amber & orange
- **Cartoon** - Playful and light
- **Custom** - Build your own with full color control

### **2. Analytics Dashboard**

Track your performance with:

- Total link count
- Total clicks across all links
- Top 3 performing links with medals 🥇🥈🥉
- Visual progress bars
- Individual link statistics

### **3. Anonymous Messaging**

Engage with your audience:

- Visitors can ask questions anonymously
- Messages appear in your Dashboard inbox
- Red notification dot for new messages
- Easy delete/manage interface

### **4. Smart Link Management**

Organize efficiently:

- Drag & drop link ordering (coming soon)
- Category-based grouping
- Quick edit/delete actions
- Icon selection from 15+ platforms

---

## 🔒 Security & Privacy

- **User Data**: Stored securely in Firestore with strict security rules
- **Authentication**: Firebase Auth with email verification
- **Messages**: Write-only for visitors, read/delete-only for owners
- **Links**: Public read, owner-only write
- **No Tracking**: We don't sell or share your data

---

## 🌐 Deployment

This project is deployed on **Vercel** for optimal performance and CDN distribution.

### Deploy Your Own

1. Fork this repository
2. Connect to Vercel
3. Set up environment variables
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/linkify)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI inspiration from modern design trends
- Built with ❤️ using React and Firebase

---

## 📬 Contact & Support

- **Live App**: [linkify-ruby.vercel.app](https://linkify-ruby.vercel.app/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/linkify/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/linkify/discussions)

---

<div align="center">

**Made with 💜 by the Linkify Team**

⭐ Star us on GitHub if you like this project!

</div>
