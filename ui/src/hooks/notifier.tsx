import CloseIcon from '@mui/icons-material/Close';
import IconButton from "@mui/material/IconButton";
import { useSnackbar } from "notistack";
import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { removeNotificationByKey, selectNotifications } from "../slices/notificationSlice";

let displayed: number[] = [];

export const useNotifier = () => {
  const notifications = useAppSelector(selectNotifications);
  const dispatch = useAppDispatch();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const onCloseNotification = useCallback(
    (key: number) => {
      dispatch(removeNotificationByKey(key));
      displayed = displayed.filter(display => display !== key);
    },
    [dispatch]
  );

  useEffect(() => {
    notifications.forEach(notification => {
      if (displayed.includes(notification.key as number))
        return;
      displayed.push(notification.key as number);
      enqueueSnackbar(notification.message, {
        key: notification.key,
        variant: notification.variant || 'default',
        action: (key: string | number) => (
          <IconButton
            onClick={() => {
              closeSnackbar(key);
              onCloseNotification(key as number);
            }}
          >
            <CloseIcon />
          </IconButton>
        ),
        onExited: (_, key) => {
          onCloseNotification(key as number);
        },
      });
    })
  }, [notifications, enqueueSnackbar, closeSnackbar, onCloseNotification])
};