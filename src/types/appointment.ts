export type Gender = 'Male' | 'Female';

export interface Appointment {
  id: number;
  name: string;
  gender: Gender;
  age: number;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Declined';
  avatar: string;
}
