import React, { useState, useEffect } from 'react'
import {
  Box, AppBar, Toolbar, Typography,
  Paper, IconButton
} from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import AddRepo from './components/AddRepo'
import RepoList from './components/RepoList'

export default function App() {
  const [repos, setRepos] = useState([])

  useEffect(() => {
    chrome.storage.local.get('repos', ({ repos: saved }) =>
      setRepos(saved || [])
    )
  }, [])

  useEffect(() => {
    chrome.storage.local.set({ repos })
  }, [repos])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'transparent', color: '#333' }}>
        <Toolbar sx={{ justifyContent: 'center' }}>
          <IconButton edge="start"><GitHubIcon /></IconButton>
          <Typography variant="h6">MergeFund</Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
        <Paper elevation={6} sx={{ borderRadius: 3, p: 2 }}>
          <AddRepo repos={repos} onSave={setRepos} />
          <RepoList repos={repos} />
        </Paper>
      </Box>
    </Box>
  )
}
