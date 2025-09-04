# DeLARSify - LARS Management Platform

A comprehensive platform for managing Low Anterior Resection Syndrome (LARS) with AI-powered support and community features.

## 🌟 Features

- **AI-Powered Chat**: SIA (Sweet Intelligent Assistant) provides evidence-based support
- **Role-Based Access**: Separate experiences for survivors, caregivers, clinicians, and researchers
- **LARS Management Tools**: Score calculator, symptom tracker, and management tools
- **Community Support**: Safe space for sharing experiences and getting support
- **Research Integration**: Access to latest research and evidence-based guidance

## 🚀 Live Demo

**Website**: [nomorelars.sanjeevaniai.com](https://nomorelars.sanjeevaniai.com)

## 🛠 Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Authentication & Database)
- **Deployment**: Netlify
- **AI Integration**: Agentic RAG (Retrieval-Augmented Generation)

## 🏗 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/sanjeevaniai/delarsify.git
   cd delarsify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Add your Supabase credentials

4. **Run development server**
   ```bash
   npm run dev
   ```

## 👥 User Roles

- **Cancer Survivor**: Managing personal health journey
- **Caregiver**: Supporting someone with LARS
- **Clinician**: Providing healthcare services
- **Researcher**: Conducting research in the field

## 🔐 Authentication Flow

1. **Sign Up**: Choose role during registration
2. **Email Verification**: Confirm email address
3. **Profile Setup**: Complete intake form
4. **Dashboard Access**: Role-based experience

## 📱 Available Routes

- `/` - Landing page
- `/auth` - Sign up/Sign in with role selection
- `/intake` - Profile setup form
- `/dashboard` - Role-based dashboard

## 🚀 Deployment

The application is automatically deployed on Netlify when changes are pushed to the main branch.

**Live URL**: [nomorelars.sanjeevaniai.com](https://nomorelars.sanjeevaniai.com)
**Build Command**: `npm run build`
**Publish Directory**: `dist`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email support@sanjeevaniai.com or join our community at [SKOOL](https://www.skool.com/lets-delarsify/about?ref=31e315a378cf46bc851bf447eb51d738).