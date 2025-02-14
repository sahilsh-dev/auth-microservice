# Express Auth Microservice
A simple Express API for user registration, login, and search using MongoDB and JWT.

## Setup
Clone & Install:
```bash
git clone https://github.com/sahilsh-dev/auth-microservice
cd auth-microservice
npm install
```

Run:
```bash
npm run dev
```

## Endpoints

- POST `/api/register` – Register user
- POST `/api/login` – Login & get JWT
- GET `/api/users/search` – Search user (JWT required)
