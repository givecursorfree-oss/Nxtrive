export const ANNOUNCEMENT_HEIGHT = "3rem";

export function syncAnnouncementHeight(dismissed: boolean): void {
  document.documentElement.style.setProperty(
    "--announcement-height",
    dismissed ? "0px" : ANNOUNCEMENT_HEIGHT,
  );
}
