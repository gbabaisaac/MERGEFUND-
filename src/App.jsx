// src/App.jsx
import React, { useState, useEffect, useCallback } from "react"
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Chip,
  AppBar,
  Toolbar,
  TextField,
  Grid,
  Card,
  CardContent,
  Button
} from "@mui/material"
import DashboardIcon from "@mui/icons-material/Dashboard"
import FolderOpenIcon from "@mui/icons-material/FolderOpen"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import GitHubIcon from "@mui/icons-material/GitHub"
import HistoryIcon from "@mui/icons-material/History"

const DRAWER_WIDTH = 200

export default function App() {
  // --- state omitted for brevity (same as before) ---
  const [owner, setOwner] = useState(null)
  const [repo, setRepo] = useState(null)
  const [commits, setCommits] = useState([])
  const [filterText, setFilterText] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // detect active GitHub repo…
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      const m = tab?.url?.match(/github\.com\/([^\/]+)\/([^\/#?]+)/)
      if (m) {
        setOwner(m[1])
        setRepo(m[2])
      }
    })
  }, [])

  // fetch commits…
  const fetchCommits = useCallback(async () => {
    if (!owner || !repo || !hasMore) return
    const perPage = 20
    const resp = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=${perPage}&page=${page}`
    )
    if (!resp.ok) return setHasMore(false)
    const data = await resp.json()
    if (data.length < perPage) setHasMore(false)
    setCommits(prev => [...prev, ...data])
  }, [owner, repo, page, hasMore])

  useEffect(() => {
    fetchCommits()
  }, [fetchCommits])

  // filter commits by message
  const filtered = commits.filter(c =>
    c.commit.message.toLowerCase().includes(filterText.toLowerCase())
  )

  return (
    <Box sx={{ display: "flex", width: DRAWER_WIDTH + 600, height: "100vh" }}>
      {/* === NAVBAR === */}
      <Drawer
        variant="permanent"
        PaperProps={{
          sx: {
            width: DRAWER_WIDTH,
            bgcolor: "#161616",
            color: "#fff",
            borderRight: 0,
            p: 2
          }
        }}
      >
        {/* Logo / Title */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <GitHubIcon sx={{ fontSize: 32, color: "#7C4DFF" }} />
          <Typography variant="h6" sx={{ mt: 1 }}>
            MergeFund
          </Typography>
        </Box>

        {/* Navigation Links */}
        <List>
          {[
            { label: "Dashboard", icon: <DashboardIcon /> },
            { label: "Projects", icon: <FolderOpenIcon /> },
            { label: "Profile", icon: <AccountCircleIcon /> }
          ].map(({ label, icon }) => (
            <ListItemButton key={label} sx={{ mb: 1, borderRadius: 1 }}>
              <ListItemIcon sx={{ color: "#aaa" }}>{icon}</ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{ fontSize: 14, color: "#ddd" }}
              />
            </ListItemButton>
          ))}
        </List>

        <Divider sx={{ my: 2, borderColor: "#333" }} />

        {/* FILTERS */}
        <Typography variant="subtitle2" sx={{ mb: 1, color: "#888" }}>
          FILTERS
        </Typography>

        {/* Categories */}
        <Typography variant="caption" sx={{ mb: 1 }}>
          Categories
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {["Web", "Mobile", "AI"].map(cat => (
            <Chip
              key={cat}
              label={cat}
              size="small"
              sx={{
                bgcolor: "#262626",
                color: "#fff",
                "& .MuiChip-label": { px: 1.5 }
              }}
            />
          ))}
        </Box>

        {/* Languages */}
        <Typography variant="caption" sx={{ mb: 1 }}>
          Languages
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          {["JavaScript", "Python"].map(lang => (
            <Chip
              key={lang}
              label={lang}
              size="small"
              sx={{
                bgcolor: "#262626",
                color: "#fff",
                "& .MuiChip-label": { px: 1.5 }
              }}
            />
          ))}
        </Box>

        {/* Donation */}
        <Typography variant="caption" sx={{ mb: 1 }}>
          Donation
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {[" > $1,000", "Any"].map(d => (
            <Chip
              key={d}
              label={d}
              size="small"
              sx={{
                bgcolor: "#262626",
                color: "#fff",
                "& .MuiChip-label": { px: 1.5 }
              }}
            />
          ))}
        </Box>
      </Drawer>

      {/* === MAIN CONTENT PANEL === */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <AppBar
          position="static"
          elevation={0}
          sx={{ bgcolor: "#121212", color: "#fff" }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {owner && repo
                ? `${owner}/${repo}`
                : "Open a GitHub repo in your browser"}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Search / Filter */}
        <Box sx={{ p: 1, bgcolor: "#1E1E1E" }}>
          <TextField
            fullWidth
            size="small"
            variant="filled"
            placeholder="Filter commits…"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            InputProps={{
              sx: {
                bgcolor: "#262626",
                color: "#fff"
              }
            }}
          />
        </Box>

        {/* Commit Cards */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            bgcolor: "#121212"
          }}
        >
          <Grid container spacing={2}>
            {filtered.map(c => (
              <Grid item xs={12} key={c.sha}>
                <Card
                  sx={{
                    bgcolor: "#1E1E1E",
                    color: "#fff",
                    cursor: "pointer",
                    "&:hover": { boxShadow: 6 }
                  }}
                  onClick={() =>
                    chrome.tabs.create({ url: c.html_url })
                  }
                >
                  <CardContent>
                    <Typography variant="subtitle1">
                      {c.commit.message.split("\n")[0]}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(c.commit.author.date).toLocaleString()} by{" "}
                      {c.commit.author.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {filtered.length === 0 && commits.length > 0 && (
              <Typography sx={{ p: 2, color: "#777" }}>
                No commits match “{filterText}”
              </Typography>
            )}
          </Grid>

          {/* Load More */}
          {hasMore && (
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Button
                variant="outlined"
                sx={{ color: "#fff", borderColor: "#444" }}
                onClick={() => setPage(p => p + 1)}
              >
                Load More
              </Button>
            </Box>
          )}
          {!hasMore && commits.length > 0 && (
            <Typography align="center" sx={{ mt: 2, color: "#555" }}>
              No more commits
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  )
}
