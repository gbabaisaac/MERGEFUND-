// src/components/IssueDetail/IssueDetail.jsx

import React from 'react'
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  IconButton
} from '@mui/material'
import ThumbUpIcon   from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export default function IssueDetail({ issue, onBack }) {
  const {
    number,
    title,
    body,
    created_at,
    user,
    html_url,
    claimers,
    pendingCommits,
    bounty,
    demoClaimers = [],
    demoCommits = []
  } = issue

  return (
    <Box sx={{ p: 3, overflowY: 'auto' }}>
      <Button startIcon={<ArrowBackIcon />} onClick={onBack}>
        Back to Issues
      </Button>

      <Typography variant="h4" sx={{ mt: 2 }}>
        #{number} – {title}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mb: 1 }}
      >
        Bounty: {bounty}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mb: 2 }}
      >
        Opened by {user.login} on{' '}
        {new Date(created_at).toLocaleDateString()}
      </Typography>

      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 3 }}>
        {body}
      </Typography>

      <Typography variant="h6">
        Claimers ({claimers || demoClaimers.length})
      </Typography>
      <List dense>
        {demoClaimers.map(c => (
          <ListItem key={c.login}>
            <ListItemAvatar>
              <Avatar src={c.avatar_url}>{c.login[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={c.login}
              secondary={
                <Button
                  size="small"
                  href={c.profile}
                  target="_blank"
                >
                  View Profile
                </Button>
              }
            />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">
        Pending Commits ({pendingCommits || demoCommits.length})
      </Typography>
      <List>
        {demoCommits.map(c => (
          <ListItem key={c.sha} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar src={c.author.avatar_url}>
                {c.author.login[0]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={c.message}
              secondary={`by ${c.author.login}`}
            />
            <IconButton size="small">
              <ThumbUpIcon fontSize="small" /> {c.voteUp}
            </IconButton>
            <IconButton size="small">
              <ThumbDownIcon fontSize="small" /> {c.voteDown}
            </IconButton>
          </ListItem>
        ))}
      </List>

      <Box mt={3}>
        <Button
          variant="contained"
          href={html_url}
          target="_blank"
          rel="noopener"
        >
          View on GitHub
        </Button>
      </Box>
    </Box>
  )
}
