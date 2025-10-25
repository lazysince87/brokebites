# 🥗 BrokeBites - Smart Meal Planning App

<div align="center">
  <img src="https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white" alt="Flutter" />
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white" alt="Java" />
</div>

## 👥 Team Members & Roles

| Name | Role | Responsibilities |
|------|------|------------------|
| **Kenzo** | Database Engineer | MongoDB schema design, database management, and API integration with backend |
| **Thuy** | AI Engineer | Image recognition model for ingredient detection and integration with Flutter frontend |
| **Diego** | Full Stack Developer | Backend API development with Spring Boot and connection to frontend |
| **Fabian** | Frontend Developer | Flutter UI development, user experience design, and API data display |

## 💡 Challenge Statement

Students often struggle with meal variety and nutrition, leading to food waste and unhealthy eating habits. Many have limited time, budgets, and cooking skills, making it difficult to plan balanced meals with what's already in their fridge.

## 🍴 Our Solution

BrokeBites is a smart meal-planning web and mobile app that uses AI ingredient recognition to generate recipes based on what users already have.

### Key Features:
- 📸 **AI Ingredient Detection**: Take photos or upload images to automatically detect ingredients
- 🧠 **Smart Recipe Generation**: Get personalized recipe suggestions based on available ingredients
- ⚙️ **Advanced Filtering**: Filter recipes by calories, protein, diet type, and cooking time
- 💾 **Recipe Management**: Save favorite recipes and track meal history
- 📱 **Cross-Platform**: Works on Android, iOS, and web browsers

## 🚀 Project Vision

**FOR** students who struggle with meal variety and nutrition,  
**WHO** often feel limited by their available ingredients and cooking skills,  
**THE** BrokeBites App  
**IS A** smart recipe suggestion platform  
**THAT** allows users to input or photograph their ingredients to receive tailored recipe ideas.  
**UNLIKE** generic recipe websites that overwhelm with irrelevant options,  
**OUR PRODUCT** uses AI-powered recognition and personalized suggestions to help students explore new meals while staying in their comfort zone, reducing food waste, and promoting healthier eating habits.

## 🧩 Technology Stack & Architecture

### 🖥️ Frontend (Web Application)
- **Framework**: Next.js 15 with TypeScript
- **Purpose**: Responsive web UI for recipe discovery, ingredient input, and camera AI integration
- **Key Technologies**:
  - `React 18` for component-based UI
  - `TypeScript` for type safety
  - `Tailwind CSS` for styling
  - `Axios` for REST API requests
  - `React Hook Form` for form management
  - `Zustand` for state management
  - `Lucide React` for icons
- **Platform**: Modern web browsers with responsive design

### ⚙️ Backend (Server & API)
- **Framework**: Java Spring Boot
- **Purpose**: Handles API endpoints, user authentication, and data communication
- **Key Dependencies**:
  - Spring Web
  - Spring Data MongoDB
  - Spring Security (Auth0 integration)
  - Lombok
- **API Endpoints**:
  - `/api/recipes` → Fetch recipes from database or Spoonacular
  - `/api/ingredients/detect` → Process image input from Flutter app
  - `/api/users` → Manage user data and preferences

### 🧠 AI Module
- **Language**: Python or integrated TensorFlow Lite model within Flutter
- **Function**: Detect ingredients from images taken by the user
- **Tooling**: Pre-trained CNN model fine-tuned with labeled ingredient data
- **Integration**: Exposed as REST API endpoint or embedded inference model in Flutter

### 🗄️ Database
- **System**: MongoDB (Atlas)
- **Collections**:
  - `users` (Auth0 IDs, saved recipes)
  - `recipes` (API data, custom user recipes)
  - `ingredients` (recognized ingredient tags)
- **Connector**: Spring Data MongoDB

### 🔐 Authentication
- **Service**: Auth0
- **Flow**: Flutter app authenticates users → retrieves access token → passes it to backend for secure API access

### 🌍 External API
- **Spoonacular API** – Used to generate and filter recipes by ingredient, calories, and nutrients

## 🧭 System Architecture

```
         [Flutter App]
          |        \
   (AI Ingredient)  (User Input)
          |           |
          v           v
     [Spring Boot Backend] <----> [Auth0 Authentication]
          |
          v
      [MongoDB Atlas]
          |
          v
   [Spoonacular API Integration]
```

## 🧪 MVP Features

| Feature | Description | Status |
|---------|-------------|--------|
| Ingredient input | User types or uploads photo | 🚧 **Placeholder Ready** |
| AI ingredient detection | Detects ingredients via ML model | 🧠 **In Progress** |
| Recipe generator | Fetches recipes via Spoonacular | 🚧 **Placeholder Ready** |
| Nutrition filters | Filter by protein, calories, etc. | 🚧 **Placeholder Ready** |
| Authentication | Auth0 login & token validation | 🚧 **Placeholder Ready** |
| Web support | Next.js app with responsive design | ✅ **Completed** |

## 🏗️ Project Structure & Placeholders

This project is set up with **placeholder implementations** to allow you to build the features yourself:

### Frontend Structure
```
frontend/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── page.tsx           # Home page (✅ Complete)
│   │   ├── search/            # Search page (🚧 Placeholder)
│   │   └── auth/              # Auth pages (🚧 Placeholder)
│   ├── components/            # Reusable components
│   │   ├── ui/                # Basic UI components (✅ Complete)
│   │   └── layout/            # Layout components (✅ Complete)
│   ├── lib/                   # Utilities and API
│   │   ├── api.ts             # API functions (🚧 Placeholder)
│   │   └── utils.ts           # Helper functions (✅ Complete)
│   └── types/                 # TypeScript type definitions (✅ Complete)
```

### What's Ready vs. What Needs Implementation

#### ✅ **Ready to Use:**
- **UI Components**: Button, Input, Card components with Tailwind styling
- **Layout**: Header, Footer, responsive design
- **Type Definitions**: Complete TypeScript interfaces for all data models
- **Utility Functions**: Form validation, time formatting, etc.
- **Project Structure**: Organized, scalable architecture

#### 🚧 **Placeholders for You to Implement:**
- **API Integration**: All API calls are stubbed with `throw new Error('Not implemented yet')`
- **Authentication**: Login/register forms ready, but no actual auth logic
- **Recipe Search**: UI ready, but no actual search functionality
- **Camera Integration**: Placeholder for ingredient scanning
- **State Management**: Structure ready, but no actual state logic

#### 🎯 **Your Implementation Tasks:**
1. **Connect to Backend**: Implement actual API calls in `src/lib/api.ts`
2. **Add Authentication**: Integrate with Auth0 or implement custom auth
3. **Build Recipe Search**: Connect to Spoonacular API or your backend
4. **Implement Camera**: Add image capture and AI ingredient detection
5. **Add State Management**: Use Zustand or Context for app state
6. **Enhance UI**: Add loading states, error handling, animations

## 🚀 Getting Started

### Prerequisites
- Node.js (18.0 or higher)
- npm or yarn package manager
- Java 17 or higher
- Maven 3.6 or higher
- MongoDB (local or Atlas)
- Python 3.8+ (for AI module, optional)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/lazysince87/brokebites.git
   cd brokebites/backend/demo
   ```

2. **Configure MongoDB**
   - Update `src/main/resources/application.properties` with your MongoDB connection string
   - For local MongoDB: `mongodb://localhost:27017/brokebites`
   - For MongoDB Atlas: Use your Atlas connection string

3. **Run the backend**
   ```bash
   ./mvnw spring-boot:run
   ```
   The API will be available at `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at `http://localhost:3000`

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

### Environment Configuration

Create a `.env` file in the backend directory:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/brokebites

# Auth0 Configuration (for production)
AUTH0_DOMAIN=your-auth0-domain
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret

# Spoonacular API (for recipe data)
SPOONACULAR_API_KEY=your-spoonacular-api-key

# AI Service Configuration
AI_SERVICE_ENDPOINT=http://localhost:5000/api/detect-ingredients
```

## 📱 App Screenshots

### Home Screen
- Quick ingredient input
- Recent and popular recipes
- Camera integration for ingredient scanning

### Recipe Discovery
- Advanced filtering options
- Nutrition information display
- Save and share functionality

### Profile Management
- User preferences
- Saved recipes collection
- Dietary restrictions management

## 🔧 API Documentation

### Recipe Endpoints
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/{id}` - Get recipe by ID
- `POST /api/recipes/search` - Search recipes by ingredients
- `POST /api/recipes/search/filters` - Search with filters
- `GET /api/recipes/saved` - Get saved recipes
- `POST /api/recipes/{id}/save` - Save a recipe
- `DELETE /api/recipes/{id}/unsave` - Unsave a recipe

### Ingredient Endpoints
- `GET /api/ingredients` - Get all ingredients
- `POST /api/ingredients/detect` - Detect ingredients from image
- `GET /api/ingredients/search?q={query}` - Search ingredients
- `GET /api/ingredients/category/{category}` - Get by category

### User Endpoints
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `PUT /api/users/{id}/preferences` - Update preferences
- `POST /api/users/{id}/saved-recipes/{recipeId}` - Add saved recipe
- `DELETE /api/users/{id}/saved-recipes/{recipeId}` - Remove saved recipe

## ⚠️ Risk Management Plan

### Identified Risks
- **User**: Low engagement due to UI or slow performance
- **External**: Competing recipe/food apps
- **Technical**: AI misclassification, backend downtime, security issues

### Treatment Strategies
- Gather user feedback early to refine UI/UX
- Implement confidence thresholds & manual ingredient edits for AI fixes
- Cache API responses to reduce API call costs
- Continuous integration tests for backend endpoints
- Weekly reviews of AI accuracy
- Regular feedback surveys from test users

## 🧱 Development Environment Summary

| Component | Tool | Command |
|-----------|------|---------|
| Backend | Spring Boot | `./mvnw spring-boot:run` |
| Frontend | Next.js | `npm run dev` |
| Database | MongoDB Atlas | Cloud-hosted |
| Auth | Auth0 | Config via .env |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@brokebites.app or join our Discord community.

## 🙏 Acknowledgments

- Team JAMBOREE for the amazing collaboration
- Flutter and Spring Boot communities for excellent documentation
- Spoonacular API for recipe data
- MongoDB for database services

---

<div align="center">
  <p>Made with ❤️ by Team JAMBOREE</p>
  <p>🥗 BrokeBites - Smart Meal Planning Made Simple</p>
</div>