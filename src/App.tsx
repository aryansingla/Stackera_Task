import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Container, AppBar, Toolbar, Typography } from "@mui/material";
import UsersList from "./pages/UsersList";
import UserDetail from "./pages/UserDetail";

function App() {
  return (
    <>
      <AppBar
        position="static"
        elevation={2}
        sx={{ backgroundColor: "#0e0e23" }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
              fontWeight: 600,
            }}
          >
            User Directory
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<UsersList />} />
          <Route path="/user/:id" element={<UserDetail />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
