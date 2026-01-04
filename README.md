# CAF Amjade & BATTAL Mohammed Othmane Bank - eBank Project

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-brightgreen)
![React](https://img.shields.io/badge/React-19.2.3-blue)
![JWT](https://img.shields.io/badge/JWT-Enabled-orange)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)

Full-stack eBank application with Spring Boot backend and React frontend, featuring JWT authentication, role-based access control, and comprehensive banking operations.

# You need to configure smtp with a mail in application.proprties

## 🚀 Features

### Backend (Spring Boot)
- **JWT Authentication** with 1-hour token expiration
- **Role-based Access Control** (AGENT_GUICHET, CLIENT)
- **RESTful API** for all banking operations
- **Email Service** for sending credentials to new clients
- **Transaction Management** with Spring Data JPA
- **Business Rule Validation** (RG_1 to RG_15)

### Frontend (React)
- **Modern UI** with React Hooks
- **JWT Token Management** with automatic expiration handling
- **Role-based Navigation** and routing
- **Real-time Form Validation**
- **Responsive Design** with Bootstrap

## 📋 Business Rules Implemented

✅ RG_1: BCrypt password encryption  
✅ RG_2: French error messages  
✅ RG_3: JWT 1-hour expiration  
✅ RG_4: Unique identity number validation  
✅ RG_5: Required field validation  
✅ RG_6: Unique email validation  
✅ RG_7: Email credentials to new clients  
✅ RG_8: Customer identity verification  
✅ RG_9: RIB format validation (MA + 22 digits)  
✅ RG_10: Account status management  
✅ RG_11: Account status check before transfer  
✅ RG_12: Balance verification  
✅ RG_13: Debit operation  
✅ RG_14: Credit operation  
✅ RG_15: Transaction tracing  

## 🛠️ Technologies Used

### Backend
- Spring Boot 3.5.6
- Spring Security + JWT
- Spring Data JPA
- MySQL 8
- Spring Mail (Gmail SMTP)
- ModelMapper
- Lombok

### Frontend
- React 19.2.3
- React Router DOM
- Axios
- JWT Decode
- Bootstrap 5
- React Icons

## 📁 Project Structure

```
ProjetArchitecture/
├── bank-service-graphql-main/    # Spring Boot Backend
│   ├── src/main/java/
│   │   ├── config/               # Security, CORS, DataInitializer
│   │   ├── dao/                  # JPA Repositories
│   │   ├── dtos/                 # Data Transfer Objects
│   │   ├── presentation/rest/    # REST Controllers
│   │   ├── security/             # JWT, Filters, UserDetailsService
│   │   └── service/              # Business Logic & Entities
│   └── src/main/resources/
│       └── application.properties
└── interface-react/               # React Frontend
    ├── src/
    │   ├── components/
    │   │   ├── auth/             # Login, ChangePassword
    │   │   ├── agent/            # AddClient, AddBankAccount
    │   │   ├── client/           # Dashboard, Transfer
    │   │   ├── common/           # ProtectedRoute
    │   │   └── layout/           # Navigation, Layout
    │   └── services/             # API & Auth Services
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 16+
- MySQL 8 (WampServer)
- Maven 3+

### Backend Setup

1. **Start MySQL** (WampServer)

2. **Configure Database** (if needed):
   ```properties
   # src/main/resources/application.properties
   spring.datasource.url=jdbc:mysql://localhost:3306/ebankprj_db?createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=
   ```

3. **Run Backend**:
   ```bash
   cd bank-service-graphql-main
   mvn clean install
   mvn spring-boot:run
   ```

   Backend will start on `http://localhost:8080`

### Frontend Setup

1. **Install Dependencies**:
   ```bash
   cd interface-react
   npm install
   ```

2. **Start Frontend**:
   ```bash
   npm start
   ```

   Frontend will open on `http://localhost:3000`

## 🔐 Test Credentials

### Agent (ROLE_AGENT_GUICHET)
- **Username**: `agent1`
- **Password**: `agent123`

**Access to:**
- Create new clients
- Create bank accounts

### Client (ROLE_CLIENT)
- **Username**: `aclient`
- **Password**: `client123`

**Access to:**
- View dashboard
- View transactions (paginated)
- Execute transfers

## 📚 API Endpoints

### Authentication
- `POST /api/rest/auth/login` - User login (public)
- `POST /api/rest/auth/change-password` - Change password

### Customer Management (AGENT only)
- `POST /api/rest/customer/create` - Create new client
- `GET /api/rest/customer/all` - Get all customers

### Bank Account Management (AGENT only)
- `POST /api/rest/bank/create` - Create bank account
- `GET /api/rest/bank/all` - Get all accounts

### Dashboard (CLIENT only)
- `GET /api/rest/dashboard` - Get client dashboard
  - Query params: `?rib={rib}&page={page}&size={size}`

### Transfers (CLIENT only)
- `POST /api/rest/transaction/transfer` - Execute transfer

## 🎨 Features Highlights

### For Agents
1. **Add Client**: Form with validation (age 18+, unique email/ID)
2. **Create Account**: RIB validation (24 chars: MA + 22 digits)
3. **Email Notification**: Auto-send credentials to new clients

### For Clients
1. **Dashboard**: View accounts, balance, and recent transactions
2. **Transfers**: Execute bank transfers with validation
3. **Multi-account Support**: Handle multiple accounts per client
4. **Pagination**: Navigate through transaction history

## 🔒 Security Features

- **JWT Tokens**: Stateless authentication
- **Password Hashing**: BCrypt encryption
- **CORS**: Configured for React frontend
- **Role-based Authorization**: `@PreAuthorize` annotations
- **Token Expiration**: Auto-logout after 1 hour
- **SSL Email**: Secure SMTP configuration

## 👥 Contributors

- **CAF Amjade** (GitHub: [@amjadecaf](https://github.com/amjadecaf))
- **BATTAL Mohammed Othmane** 

## 📄 License

Academic project - CAF Amjade & BATTAL Mohammed Othmane Bank

---




