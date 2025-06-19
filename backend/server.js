import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080', 'http://127.0.0.1:8080', 'http://192.168.30.14:8080'],
  credentials: true
}));
app.use(express.json());

// Routes

// Root endpoint for debugging
app.get('/', (req, res) => {
  res.json({ 
    message: 'Split Bills Backend is running!',
    endpoints: {
      health: '/api/health',
      test: '/api/test', 
      transactions: '/api/transactions'
    }
  });
});

// Get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    console.log('📥 GET /api/transactions - Fetching transactions...');
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('❌ Error fetching transactions:', error);
      return res.status(500).json({ error: 'Failed to fetch transactions' });
    }

    console.log('✅ Successfully fetched transactions:', data?.length || 0, 'records');
    res.json(data || []);
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { payer, description, amount, paid = false } = req.body;

    // Validate required fields
    if (!payer || !description || !amount) {
      return res.status(400).json({ 
        error: 'Missing required fields: payer, description, and amount are required' 
      });
    }

    // Validate amount is a number
    if (isNaN(parseFloat(amount))) {
      return res.status(400).json({ 
        error: 'Amount must be a valid number' 
      });
    }

    const transactionData = {
      payer,
      description,
      amount: parseFloat(amount),
      paid,
      timestamp: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('transactions')
      .insert([transactionData])
      .select()
      .single();

    if (error) {
      console.error('Error creating transaction:', error);
      return res.status(500).json({ error: 'Failed to create transaction' });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a transaction (mainly for toggling paid status)
app.put('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { paid, payer, description, amount } = req.body;

    // Build update object with only provided fields
    const updateData = {};
    if (paid !== undefined) updateData.paid = paid;
    if (payer !== undefined) updateData.payer = payer;
    if (description !== undefined) updateData.description = description;
    if (amount !== undefined) updateData.amount = parseFloat(amount);

    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating transaction:', error);
      return res.status(500).json({ error: 'Failed to update transaction' });
    }

    if (!data) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a transaction
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting transaction:', error);
      return res.status(500).json({ error: 'Failed to delete transaction' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Split Bills API is running!' });
});

// Test endpoint to check Supabase connection
app.get('/api/test', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase connection error:', error);
      return res.status(500).json({ 
        status: 'ERROR', 
        message: 'Database connection failed', 
        error: error.message 
      });
    }
    
    res.json({ 
      status: 'OK', 
      message: 'Database connection successful',
      transactionCount: data?.length || 0
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Server error', 
      error: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Split Bills API server running on port ${port}`);
  console.log(`🔗 Health check: http://localhost:${port}/api/health`);
});
