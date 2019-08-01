import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from './states/rootstate';

import { UserModule } from './modules/usermodule';

Vue.use(Vuex);

const store: StoreOptions<RootState> = {

	state: {
		version: '1.0.0'
	},

	mutations: {
	},

	actions: {
	},

	getters: {
		getVersion({ version }): string {
			return version;
		}
	},

	modules: {
		user: UserModule,
	}

};

export default new Vuex.Store<RootState>(store);
