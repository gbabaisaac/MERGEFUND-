import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Avatar,
  CircularProgress,
  Divider,
  TextField,
  Card,
  CardContent,
  CardActions,
  Chip
} from '@mui/material'
import { dummyIssues } from '../../../data/dummyIssues'

export default function Profile({ onBack, onViewClaimed }) {
  const [token, setToken] = useState(localStorage.getItem('github_token'))
  const [patInput, setPatInput] = useState('')
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) return
    setProfile(null)
    setError(null)
    fetch('https://api.github.com/user', {
      headers: { Authorization: `token ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error(`GitHub API ${r.status}`)
        return r.json()
      })
      .then((data) => setProfile(data))
      .catch((err) => setError(err.message))
  }, [token])

  const savePAT = () => {
    localStorage.setItem('github_token', patInput)
    setToken(patInput)
  }

  const logout = () => {
    localStorage.removeItem('github_token')
    setToken(null)
    setProfile(null)
  }

  // for demo, treat all dummyIssues as “claimed”
  const demoClaimed = dummyIssues

  return (
    <Box p={3}>
      <Button onClick={onBack}>← Back</Button>

      {!token && (
        <Box mt={4} textAlign="center">
          <Typography variant="h6">
            Connect your GitHub account
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            Paste a personal access token for testing:
          </Typography>
          <TextField
            value={patInput}
            onChange={(e) => setPatInput(e.target.value)}
            placeholder="ghp_…"
            size="small"
            fullWidth
            sx={{ maxWidth: 350, mx: 'auto', mb: 1 }}
          />
          <Button
            variant="contained"
            onClick={savePAT}
            disabled={!patInput.trim()}
          >
            Save Token
          </Button>
        </Box>
      )}

      {token && !profile && !error && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {profile && (
        <>
          <Box display="flex" alignItems="center" mt={2} mb={2}>
            <Avatar
              src={profile.avatar_url}
              sx={{ width: 64, height: 64 }}
            >
              {profile.login[0]}
            </Avatar>
            <Box ml={2} flexGrow={1}>
              <Typography variant="h5">
                {profile.login}
              </Typography>
              {profile.name && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {profile.name}
                </Typography>
              )}
            </Box>
            <Button variant="outlined" onClick={logout}>
              Logout
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Claimed Issues
          </Typography>

          <Box>
            {demoClaimed.map((issue) => (
              <Card key={issue.id} sx={{ my: 1 }}>
                <CardContent>
                  <Typography variant="subtitle1">
                    #{issue.number} – {issue.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {issue.body}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mt: 2,
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
                          '100%': { transform: 'scale(1)' },
                        },
                        animation: 'pulse 1.5s infinite',
                      }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Claimed on{' '}
                      {new Date(
                        issue.created_at
                      ).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => onViewClaimed(issue)}
                  >
                    View
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
            ))}
          </Box>
        </>
      )}
    </Box>
  )
}
