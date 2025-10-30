export interface NavigationProvider {
  goTo(route: string): void
  goBack(): void
  refresh(): void
  currentRoute: string
}
