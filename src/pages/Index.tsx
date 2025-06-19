
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkle, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: number;
  payer: string;
  description: string;
  amount: number;
  timestamp: Date;
  paid: boolean;
}

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payer, setPayer] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!payer || !description || !amount) {
      toast({
        title: "Oops! 🙈",
        description: "Please fill in all fields before adding a transaction",
        variant: "destructive",
      });
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now(),
      payer,
      description,
      amount: parseFloat(amount),
      timestamp: new Date(),
      paid: false,
    };

    setTransactions([newTransaction, ...transactions]);
    
    // Reset form
    setPayer("");
    setDescription("");
    setAmount("");

    const splitAmount = (parseFloat(amount) / 2).toFixed(2);
    toast({
      title: "Transaction added! ✨",
      description: `${payer} paid $${amount} - Split: $${splitAmount} each`,
    });
  };

  const handlePaidToggle = (transactionId: number) => {
    setTransactions(transactions.map(transaction => 
      transaction.id === transactionId 
        ? { ...transaction, paid: !transaction.paid }
        : transaction
    ));
  };

  const getOweMessage = (transaction: Transaction) => {
    const otherPerson = transaction.payer === "Yasmin" ? "Ladya" : "Yasmin";
    const splitAmount = (transaction.amount / 2).toFixed(2);
    return `${otherPerson} owes ${transaction.payer} $${splitAmount} 💸`;
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Split Bills ✨
          </h1>
          <p className="text-gray-600 text-lg">
            For Yasmin & Ladya 💕
          </p>
        </div>

        {/* Balance Summary */}
        {transactions.length > 0 && (
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-6 text-center">
              <div className="text-2xl mb-2">💝</div>
              <p className="text-lg font-semibold text-gray-800">
                {getBalanceMessage()}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Add Transaction Form */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl rounded-3xl overflow-hidden animate-scale-in">
          <CardHeader className="bg-gradient-to-r from-pink-200 to-purple-200 pb-4">
            <CardTitle className="text-center text-2xl font-semibold text-gray-800 flex items-center justify-center gap-2">
              <Heart className="w-6 h-6 text-pink-500" />
              Add Expense
              <Heart className="w-6 h-6 text-pink-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payer" className="text-sm font-medium text-gray-700">
                  Who paid? 💳
                </Label>
                <Select value={payer} onValueChange={setPayer}>
                  <SelectTrigger className="rounded-2xl border-2 border-pink-200 focus:border-purple-300 bg-white/50">
                    <SelectValue placeholder="Select payer..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                    <SelectItem value="Yasmin" className="rounded-xl m-1 focus:bg-pink-100">
                      Yasmin 🌸
                    </SelectItem>
                    <SelectItem value="Ladya" className="rounded-xl m-1 focus:bg-purple-100">
                      Ladya 🦋
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  What for? 📝
                </Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Dinner, Movie tickets..."
                  className="rounded-2xl border-2 border-pink-200 focus:border-purple-300 bg-white/50 placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                  How much? 💰
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="rounded-2xl border-2 border-pink-200 focus:border-purple-300 bg-white/50 placeholder:text-gray-400"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white rounded-2xl py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Sparkle className="w-5 h-5 mr-2" />
                Add Transaction
                <Sparkle className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Transaction History */}
        {transactions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Recent Expenses 📋
            </h2>
            
            <div className="space-y-3">
              {transactions.map((transaction, index) => (
                <Card
                  key={transaction.id}
                  className={`backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in ${
                    transaction.paid ? 'bg-green-50/70' : 'bg-white/70'
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className={`font-semibold text-lg ${transaction.paid ? 'text-green-800 line-through' : 'text-gray-800'}`}>
                          {transaction.description}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Paid by {transaction.payer} • ${transaction.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Split: ${(transaction.amount / 2).toFixed(2)} each
                        </p>
                      </div>
                      <div className="text-2xl">
                        {transaction.payer === "Yasmin" ? "🌸" : "🦋"}
                      </div>
                    </div>
                    
                    <div className={`p-3 rounded-xl text-sm font-medium mb-3 ${
                      transaction.payer === "Yasmin" 
                        ? "bg-purple-100 text-purple-700" 
                        : "bg-pink-100 text-pink-700"
                    } ${transaction.paid ? 'opacity-50' : ''}`}>
                      {transaction.paid ? "✅ Settled!" : getOweMessage(transaction)}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`paid-${transaction.id}`}
                        checked={transaction.paid}
                        onCheckedChange={() => handlePaidToggle(transaction.id)}
                        className="border-2 border-pink-300 data-[state=checked]:bg-pink-400 data-[state=checked]:border-pink-400"
                      />
                      <Label 
                        htmlFor={`paid-${transaction.id}`} 
                        className="text-sm font-medium text-gray-700 cursor-pointer"
                      >
                        Mark as paid 💰
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {transactions.length === 0 && (
          <Card className="backdrop-blur-sm bg-white/60 border-0 shadow-lg rounded-2xl">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">💕</div>
              <p className="text-gray-600 text-lg">
                No expenses yet! Add your first transaction above ✨
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
