# Split Bills Backend Setup Guide

## 🚀 Quick Start

### 1. Set up Supabase Database

1. **Create a Supabase account** at [supabase.com](https://supabase.com)
2. **Create a new project**
3. **Set up the database schema**:
   - Go to the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `backend/schema.sql`
   - Run the SQL script to create the transactions table

### 2. Configure Environment Variables

1. **Get your Supabase credentials**:
   - Go to Settings > API in your Supabase dashboard
   - Copy the "Project URL" and "anon/public" key

2. **Update backend/.env**:
   ```env
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   PORT=3001
   ```

### 3. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
npm run backend:install
```

### 4. Run the Application

#### Option 1: Run both frontend and backend together (Recommended)
```bash
npm run full-dev
```

#### Option 2: Run them separately
```bash
# Terminal 1 - Backend
npm run backend:dev

# Terminal 2 - Frontend  
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 🔧 API Endpoints

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create a new transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction
- `GET /api/health` - Health check

## 🗃️ Database Schema

The `transactions` table includes:
- `id` - Auto-incrementing primary key
- `payer` - Who paid ('Yasmin' or 'Ladya')
- `description` - What the expense was for
- `amount` - How much was paid (decimal)
- `paid` - Whether the debt has been settled (boolean)
- `timestamp` - When the transaction occurred
- `created_at` - When the record was created
- `updated_at` - When the record was last updated

## 🎯 Features

✅ **Persistent Storage** - All transactions are saved to Supabase
✅ **Real-time Updates** - UI updates immediately after API calls
✅ **Loading States** - Shows loading indicators during API operations
✅ **Error Handling** - Graceful error messages and retry options
✅ **Data Validation** - Both frontend and backend validation
✅ **Delete Transactions** - Remove transactions with confirmation
✅ **Responsive Design** - Works great on mobile and desktop

## 🛠️ Development Scripts

- `npm run dev` - Start frontend development server
- `npm run backend:dev` - Start backend development server (with auto-reload)
- `npm run backend:start` - Start backend production server
- `npm run full-dev` - Start both frontend and backend together
- `npm run build` - Build frontend for production
- `npm run lint` - Run ESLint

## 📱 Usage

1. Select who paid for the expense
2. Enter a description (e.g., "Dinner", "Movie tickets")
3. Enter the amount
4. Click "Add Transaction"
5. View the balance summary and transaction history
6. Mark transactions as paid when settled
7. Delete transactions if needed

## 🚨 Troubleshooting

### Backend won't start
- Make sure you've set up the `.env` file with correct Supabase credentials
- Check that port 3001 is available
- Run `npm run backend:install` to ensure dependencies are installed

### Frontend can't connect to backend
- Make sure the backend is running on port 3001
- Check that `VITE_API_BASE_URL` in `.env` is set correctly
- Verify there are no CORS issues

### Database errors
- Ensure you've run the `schema.sql` script in Supabase
- Check your Supabase credentials are correct
- Verify your Supabase project is active

Enjoy tracking your expenses! 💕✨
