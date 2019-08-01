import { User } from '@/interfaces/user';

export interface UserState {
	loading: boolean;
	currentUser: User | undefined;
}
