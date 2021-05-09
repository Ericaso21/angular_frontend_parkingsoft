export interface Ticket {
  token: string;
  id_ticket?: number;
  entry_time?: Date;
  departure_time?: Date;
  pk_fk_id_block?: number;
  fk_id_vehicle?: string;
  created_att?: Date;
  updated_att?: Date;
}
