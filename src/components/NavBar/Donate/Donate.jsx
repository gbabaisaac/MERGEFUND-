// src/components/Donate/Donate.jsx
import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  LinearProgress
} from '@mui/material'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

export default function Donate({ repo }) {
  const GOAL = 1000
  const STORAGE_KEY = `donation-${repo}`
  const [current, setCurrent] = useState(0)
  const [amount, setAmount] = useState('')

  useEffect(() => {
    const saved = parseFloat(localStorage.getItem(STORAGE_KEY) || '0')
    setCurrent(saved)
  }, [repo])

  const handleDonate = () => {
    const val = parseFloat(amount)
    if (!val || val <= 0) return
    const updated = current + val
    localStorage.setItem(STORAGE_KEY, updated)
    setCurrent(updated)
    setAmount('')
  }

  const progress = Math.min(100, (current / GOAL) * 100)

  return (
    <Card sx={{ bgcolor: '#1E1E1E', color: '#fff', m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AttachMoneyIcon sx={{ mr: 1, color: '#7C4DFF' }} />
          <Typography variant="h6">{repo}</Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 1 }}>
          Raised ${current.toFixed(2)} of ${GOAL.toFixed(2)}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 10,
            borderRadius: 5,
            bgcolor: '#262626',
            '& .MuiLinearProgress-bar': { bgcolor: '#7C4DFF' },
            mb: 2
          }}
        />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            label="Amount"
            variant="filled"
            size="small"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            InputProps={{ sx: { bgcolor: '#262626', color: '#fff' } }}
          />
          <Button
            variant="contained"
            onClick={handleDonate}
            sx={{ bgcolor: '#7C4DFF', '&:hover': { bgcolor: '#6930c3' } }}
          >
            Donate
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
