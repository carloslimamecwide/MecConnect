export interface ModeCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  route: AppRoute;
  features: string[];
  bgColor: string;
  borderColor: string;
  iconBgColor: string;
  iconBorderColor: string;
  iconColor: string;
  topGlowColor: string;
  bottomGlowColor: string;
}
export type AppRoute = "/(app)/(communication)/dashboard" | "/(app)/(management)/users";
