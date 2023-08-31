import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { Notification } from "../interfaces/notification.interface";

export interface NotificationState {
  notifications: Notification[];
};

const initialState: NotificationState = {
  notifications: [],
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    pushNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push({
        key: new Date().getTime(),
        variant: action.payload.variant,
        message: action.payload.message,
      });
    },
    removeNotificationByKey: (state, action: PayloadAction<number>) => {
      state.notifications = state.notifications.filter(notification => notification.key !== action.payload);
    },
  },
});

export const selectNotifications = (state: RootState) => state.notification.notifications;

export const {
  pushNotification,
  removeNotificationByKey,
} = notificationSlice.actions;

export default notificationSlice.reducer;