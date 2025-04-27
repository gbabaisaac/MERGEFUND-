// src/components/NavBar/Dashboard/Dashboard.jsx

import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  CircularProgress,
  Chip
} from '@mui/material'

export default function Dashboard({ owner, repo, onView, onClaim }) {
  const [issues, setIssues]   = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  // Helper to generate a random integer between min and max (inclusive)
  const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min

  useEffect(() => {
    if (!owner || !repo) {
      setIssues([])
      return
    }

    setLoading(true)
    setError(null)

    fetch(`https://api.github.com/repos/${owner}/${repo}/issues`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text()
          throw new Error(`GitHub API ${res.status}: ${text}`)
        }
        return res.json()
      })
      .then((data) => {
        // Filter out PRs and then decorate each issue with dummy demo fields
        const onlyIssues = data
          .filter((i) => !i.pull_request)
          .map((issue) => ({
            ...issue,
            bounty: `${randomInt(50, 500)} DEV`,
            claimers: randomInt(0, 10),
            pendingCommits: randomInt(0, 5)
          }))

        setIssues(onlyIssues)
      })
      .catch((err) => {
        console.error(err)
        setError(err.message)
        setIssues([]) // or leave empty
      })
      .finally(() => setLoading(false))
  }, [owner, repo])

  if (!owner || !repo) {
    return (
      <Box p={3}>
        <Typography color="text.secondary">
          No repository selected.
        </Typography>
      </Box>
    )
  }

  if (loading) {
    return (
      <Box
        p={3}
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">
          Error loading issues: {error}
        </Typography>
      </Box>
    )
  }

  return (
    <Box p={3} sx={{ overflowY: 'auto', flex: 1 }}>
      <Grid container spacing={2}>
        {issues.map((issue) => (
          <Grid item xs={12} sm={6} md={4} key={issue.id}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  #{issue.number} – {issue.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {issue.body || '— no description provided —'}
                </Typography>

                {/* DevCoin bounty badge */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mt: 2
                  }}
                >
                  <Chip
                    label={issue.bounty}
                    color="secondary"
                    size="small"
                    sx={{
                      fontWeight: 'bold',
                      '@keyframes pulse': {
                        '0%': { transform: 'scale(1)' },
                        '50%': { transform: 'scale(1.1)' },
                        '100%': { transform: 'scale(1)' }
                      },
                      animation: 'pulse 1.5s infinite'
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Claimers: {issue.claimers} | Pending: {issue.pendingCommits}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions>
                <Button size="small" onClick={() => onView(issue)}>
                  View
                </Button>
                <Button size="small" onClick={() => onClaim(issue)}>
                  Claim
                </Button>
                <Button
                  size="small"
                  href={issue.html_url}
                  target="_blank"
                  rel="noopener"
                >
                  GitHub
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
