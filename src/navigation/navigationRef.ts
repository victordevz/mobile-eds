import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigateToTab(tabName: string) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(tabName as never);
  }
}

export function navigateTo(screen: string) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(screen as never);
  }
}
