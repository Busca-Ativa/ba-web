export interface DashboardAdmin {
  events_count: number;
  institutions_count: number;
  month_events_count: number;
  month_gatherings_count: {
    [key: string]: number;
  };
  users_count: number;
  week_gatherings_count: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
  };
}
