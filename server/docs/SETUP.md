# FoodSaver — Local Setup & Recovery Checklist

## Overview
This checklist covers everything needed to get FoodSaver running locally after 
cloning from GitHub. Follow steps in order — each section depends on the previous one.

---

## Step 1 — Prerequisites

Verify all required tools are installed:

```bash
node --version        # Should be >= 18.x
npm --version         # Should be >= 9.x
mongosh --version     # MongoDB shell
```

If any are missing:
- Node.js: https://nodejs.org
- MongoDB Shell: https://www.mongodb.com/try/download/shell

---

## Step 2 — Clone and Install

```bash
# Clone the repo
git clone https://github.com/sandyFit/foodSaver.git
cd foodSaver

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

## Step 3 — Environment Variables

This step is critical — misconfigured environment variables will cause runtime failures.


### Create `server/.env`

```bash
# Database
MONGO_URI=mongodb+srv://<username>:<password>@...

# Authentication
JWT_SECRET=<generate_a_long_random_string_min_32_chars>
JWT_EXPIRE_TIME=1d
COOKIE_EXPIRES_TIME=1

# Server
PORT=5555
NODE_ENV=development

# Optional — only needed for password reset emails
# EMAIL_HOST=
# EMAIL_PORT=
# EMAIL_USER=
# EMAIL_PASS=
```

### Generate a JWT Secret

```bash
# Run in terminal to generate a secure random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET`.

### Create `client/.env`

```bash
VITE_API_URL=http://localhost:5555/api
```

---

## Step 4 — MongoDB Connection

### Option A — Use existing Atlas cluster (recommended)
Your cluster is at `cluster0.qm5ds.mongodb.net`. 

1. Go to https://cloud.mongodb.com
2. Sign in to your account
3. Go to **Database Access** → verify your user exists
4. Go to **Network Access** → add your current IP address
5. Go to **Connect** → copy the connection string
6. Replace `<password>` in MONGO_URI with your actual password

### Option B — Run MongoDB locally
```bash
# Install MongoDB Community
# https://www.mongodb.com/try/download/community

# Start MongoDB
mongod --dbpath ./data/db
```

Update MONGO_URI:
```
MONGO_URI=mongodb://localhost:27017/foodSaver
```

---

## Step 5 — Verify Database

Open MongoDB Compass and connect to your cluster. Verify:

- [ ] `foodSaver` database exists
- [ ] `users` collection has expected documents
- [ ] `inventoryitems` collection exists
- [ ] `recipes` collection exists

If the database is empty, you'll need to seed test data (see Step 8).

---

## Step 6 — Start the Application

```bash
# Terminal 1 — Start backend
cd server
npm run dev
# Should show: Server running on port 5555
# Should show: MongoDB connected

# Terminal 2 — Start frontend  
cd client
npm run dev
# Should show: Local: http://localhost:5173
```

### Verify server is running
```bash
curl http://localhost:5555/api/health
# or open http://localhost:5555/api-docs in browser (Swagger)
```


Expected response

```json
{
  "status": "ok"
}

---

## Step 7 — Smoke Test Checklist

Test these manually in the browser before writing any automation:

### Authentication
- [ ] Register new user with unique email
- [ ] Login with registered credentials
- [ ] Logout
- [ ] Try registering with existing email → should show error
- [ ] Try login with wrong password → should show error

### Inventory
- [ ] Add a food item with expiration date
- [ ] Edit an existing item
- [ ] Delete an item
- [ ] View expiration alerts on dashboard

### Recipe Suggestions
- [ ] Request recipe suggestions with items in inventory
- [ ] Verify suggestions relate to inventory items

### Admin (if applicable)
- [ ] Login as admin
- [ ] View all users
- [ ] Delete a user

---

## Step 8 — Seed Test Data

If database is empty, create test users via API:

```bash
# Register admin user
curl -X POST http://localhost:5555/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Admin User",
    "email": "admin@foodsaver.com",
    "password": "Admin123!",
    "role": "admin"
  }'

# Register regular test user
curl -X POST http://localhost:5555/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "user@foodsaver.com",
    "password": "User123!"
  }'
```

Save these credentials — they'll be used in your test automation framework.

---

## Step 9 — API Documentation

FoodSaver has Swagger docs. Once the server is running:

```
http://localhost:5555/api-docs
```

Use this to explore and manually test all endpoints before automating them.

---

## Step 10 — Common Issues & Fixes

| Error | Cause | Fix |
|---|---|---|
| `500 Internal Server Error` on register | `JWT_SECRET` is undefined | Add `JWT_SECRET` to `server/.env` |
| `MongoServerError: bad auth` | Wrong MongoDB password | Update `MONGO_URI` with correct password |
| `ECONNREFUSED` | MongoDB not running | Start MongoDB or check Atlas network access |
| `El correo ya está registrado` after 500 | User created before JWT crash | Delete the partial user from MongoDB |
| `CORS error` in browser | Frontend/backend URL mismatch | Check `VITE_API_URL` in `client/.env` |
| `Cannot find module` | Dependencies not installed | Run `npm install` in server and client |
| Port already in use | Another process is using port 5555 | Windows: `netstat -ano \| findstr :5555` → `taskkill /PID <PID> /F` • Mac/Linux: `lsof -i :5555` → `kill -9 <PID>` • Or change PORT in `.env` |

### Delete a partially created user
```javascript
// In MongoDB Compass shell
db.users.deleteOne({ email: "problematic@email.com" })
```

---

## Step 11 — Before Writing Tests

Confirm all of these before starting the test framework:

- [ ] Server starts without errors
- [ ] Client starts without errors  
- [ ] MongoDB connection established
- [ ] Can register a new user
- [ ] Can login with registered user
- [ ] Can add inventory item
- [ ] Recipe suggestions return results
- [ ] Swagger docs accessible
- [ ] Admin user exists in database
- [ ] Regular test user exists in database

---

## Environment Files Summary

| File | Required Variables |
|---|---|
| `server/.env` | `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRE_TIME`, `PORT`, `NODE_ENV` |
| `client/.env` | `VITE_API_URL` |

**Never commit `.env` files to GitHub.** Verify both are in their respective `.gitignore` files.

---

## Test Credentials (Local Development)

Once seeded, use these in your test framework:

```typescript
// test-data/credentials.ts
export const testUsers = {
    admin: {
        email: 'admin@foodsaver.com',
        password: 'Admin123!'
    },
    regular: {
        email: 'user@foodsaver.com', 
        password: 'User123!'
    }
};
```

---

## Next Steps

- Add structured logging (Pino)
- TypeScript migration
- Implement automated API tests (Playwright / WebdriverIO)
- Add database seeding scripts
- Integrate CI pipeline (GitHub Actions / Jenkins)

---

*Last updated: May 2026 | FoodSaver v1.0*
