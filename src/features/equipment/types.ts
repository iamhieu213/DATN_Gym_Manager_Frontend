export type EquipmentStatus = 'OPERATIONAL' | 'UNDER_MAINTENANCE' | 'OUT_OF_SERVICE';

export interface EquipmentItem {
  id: number;
  name: string;
  code: string;
  status: EquipmentStatus;
  location: string;
  lastServiceDate: string;
  note?: string;
}

export interface MaintenanceTask {
  id: number;
  day: string;
  month: string;
  title: string;
  description: string;
  priority: 'CRITICAL' | 'ROUTINE' | 'NORMAL';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  assignedTeam?: string;
  avatars?: string[];
}
