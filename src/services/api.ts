export interface Transaction {
  id: number;
  payer: string;
  description: string;
  amount: number;
  timestamp: string;
  paid: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTransactionData {
  payer: string;
  description: string;
  amount: number;
  paid?: boolean;
}

export interface UpdateTransactionData {
  payer?: string;
  description?: string;
  amount?: number;
  paid?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('🔍 API Request:', url);
    console.log('🔍 API Base URL:', API_BASE_URL);
    console.log('🔍 Full URL:', url);
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      console.log('📡 API Response:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API Data:', data);
      return data;
    } catch (error) {
      console.error('❌ Network Error:', error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to backend server. Please make sure it is running on port 3001.');
      }
      throw error;
    }
  }

  // Get all transactions
  async getTransactions(): Promise<Transaction[]> {
    return this.request<Transaction[]>('/transactions');
  }

  // Create a new transaction
  async createTransaction(data: CreateTransactionData): Promise<Transaction> {
    return this.request<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Update a transaction
  async updateTransaction(id: number, data: UpdateTransactionData): Promise<Transaction> {
    return this.request<Transaction>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Delete a transaction
  async deleteTransaction(id: number): Promise<void> {
    await this.request<void>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  // Toggle paid status of a transaction
  async toggleTransactionPaid(id: number, paid: boolean): Promise<Transaction> {
    return this.updateTransaction(id, { paid });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.request<{ status: string; message: string }>('/health');
  }
}

export const apiService = new ApiService();
