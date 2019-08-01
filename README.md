# Vuex with TypeScript

For one of my projects I'm working on, I decided to enhance it by using Vuex. The project is entirely written in TypeScript, scaffolded with Vue CLI 3 and in this short tutorial I want to show you my style of using Vuex modules in my application(s). I want to show how to put together a Vuex module and how to use it. So I'm not explaining how Vuex works and expect that you already know about the basics. If you don't or want to dig a little deeper, I absolutely recommend looking at the brilliant official Vuex guide: https://vuex.vuejs.org/guide. 

> 

## Prerequisites

The prerequisites for this small tutorial are simple: Just create a Vue.js project from scratch by using Vue CLI V3:

```cmd
vuex create vuexts
```

Select

```cmd
> Manually select features
```

Choose

```cmd
(*) Babel
(*) TypeScript
(*) Vuex
(*) Linter / Formatter
```

Accept all the following defaults by hitting `RETURN` and your project is going to be built. When finished, head to your project's directory and start it.

```cmd
cd vuexts
npm run serve
```

By hitting http://localhost:8080 you'll reach the scaffolded app.



## Btw: My Editor Of Choice

Since the very beginning of the project, quite a couple of years ago, I trust in VSCode when I'm doing client side stuff for the web (and also PHP development). For my dotNet stuff I still use Visual Studio. But back to VSCode. The only Extension I use for Vue.js development with VSCode is Vetur and I highly recommend this brilliant thingy.



## Extended Folder Structure

The first thing to do is to set up a folder for the Vuex Store's main file, the modules and the needed states/interfaces. So we move the `store.ts` file into a new folder called `store`, create two sub folders called `modules` and `states` and align the import in `main.ts`. The latter is done by VSCode, automatically when you move the file to the new `store` directory.

```
+ src
  + interfaces
  + store
    + modules
    + states
```



## The Root State

The Vue CLI already generated a store component. This will be our so-called root store which also contains a `state` object which represents the root state. The root state provides root properties for the application and may/should also have actions, getters and mutations itself. In this pretty basic implementation it only has one property: `version`, and nothing. So let's change the `store.ts` and make it our root store, containing the app's root state.

First of all we have to define the `RootState` Interface itself:

```typescript
// src/store/states/rootstate.ts

export interface RootState {
	version: string;
}
```

It's saved as `rootstate.ts` in the previously created folder `states` all the state typedefs are saved. Now we can use it for the `state` property of our root store that is of type `StoreOptions<S>`.

``` typescript
// src/store/store.ts

import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from './states/rootstate';

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
    },
	modules: {
	},

};

export default new Vuex.Store<RootState>(store);
```

The generic Interface `StoreOptions<S>` defines all the necessary parts of a Vuex Store and nails it the the type of the `state` object to a type, given in `S`:

```typescript
export interface StoreOptions<S> {
	state?: S | (() => S);
	getters?: GetterTree<S, S>;
	actions?: ActionTree<S, S>;
	mutations?: MutationTree<S>;
	modules?: ModuleTree<S>;
	plugins?: Plugin<S>[];
	strict?: boolean;
}
```

Now the ground is prepared and we can start to build our first (and for this tutorial only) Vuex Module.



## Modules

Vuex gives us the possibility to encapsulate functionality for certain data into modules and so lets us kind of follow the separation of concerns pattern. Following this pattern will make it possible to reuse some modules in other applications. One of those modules could be one that handles the data of the current (logged-in) user of the application. And this is what we're going to build, in a basic manner, and only to show how a Vuex Module is set up, namespaced and accessed by the various components.



## Creating The User Module Base

A Vuex Module is nothing but a different kind of a Vuex Store, having the ability to be put into a root store (which we already created). 

The Vuex Modules are placed the `modules` sub folder of our application. So we now create a file named `usermodule.ts` that is structured as follows:

```typescript
// src/store/modules/usermodule.ts

import { Module } from 'vuex';

export const UserModule: Module<ModuleState, RootState> = {
	namespaced: true,

	state: {
	},

	mutations: {
	},

	actions: {
	},

	getters: {
	}

};
```



All Vuex Modules adhere to the structure of a generic Interface:  `Module<S, R>`

```typescript
export interface Module<S, R> {
  namespaced?: boolean;
  state?: S | (() => S);
  getters?: GetterTree<S, R>;
  actions?: ActionTree<S, R>;
  mutations?: MutationTree<S>;
  modules?: ModuleTree<R>;
}
```



### Namespacing

It is recommended that all modules are namespaced in order to prevent function name collisions between modules that are brought together in the root store. Thus the property `namespaced` in a module should always be set to `true`.



## State Properties

Now that we've scaffolded the User Module, there's one basic part missing: The state properties that keep the user data. We will also use interfaces to represent the data structure as we die with the root state and put then into separate folders.

```typescript
// src/store/states/userstate.ts

import { IUser } from '@/interfaces/User';

export interface UserState {
	loading: boolean;
	currentUser: User | undefined;
}
```



Since we already have defined an interface for a User we'll use this structure to hold the user data in the property `currentuser`. The `User`-Interface is defined as follows and placed inside the `interfaces` directory. The `loading` property represents the `loading` state (when loading it'll be set to `true`).

 ```typescript
// src/interfaces/user.ts

export interface User {
	Username: string;
	Firstname?: string;
	Middlename?: string;
	Lastname?: string;
	Groups: string[];
}
 ```



Now we can fill out the still erroneous User Module:

```typescript
// src/store/modules/usermodule.ts

import { Module } from 'vuex';

import { User } from '@/interfeces/user';
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
    },

	actions: {
	},

	getters: {
	}

};
```



## Seeding Functionality: Mutations, Actions and Getters

 For now, the User Module has no functionality at all. So we will fill the placeholders as follows:

```typescript
// src/store/modules/usermodule.ts
export const UserModule: Module<UserState, RootState> = {

    // ...
    
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

```



I decided to keep the original naming style for mutations and keep them uppercased with underscores as word separator.

The only action defined in the module is an example that gets a (logged-in) dummy user`s data as a Promise with a delay of two seconds, in order to simulate data loading.

And that's all for the User Module. Next step is to include it into the Root Store.



## Adding Module To The Root Store

Adding the User Module to the Root Store is as simple as it sounds:

- import the `UserModule`
- add the `UserModule` to the `modules` property

```typescript
// src/store/store.ts

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
		user: UserModule
	},

};

export default new Vuex.Store<RootState>(store);
```

The important thing to mention here is that the name of the property that keeps then `UserModule` object is the name of the namespace that addresses the Module. In this case it's `user`.



## Usage Of The Vuex Module

We use the existing code and extend the `HelloWorld` component by some getters and actions from the Vuex Store. To achieve this, we pull in the needed getters (`getFullName` and `getLoading` as `computed` properties using the `mapGetters` function, that was previously imported from the Vuex library. Additionally we also have to pull in the `loadCurrentUserData` action from the User Module, using the `mapActions` function and make it available as a method. It's then used by the `loadUser` function that initially loads the user data.

```typescript
// src/components/HelloWorld.vue

import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

export default Vue.extend({
	props: {
		msg: {
			type: String
		}
	},

	mounted() {
		this.loadUser();
	},

	computed: {
        // from UserModule
		...mapGetters('user', ['getFullName', 'getLoading']),
        // from RootStore
		...mapGetters(['getVersion'])
	},

	methods: {
		loadUser() {
			this.loadCurrentUserData().then(() => {
                // direct access to a vuex module property is still possible:
				console.log(`${this.$store.state.user.currentUser.Username}` + 
					'was loaded.');
			});
		},
		...mapActions('user', ['loadCurrentUserData']),  
    }
})
```

Finally we delete all the HTML in the template section of the `HelloWorld` component and add some functionality, calling some getters.


```html
<!-- src/components/HelloWorld.vue -->

<template>
	<div class="hello">
		<h1>{{ msg }}</h1>
		<h2 v-if="getLoading">Loading user ...</h2>
		<h2 v-else>Welcome {{getFullName}}</h2>
		<h3>Root Version: {{getVersion}}</h3>
    </div>
</template>
```

And we finally made it. When running the app, the user data is loaded and while loading, the "Loading user..." message is shown and finally the loaded user's full name. Instantly show is the "Root Version" that's delivered by the `getVersion` getter from the Root Store.



## Conclusion
A Vuex Store is nothing but a more or less giant, centralized ViewModel (often referred to as "single source of truth") with built-in functionality and Vuex Modules are meant to separate the concerns of a Store and make them reusable. At the end there's nothing really magical about it :wink: ... even when using Vuex with TypeScript.

