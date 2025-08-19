// lib/services/notifications.ts
import * as Notifications from 'expo-notifications';
import { ParkingSession } from '../../app/(tabs)/parking/confirm';

// Configure les notifications
export async function initNotifications() {
  await Notifications.requestPermissionsAsync();
  await Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

// Programme une notification de rappel
export async function scheduleParkingReminder(session: ParkingSession) {
  const now = new Date();
  const endTime = new Date(session.startTime);
  endTime.setHours(endTime.getHours() + (session.duration || 2));
  
  const timeUntilEnd = endTime.getTime() - now.getTime();
  
  // Programme une notification 10 minutes avant la fin
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Fin de stationnement",
      body: `Votre stationnement expire dans 10 minutes`,
      data: { type: 'parking-reminder', sessionId: session.id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: (timeUntilEnd / 1000) - 600, // 10 minutes avant
    },
  });
  
  // Programme une notification à la fin
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Stationnement terminé",
      body: "Votre temps de stationnement est arrivé à échéance",
      data: { type: 'parking-end', sessionId: session.id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: timeUntilEnd / 1000,
    },
  });
}

// Annule toutes les notifications liées à une session
export async function cancelParkingNotifications(sessionId: string) {
  const notifications = await Notifications.getAllScheduledNotificationsAsync();
  const parkingNotifications = notifications.filter(
    n => n.content.data?.sessionId === sessionId
  );
  
  for (const notification of parkingNotifications) {
    await Notifications.cancelScheduledNotificationAsync(notification.identifier);
  }
}