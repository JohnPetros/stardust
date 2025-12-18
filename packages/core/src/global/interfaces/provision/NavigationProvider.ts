export interface NavigationProvider {
  goTo(route: string): void
  goBack(): void
  refresh(): void
  openExternal(url: string): void
  currentRoute: string
}
