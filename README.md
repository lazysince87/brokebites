# 🥗 BrokeBites - Smart Meal Planning App

<div align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=java&logoColor=white" alt="Java" />
</div>

## 👥 Team Members & Roles

| Name | Role | Responsibilities |
|------|------|------------------|
| **Thuy** | Full Stack Developer & AI Engineer | Full stack development, MongoDB schema design, database management, and image recognition model for ingredient detection |
| **Kenzo** | Backend Developer | Spoonacular API integration and backend API development |
| **Diego** | Frontend Developer | React Native UI development and user experience design |
| **Fabian** | Frontend Developer | React Native UI development and API data display |

## 💡 Challenge Statement

Students often struggle with meal variety and nutrition, leading to food waste and unhealthy eating habits. Many have limited time, budgets, and cooking skills, making it difficult to plan balanced meals with what's already in their fridge.

## 🍴 Our Solution

BrokeBites is a smart meal-planning mobile app that uses AI ingredient recognition to generate recipes based on what users already have.

### Key Features:
- 📸 **AI Ingredient Detection**: Take photos or upload images to automatically detect ingredients
- 🧠 **Smart Recipe Generation**: Get personalized recipe suggestions based on available ingredients
- ⚙️ **Advanced Filtering**: Filter recipes by calories, protein, diet type, and cooking time
- 💾 **Recipe Management**: Save favorite recipes and track meal history
- 📱 **Cross-Platform**: Works on Android and iOS devices

## 🚀 Project Vision

**FOR** students who struggle with meal variety and nutrition,  
**WHO** often feel limited by their available ingredients and cooking skills,  
**THE** BrokeBites App  
**IS A** smart recipe suggestion platform  
**THAT** allows users to input or photograph their ingredients to receive tailored recipe ideas.  
**UNLIKE** generic recipe websites that overwhelm with irrelevant options,  
**OUR PRODUCT** uses AI-powered recognition and personalized suggestions to help students explore new meals while staying in their comfort zone, reducing food waste, and promoting healthier eating habits.

## 🧩 Technology Stack & Architecture

### 📱 Frontend (Mobile Application)
- **Framework**: React Native with Expo
- **Purpose**: Cross-platform mobile UI for recipe discovery, ingredient input, and camera AI integration
- **Key Technologies**:
  - `React Native` for native mobile components
  - `Expo` for development and deployment
  - `JavaScript/TypeScript` for type safety
  - `React Navigation` for app navigation
  - `Fetch API` for REST API requests
  - `React Native Camera` for image capture
  - `Auth0` for authentication
- **Platform**: Android and iOS mobile devices

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
  - `/api/ingredients/detect` → Process image input from React Native app
  - `/api/users` → Manage user data and preferences

### 🧠 AI Module
- **Language**: Python or integrated TensorFlow Lite model
- **Function**: Detect ingredients from images taken by the user
- **Tooling**: Pre-trained CNN model fine-tuned with labeled ingredient data
- **Integration**: Exposed as REST API endpoint for React Native app to consume

### 🗄️ Database
- **System**: MongoDB (Atlas or local)
- **Collections**:
  - `users` (Auth0 IDs, saved recipes)
  - `recipes` (API data, custom user recipes)
  - `ingredients` (recognized ingredient tags)
- **Connector**: Spring Data MongoDB

### 🔐 Authentication
- **Service**: Auth0
- **Flow**: React Native app authenticates users → retrieves access token → passes it to backend for secure API access

### 🌍 External API
- **Spoonacular API** – Used to generate and filter recipes by ingredient, calories, and nutrients

## 🧭 System Architecture

```
      [React Native App]
          |        \
   (AI Ingredient)  (User Input)
          |           |
          v           v
     [Spring Boot Backend] <----> [Auth0 Authentication]
          |           |
          v           v
      [MongoDB]  [Spoonacular API]
```

## 🧪 MVP Features

| Feature | Description | Status |
|---------|-------------|--------|
| Ingredient input | User types or uploads photo | ✅ **Completed** |
| AI ingredient detection | Detects ingredients via ML model | 🧠 **In Progress** |
| Recipe generator | Fetches recipes via Spoonacular | 🚧 **In Progress** |
| Nutrition filters | Filter by protein, calories, etc. | 🚧 **Placeholder Ready** |
| Authentication | Auth0 login & token validation | ✅ **Completed** |
| Mobile UI | React Native app with responsive design | ✅ **Completed** |

## 🏗️ Project Structure

### Frontend Structure
```
frontend/
├── screens/
│   ├── RecipesScreen.js       # Recipe list page (✅ Complete)
│   ├── RecipeDetailScreen.js  # Recipe details (🚧 Placeholder)
│   └── ProfileScreen.js        # User profile (🚧 Placeholder)
├── components/
│   ├── LoginButton.js          # Auth0 login (✅ Complete)
│   ├── LogoutButton.js         # Auth0 logout (✅ Complete)
│   └── Profile.js              # User profile display (✅ Complete)
├── services/
│   └── api.js                  # API service layer (✅ Complete)
├── AuthContext.js              # Auth state management (✅ Complete)
└── App.js                      # Main app entry (✅ Complete)
```

### Backend Structure
```
backend/
├── src/main/java/com/example/demo/
│   ├── controller/
│   │   ├── RecipeController.java      # Recipe endpoints (✅ Complete)
│   │   ├── IngredientController.java  # Ingredient endpoints (✅ Complete)
│   │   └── UserController.java        # User endpoints (✅ Complete)
│   ├── model/
│   │   ├── Recipe.java                # Recipe model (✅ Complete)
│   │   ├── Ingredient.java            # Ingredient model (✅ Complete)
│   │   └── User.java                  # User model (✅ Complete)
│   ├── repository/
│   │   ├── RecipeRepository.java      # Recipe DB access (✅ Complete)
│   │   ├── IngredientRepository.java  # Ingredient DB access (✅ Complete)
│   │   └── UserRepository.java        # User DB access (✅ Complete)
│   └── service/
│       ├── RecipeService.java         # Recipe business logic (🚧 In Progress)
│       ├── IngredientService.java     # Ingredient logic (🚧 In Progress)
│       └── UserService.java           # User logic (🚧 In Progress)
└── src/main/resources/
    └── application.properties         # Configuration (✅ Complete)
```

### What's Ready vs. What Needs Implementation

#### ✅ **Ready to Use:**
- **React Native UI**: Recipe list, authentication, profile components
- **Backend API Structure**: All controllers and models defined
- **Database Schema**: MongoDB collections and repositories set up
- **Authentication**: Auth0 integration in React Native
- **API Service**: Frontend service layer for backend communication

#### 🚧 **In Progress:**
- **Spoonacular Integration**: Connecting to recipe API
- **AI Ingredient Detection**: Image processing and ingredient recognition
- **Recipe Search**: Advanced filtering and search functionality
- **Service Layer**: Business logic implementation in backend

#### 🎯 **Next Steps:**
1. **Complete Spoonacular Integration**: Fetch and store recipe data
2. **Implement AI Detection**: Build/integrate ingredient recognition model
3. **Enhance Recipe Search**: Add filters for calories, protein, diet type
4. **Add Recipe Details**: Create detailed recipe view screen
5. **Implement Favorites**: Save and manage favorite recipes
6. **Add Camera Integration**: Direct camera access for ingredient scanning

## 🚀 Getting Started

### Prerequisites
- Node.js (18.0 or higher)
- npm or yarn package manager
- Expo CLI (`npm install -g expo-cli`)
- Java 17 or higher
- Maven 3.6 or higher
- MongoDB (local or Atlas)
- Python 3.8+ (for AI module, optional)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/lazysince87/brokebites.git
   cd brokebites/backend
   ```

2. **Configure MongoDB**
   - Update `src/main/resources/application.properties` with MongoDB connection string
   - For local MongoDB: `mongodb://localhost:27017/brokebites`
   - For MongoDB Atlas: Use your Atlas connection string

3. **Configure Auth0 (Optional for now)**
   - Comment out Spring Security dependency in `pom.xml` for demo
   - Add back later when implementing full authentication

4. **Run the backend**
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
   ```

3. **Set up environment variables**
   Create a `.env` file:
   ```env
   AUTH0_DOMAIN=auth0-domain
   AUTH0_CLIENT_ID=client-id
   ```

4. **Update API URL**
   In `services/api.js`, update the API base URL:
   ```javascript
   // For iOS Simulator
   const API_BASE_URL = 'http://localhost:8080/api';
   
   // For Android Emulator
   const API_BASE_URL = 'http://10.0.2.2:8080/api';
   
   // For Physical Device (replace with your computer's IP)
   const API_BASE_URL = 'http://192.168.1.XXX:8080/api';
   ```

5. **Run the app**
   ```bash
   # Start Expo development server
   npm start
   
   # Or with tunnel (for physical devices)
   npx expo start --tunnel
   
   # For iOS simulator
   npx expo start --ios
   
   # For Android emulator
   npx expo start --android
   ```

### Database Setup

1. **Install MongoDB (if using local)**
   ```bash
   # macOS
   brew install mongodb-community
   brew services start mongodb-community
   
   # Linux
   sudo apt-get install mongodb
   sudo systemctl start mongod
   ```

2. **Add sample data**
   ```bash
   mongosh
   use brokebites
   
   db.recipes.insertMany([
     {
       title: "Quick Pasta",
       description: "Easy pasta dish for students",
       prepTimeMinutes: 10,
       cookTimeMinutes: 15,
       servings: 2,
       ingredients: ["pasta", "tomato sauce", "cheese"],
       instructions: ["Boil pasta", "Add sauce", "Top with cheese"],
       tags: ["quick", "easy", "italian"],
       rating: 4.5,
       reviewCount: 100,
       createdAt: new Date()
     }
   ])
   ```

### Environment Configuration

Create a `.env` file in the backend directory:
```env
# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017/brokebites

# Auth0 Configuration (for production)
auth0.domain=auth0-domain
auth0.client-id=client-id
auth0.client-secret=client-secret

# Spoonacular API (for recipe data)
spoonacular.api.key=spoonacular-api-key
spoonacular.api.base-url=https://api.spoonacular.com

# AI Service Configuration
ai.service.endpoint=http://localhost:5000/api/detect-ingredients
```

### Recipes Screen
- Recipe list with fetch button
- Pull-to-refresh functionality
- Recipe cards with details

### Authentication
- Auth0 login integration
- User profile display
- Logout functionality

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
- `GET /api/recipes/popular` - Get popular recipes
- `GET /api/recipes/recent` - Get recent recipes

### Ingredient Endpoints
- `GET /api/ingredients` - Get all ingredients
- `POST /api/ingredients/detect` - Detect ingredients from image
- `POST /api/ingredients/search` - Search ingredients
- `GET /api/ingredients/category/{category}` - Get by category
- `POST /api/ingredients` - Create ingredient
- `PUT /api/ingredients/{id}` - Update ingredient
- `DELETE /api/ingredients/{id}` - Delete ingredient

### User Endpoints
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/email/{email}` - Get user by email
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `PUT /api/users/{id}/preferences` - Update preferences
- `POST /api/users/{id}/saved-recipes/{recipeId}` - Add saved recipe
- `DELETE /api/users/{id}/saved-recipes/{recipeId}` - Remove saved recipe
- `POST /api/users/{id}/favorite-ingredients/{ingredientName}` - Add favorite ingredient
- `DELETE /api/users/{id}/favorite-ingredients/{ingredientName}` - Remove favorite ingredient

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
| Frontend | React Native + Expo | `npm start` |
| Database | MongoDB | `mongosh` or MongoDB Compass |
| Auth | Auth0 | Config via .env |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Team JAMBOREE for the amazing collaboration
- React Native and Spring Boot communities for excellent documentation
- Spoonacular API for recipe data
- MongoDB for database services
- Auth0 for authentication services

---

<div align="center">
  <p>Made with ❤️ by Team JAMBOREE</p>
  <p>🥗 BrokeBites - Smart Meal Planning Made Simple</p>
</div>