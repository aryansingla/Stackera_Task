// src/pages/UserDetail.tsx
import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import LanguageIcon from "@mui/icons-material/Language";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useApiUsers } from "../hooks/useUsers";

const UserDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: apiUsers } = useApiUsers();
  const reduxUsers = useSelector((s: RootState) => s.addedUsers.users);

  // Merge redux + api (redux first)
  const allUsers = useMemo(() => {
    return [
      ...reduxUsers.map((u) => ({
        ...u,
        company: u.company ?? { name: "—" },
        address: u.address ?? { city: "—" },
      })),
      ...(apiUsers || []),
    ];
  }, [reduxUsers, apiUsers]);

  const user = allUsers.find((u) => String(u.id) === String(id));

  if (!user) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" color="text.secondary">
          User not found
        </Typography>
      </Paper>
    );
  }

  return (
    <Card
      sx={{
        p: { xs: 2, sm: 3 },
        maxWidth: 760,
        mx: "auto",
        borderRadius: 3,
        boxShadow: 4,
      }}
    >
      <CardContent>
        {/* Header: back button + avatar + name */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={1}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title="Back to users" arrow placement="left">
              <IconButton
                size="small"
                onClick={() => navigate("/")}
                aria-label="back"
                sx={{ mr: 0.5 }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>

            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 56,
                height: 56,
                fontSize: 22,
                mr: 1,
              }}
            >
              {user.name?.[0] ?? "U"}
            </Avatar>

            <Box>
              <Typography variant="h5" fontWeight={700}>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email ?? "—"}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <List disablePadding>
          <ListItem sx={{ py: 1.25 }}>
            <BusinessIcon color="action" sx={{ mr: 1 }} />
            <ListItemText
              primary={<Typography fontWeight={600}>Company</Typography>}
              secondary={user.company?.name ?? "—"}
            />
          </ListItem>

          <Divider component="li" />

          <ListItem sx={{ py: 1.25 }}>
            <LocationOnIcon color="action" sx={{ mr: 1 }} />
            <ListItemText
              primary={<Typography fontWeight={600}>City</Typography>}
              secondary={user.address?.city ?? "—"}
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default UserDetail;
