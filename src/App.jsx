// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  Button
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

// NavBar now lives here:
import NavBar from './components/NavBar/NavBar'
// Donate lives inside NavBar/Donate:
import Donate from './components/NavBar/Donate/Donate'

export default function App() {
  const [navOpen, setNavOpen]     = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  const [owner,   setOwner]   = useState(null)
  const [repo,    setRepo]    = useState(null)
  const [commits, setCommits] = useState([])
  const [filterText, setFilterText] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Detect GitHub repo from the current tab
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      const m = tab?.url?.match(/github\.com\/([^\/]+)\/([^\/#?]+)/)
      if (m) {
        setOwner(m[1])
        setRepo(m[2])
      }
    })
  }, [])

  // Fetch commits
  const fetchCommits = useCallback(async () => {
    if (!owner || !repo || !hasMore) return
    const perPage = 20
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=${perPage}&page=${page}`
    )
    if (!res.ok) return setHasMore(false)
    const data = await res.json()
    if (data.length < perPage) setHasMore(false)
    setCommits(prev => [...prev, ...data])
  }, [owner, repo, page, hasMore])

  useEffect(() => {
    fetchCommits()
  }, [fetchCommits])

  const filtered = commits.filter(c =>
    c.commit.message.toLowerCase().includes(filterText.toLowerCase())
  )

  return (
    <Box sx={{ display: 'flex', width: '100%', height: '100vh' }}>
      <NavBar
        open={navOpen}
        active={activeTab}
        onNavClick={setActiveTab}
      />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" elevation={0} sx={{ bgcolor: '#121212' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setNavOpen(o => !o)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </Typography>
          </Toolbar>
        </AppBar>

        {activeTab === 'donate' ? (
          <Donate repo={owner && repo ? `${owner}/${repo}` : '—/—'} />
        ) : (
          <>
            <Box sx={{ p: 1, bgcolor: '#1E1E1E' }}>
              <TextField
                fullWidth
                size="small"
                variant="filled"
                placeholder="Filter commits…"
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
                InputProps={{ sx: { bgcolor: '#262626', color: '#fff' } }}
              />
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: '#121212' }}>
              <Grid container spacing={2}>
                {filtered.map(c => (
                  <Grid item xs={12} key={c.sha}>
                    <Card
                      sx={{
                        bgcolor: '#1E1E1E',
                        color: '#fff',
                        cursor: 'pointer',
                        '&:hover': { boxShadow: 6 }
                      }}
                      onClick={() => chrome.tabs.create({ url: c.html_url })}
                    >
                      <CardContent>
                        <Typography variant="subtitle1">
                          {c.commit.message.split('\n')[0]}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {new Date(c.commit.author.date).toLocaleString()} by{' '}
                          {c.commit.author.name}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {hasMore && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button
                    variant="outlined"
                    sx={{ color: '#fff', borderColor: '#444' }}
                    onClick={() => setPage(p => p + 1)}
                  >
                    Load More
                  </Button>
                </Box>
              )}
              {!hasMore && commits.length > 0 && (
                <Typography align="center" sx={{ mt: 2, color: '#555' }}>
                  No more commits
                </Typography>
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}
