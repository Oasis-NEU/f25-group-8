# Doodle Earth

A location-based art commission platform that connects artists with people seeking custom artwork inspired by real-world places. Users can drop pins on a map, commission unique art pieces tied to those locations, and build a personal gallery of location-tagged memories.

## Features

- **Interactive Map Interface**: Browse and place custom art commissions on an interactive map
- **Location-Based Art**: Commission artwork tied to specific geographic locations
- **Artist Marketplace**: Connect with talented artists for custom commissions
- **Personal Gallery**: View and manage your commissioned artwork collection
- **Real-Time Updates**: Track the status of your art commissions

## Tech Stack

### Frontend
- **React**: Component-based UI framework
- **Supabase**: Backend-as-a-service for authentication, database, and real-time features
- **Map Integration**: Interactive mapping for location-based features

### Backend
- **Supabase**:
  - PostgreSQL database
  - Authentication & user management
  - Real-time subscriptions
  - Storage for artwork images

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/doodle-earth.git
cd doodle-earth
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory:
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server
```bash
npm start
```

The app will open at `http://localhost:3000`

## Usage

1. **Sign Up/Login**: Create an account or log in to get started
2. **Browse the Map**: Explore existing art commissions from around the world
3. **Drop a Pin**: Click on the map to select a location for your commission
4. **Commission Art**: Fill out commission details and connect with an artist
5. **Track Progress**: Monitor your commission status in your dashboard
6. **View Gallery**: Access your completed artwork in your personal gallery

## Project Structure

```
doodle_earth/
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── commission/
│   │   │   └── page.tsx       # Commission creation page
│   │   ├── draw/
│   │   │   └── page.tsx       # Drawing/artwork creation page
│   │   ├── login/
│   │   │   └── page.tsx       # User login page
│   │   ├── post/
│   │   │   └── page.tsx       # Post/artwork viewing page
│   │   ├── profile/
│   │   │   └── page.tsx       # User profile page
│   │   ├── settings/
│   │   │   └── page.tsx       # User settings page
│   │   ├── layout.tsx         # Root layout component
│   │   └── page.tsx           # Home page
│   ├── components/
│   │   ├── CommissionCard.tsx # Commission display card
│   │   ├── CommissionPin.tsx  # Map pin for commissions
│   │   ├── HamburgerMenu.tsx  # Navigation menu
│   │   ├── MapLocationPick.tsx # Location picker component
│   │   ├── MapView.tsx        # Main map interface
│   │   └── TopBar.tsx         # Top navigation bar
│   └── contexts/              # React context providers
├── .env                       # Environment variables
└── package.json              # Dependencies
```

## Future Enhancements

- Artist portfolio pages
- Commission review and rating system
- Advanced search and filtering
- Social sharing features
- Mobile app version
- Payment integration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Team

**Oasis Northeastern Project**

### Team Members
- Olivia
- Anushka Anand
- Luke Jansen
- Souren Prakash

### Mentor
- Vinny Kaushik
