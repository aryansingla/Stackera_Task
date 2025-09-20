import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addUser as addUserAction } from "../features/addedUsers/addedUsersSlice";
import { v4 as uuidv4 } from "uuid";

type Props = {
  open: boolean;
  onClose: () => void;
};

type FormValues = {
  name: string;
  email: string;
  company: string;
  city?: string;
};

const AddUserDialog: React.FC<Props> = ({ open, onClose }) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: { name: "", email: "", company: "", city: "" },
  });

  const onSubmit = (values: FormValues) => {
    console.log("values", values);
    const newUser = {
      id: `redux-${uuidv4()}`,
      name: values.name,
      email: values.email,
      company: { name: values.company },
      address: { city: values.city ?? "" },
    };

    dispatch(addUserAction(newUser as any));
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        Add New User
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          display="grid"
          gap={2}
        >
          <TextField
            label="Full name"
            {...register("name", { required: "Name is required" })}
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
          />

          <TextField
            label="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
          />

          <TextField
            label="Company"
            {...register("company", { required: "Company is required" })}
            error={!!errors.company}
            helperText={errors.company?.message}
            fullWidth
          />

          <TextField label="City" {...register("city")} fullWidth />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          Add user
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;
