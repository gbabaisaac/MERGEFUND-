import React from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaymentsIcon from '@mui/icons-material/Payments';

export default function EarningsPopup({ open, onClose }) {
  // Mock data - replace with actual data from your backend
  const earningsData = {
    totalEarnings: 2500,
    monthlyEarnings: 850,
    pendingPayouts: 320,
    recentTransactions: [
      { id: 1, amount: 150, date: '2024-03-15', project: 'Project Alpha' },
      { id: 2, amount: 200, date: '2024-03-10', project: 'Project Beta' },
      { id: 3, amount: 100, date: '2024-03-05', project: 'Project Gamma' },
    ],
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#1E1E1E',
          color: '#fff',
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #333',
        pb: 2
      }}>
        <Typography variant="h6">Earnings Overview</Typography>
        <IconButton onClick={onClose} sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4, mt: 1 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#262626', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccountBalanceWalletIcon sx={{ color: '#7C4DFF', mr: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Earnings
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#fff' }}>
                  ${earningsData.totalEarnings}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#262626', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUpIcon sx={{ color: '#7C4DFF', mr: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    This Month
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#fff' }}>
                  ${earningsData.monthlyEarnings}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#262626', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PaymentsIcon sx={{ color: '#7C4DFF', mr: 1 }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Pending Payouts
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#fff' }}>
                  ${earningsData.pendingPayouts}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Transactions */}
        <Typography variant="h6" sx={{ mb: 2 }}>Recent Transactions</Typography>
        <Box sx={{ bgcolor: '#262626', borderRadius: 2, p: 2 }}>
          {earningsData.recentTransactions.map((transaction) => (
            <React.Fragment key={transaction.id}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                py: 2
              }}>
                <Box>
                  <Typography variant="subtitle1">{transaction.project}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(transaction.date).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ color: '#7C4DFF' }}>
                  +${transaction.amount}
                </Typography>
              </Box>
              {transaction.id !== earningsData.recentTransactions.length && (
                <Divider sx={{ borderColor: '#333' }} />
              )}
            </React.Fragment>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
