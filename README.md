# Linkly - LinkTree Clone

A modern, customizable link-in-bio platform built with React and Firebase.

## Features

- **Customizable Themes**: Choose from predefined themes or create your own
- **Link Management**: Organize links by categories with custom icons
- **Profile Customization**: Set bio, profile picture, and theme
- **Real-time Preview**: See changes instantly in the dashboard
- **Public Sharing**: Share your profile with a simple URL
- **QR Code Generation**: Generate QR codes for easy mobile sharing
- **Click Tracking**: Monitor link performance

## How It Works

### For Users (Dashboard)
1. **Create Links**: Add links with titles, URLs, icons, and categories
2. **Customize Profile**: Set bio, profile picture, and choose themes
3. **Preview**: Click "Preview Links" to see how your profile looks
4. **Share**: Click "Share Link" to copy your public profile URL

### For Visitors (Public Profile)
1. **Access Profile**: Visit `yoursite.com/username` to see the public profile
2. **View Links**: Browse organized links by category
3. **Interact**: Click links to visit external sites
4. **Share**: Use the share button to share the profile with others

## URL Structure

- **Dashboard**: `/dashboard` - Manage your profile (requires login)
- **Preview**: `/profile/:username` - Preview your profile (requires login)
- **Public Profile**: `/:username` - Public view (no login required)

## Sharing Your Profile

### Method 1: Dashboard Share Button
1. Go to your dashboard
2. Click the green "Share Link" button
3. The URL `yoursite.com/yourusername` is copied to clipboard
4. Share this URL with others

### Method 2: Preview Page
1. Click "Preview Links" in dashboard
2. Use the share button in the top-right corner
3. Copy the public URL

### Method 3: Direct URL
Your public profile is always available at: `yoursite.com/yourusername`

## Technical Details

- **Frontend**: React with Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **State Management**: React Context + Custom Hooks
- **Routing**: React Router v6
- **Icons**: Lucide React + React Icons

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Firebase configuration
4. Run the development server: `npm run dev`

## Firebase Collections Structure

```
users/
  {userId}/
    username: string
    bio/
      userBio/
        bio: string
    links/
      userLinks/
        links: array
    profilePic/
      userProfilePic/
        profilePic: string
    theme/
      userTheme/
        theme: object
```

## Customization

### Themes
- **Predefined**: Choose from built-in color schemes
- **Custom**: Create your own color palette and font combinations

### Icons
- **Social Media**: Instagram, Twitter, Facebook, YouTube, etc.
- **Custom**: Use any icon from the icon library
- **Default**: Generic link icon for unknown types

### Categories
- **Organize**: Group links by purpose (Social, Work, Fun, etc.)
- **Flexible**: Add, edit, or remove categories as needed
