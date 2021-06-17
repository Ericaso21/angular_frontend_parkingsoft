export interface Rates {
  token?: string;
  id_rate?: number;
  fk_id_vehicle_type?: number;
  minute_rate?: string;
  hourly_rate?: string;
  day_rate?: string;
  rate_status?: number;
  created_att?: Date;
  updated_att?: Date;
}
