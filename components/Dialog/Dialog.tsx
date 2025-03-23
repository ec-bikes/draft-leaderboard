import {
  DialogContent,
  DialogTitle,
  IconButton,
  Dialog as MuiDialog,
  type DialogProps as MuiDialogProps,
} from '@mui/material';
import { CloseIcon } from '../icons/Close.js';

function CloseButton(props: Pick<DialogProps, 'onClose'>) {
  return (
    <IconButton
      aria-label="close"
      onClick={props.onClose}
      sx={{
        position: 'absolute',
        right: 8,
        top: 8,
        color: (theme) => theme.vars.palette.grey[500],
      }}
    >
      <CloseIcon />
    </IconButton>
  );
}

export interface DialogProps extends Omit<MuiDialogProps, 'onClose' | 'open' | 'children'> {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export function Dialog(props: DialogProps) {
  const { onClose, title, children, ...otherProps } = props;
  return (
    <MuiDialog open onClose={onClose} {...otherProps}>
      <DialogTitle>
        <strong>{title}</strong>
      </DialogTitle>
      <CloseButton onClose={onClose} />
      <DialogContent>{children}</DialogContent>
    </MuiDialog>
  );
}
