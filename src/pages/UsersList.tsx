import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TablePagination,
  CircularProgress,
  IconButton,
  Button,
  Tooltip,
  Skeleton,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useApiUsers } from "../hooks/useUsers";
import { Link as RouterLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import { User } from "../types";
import AddUserDialog from "../components/AddUserDialog";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

const UsersList: React.FC = () => {
  const { data: apiUsers, isLoading, isError, error } = useApiUsers();
  const reduxUsers = useSelector((s: RootState) => s.addedUsers.users);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openAddDialog, setOpenAddDialog] = useState(false);

  // Merge API + Redux users
  const mergedUsers = useMemo<User[]>(() => {
    const mappedRedux = reduxUsers.map((ru) => ({
      id: ru.id,
      name: ru.name,
      email: ru.email,
      company: ru.company ? { name: ru.company.name } : { name: "—" },
      address: ru.address ? { city: ru.address.city } : { city: "" },
    })) as User[];

    const apiNormalized = (apiUsers || []).map((u) => ({ ...u }));
    const seen = new Set<string | number>();
    const result: User[] = [];

    for (const u of mappedRedux) {
      const key = `${u.id}-${u.email}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push(u);
      }
    }
    for (const u of apiNormalized) {
      const key = `${u.id}-${u.email}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push(u);
      }
    }
    return result;
  }, [apiUsers, reduxUsers]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return mergedUsers;
    return mergedUsers.filter((u) =>
      `${u.name ?? ""} ${u.email ?? ""}`.toLowerCase().includes(q)
    );
  }, [mergedUsers, search]);

  const paginated = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  if (isLoading) {
    return (
      <Box>
        {Array.from(new Array(5)).map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            width="100%"
            height={52}
            sx={{ mb: 1, borderRadius: 1 }}
          />
        ))}
      </Box>
    );
  }

  if (isError) {
    return (
      <Box>
        <Typography color="error">
          Error loading users: {error?.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Box>
          <Typography variant="h6">Users</Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Button
            variant="contained"
            size="small"
            onClick={() => setOpenAddDialog(true)}
            sx={{ ml: 1 }}
          >
            Add User
          </Button>
        </Box>
      </Box>

      <Box mb={1}>
        <TextField
          label="Search by name or email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          fullWidth
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
            },
          }}
        />
      </Box>

      <Box mb={1}>
        <TableContainer
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1.5,
            overflow: "auto",
            maxHeight: "55vh",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "background.paper" }}>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>City</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginated.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u?.company?.name}</TableCell>
                  <TableCell>{u.address?.city ?? "—"}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="View details" arrow placement="left">
                      <IconButton
                        component={RouterLink}
                        to={`/user/${u.id}`}
                        size="small"
                        aria-label="view details"
                      >
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}

              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="text.secondary">
                      No users found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box
        mt={2}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1.5,
          p: 0,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        />
      </Box>

      <AddUserDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
      />
    </Box>
  );
};

export default UsersList;
