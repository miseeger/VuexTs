import { Module } from 'vuex';

import { User } from '@/interfaces/user';
import { UserState } from '@/store/states/userstate';
import { RootState } from '@/store/states/rootstate';

export const UserModule: Module<UserState, RootState> = {
	namespaced: true,

	state: {
		loading: false,
		currentUser: {
			Username: '',
			Groups: []
		}
	},

	mutations: {
		USER_DATA_LOADED(state, payload: User) {
			state.loading = false;
			state.currentUser = payload;
		},

		USER_DATA_LOADING(state) {
			state.loading = true;
		}
	},

	actions: {
		loadCurrentUserData({ commit }) {
			return new Promise((resolve, reject) => {
				const userData: User = {
					Username: 'doejohn',
					Lastname: 'Doe',
					Middlename: 'J.',
					Firstname: 'John',
					Groups: []
				};

				commit('USER_DATA_LOADING');
				setTimeout(() => {
					commit('USER_DATA_LOADED', userData);
					resolve();
				}, 2000);
			});
		}
	},

	getters: {
		getUserName({ currentUser }): string {
			return (currentUser && currentUser.Username) || '';
		},

		getFullName({ currentUser }): string {
			const firstName = (currentUser && currentUser.Firstname) || '';
			const middleName = ` ${(currentUser && currentUser.Middlename)}` || '';
			const lastName = ` ${(currentUser && currentUser.Lastname)}` || '';
			return `${firstName}${middleName}${lastName}`;
		},

		getLoading({ loading }): boolean {
			return loading;
		}
	}

};
