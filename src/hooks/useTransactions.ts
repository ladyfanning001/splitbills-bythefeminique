import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, Transaction, CreateTransactionData, UpdateTransactionData } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Query keys
export const QUERY_KEYS = {
  transactions: ['transactions'] as const,
  transaction: (id: number) => ['transactions', id] as const,
};

// Hook to fetch all transactions
export const useTransactions = () => {
  return useQuery({
    queryKey: QUERY_KEYS.transactions,
    queryFn: async () => {
      console.log('🔍 useTransactions: Starting fetch...');
      try {
        const result = await apiService.getTransactions();
        console.log('✅ useTransactions: Success', result);
        return result;
      } catch (error) {
        console.error('❌ useTransactions: Failed', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      console.error(`❌ useTransactions retry ${failureCount}:`, error);
      return failureCount < 2; // Retry up to 2 times
    },
  });
};

// Hook to create a new transaction
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateTransactionData) => apiService.createTransaction(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions });
      const splitAmount = (data.amount / 2).toFixed(2);
      toast({
        title: "Transaction added! ✨",
        description: `${data.payer} paid $${data.amount} - Split: $${splitAmount} each`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding transaction",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook to update a transaction
export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTransactionData }) =>
      apiService.updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions });
    },
    onError: (error) => {
      toast({
        title: "Error updating transaction",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook to delete a transaction
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => apiService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions });
      toast({
        title: "Transaction deleted",
        description: "The transaction has been removed",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting transaction",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook to toggle paid status
export const useToggleTransactionPaid = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, paid }: { id: number; paid: boolean }) =>
      apiService.toggleTransactionPaid(id, paid),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions });
      toast({
        title: data.paid ? "Marked as paid! 💰" : "Marked as unpaid",
        description: data.paid ? "This expense has been settled" : "This expense is now pending",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating payment status",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Hook for calculating balances (helper hook)
export const useCalculateBalance = (transactions: Transaction[] = []) => {
  const getTotalBalance = () => {
    let yasminBalance = 0;
    transactions.forEach(transaction => {
      if (!transaction.paid) {
        const splitAmount = transaction.amount / 2;
        if (transaction.payer === "Yasmin") {
          yasminBalance += splitAmount;
        } else {
          yasminBalance -= splitAmount;
        }
      }
    });
    return yasminBalance;
  };

  const getBalanceMessage = () => {
    const balance = getTotalBalance();
    if (Math.abs(balance) < 0.01) {
      return "You're all settled up! 🎉";
    } else if (balance > 0) {
      return `Ladya owes Yasmin $${Math.abs(balance).toFixed(2)} total 💰`;
    } else {
      return `Yasmin owes Ladya $${Math.abs(balance).toFixed(2)} total 💰`;
    }
  };

  const getOweMessage = (transaction: Transaction) => {
    const otherPerson = transaction.payer === "Yasmin" ? "Ladya" : "Yasmin";
    const splitAmount = (transaction.amount / 2).toFixed(2);
    return `${otherPerson} owes ${transaction.payer} $${splitAmount} 💸`;
  };

  return {
    getTotalBalance,
    getBalanceMessage,
    getOweMessage,
  };
};
