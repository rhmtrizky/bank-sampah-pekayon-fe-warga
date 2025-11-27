/**
 * Schedule type enumeration
 */
export enum ScheduleType {
  PENGUMPULAN = "PENGUMPULAN",
  PENCAIRAN = "PENCAIRAN",
}

/**
 * Schedule entity
 */
export interface Schedule {
  id: string;
  rw_id: string;
  schedule_type: ScheduleType;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  lokasi: string;
  deskripsi: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Schedule with RW information
 */
export interface ScheduleWithRW extends Schedule {
  rw: {
    id: string;
    nama_rw: string;
    kelurahan_id: string;
  };
}

/**
 * Create schedule payload (admin only)
 */
export interface CreateSchedule {
  rw_id: string;
  schedule_type: ScheduleType;
  tanggal: string;
  jam_mulai: string;
  jam_selesai: string;
  lokasi: string;
  deskripsi?: string;
}
