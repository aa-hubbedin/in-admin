import Vue from "vue";
import createAuth0Client from "@auth0/auth0-spa-js";

/** Define a default action to perform after authentication */
const DEFAULT_REDIRECT_CALLBACK = () =>
    window.history.replaceState({}, document.title, window.location.pathname);

let instance;

/** Returns the current instance of the SDK */
export const getInstance = () => instance;

/** Creates an instance of the Auth0 SDK. If one has already been created, it returns that instance */
export const useAuth0 = ({
    onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
    redirectUri = window.location.origin,
    ...options
}) => {
    if (instance) return instance;

    // The 'instance' is simply a Vue object
    instance = new Vue({
        data() {
            return {
                loading: true,
                isAuthenticated: false,
                user: {},
                userId: null,
                token: null,
                auth0Client: null,
                popupOpen: false,
                error: null,
                
                idKey: "https://hubbedin/id",
                roleKey: "https://hubbedin/roles",
                audience: "https://api.hubbedin.com"
            };
        },
        methods: {
            /** Authenticates the user using a popup window */
            async loginWithPopup(options, config) {
                this.popupOpen = true;

                try {
                    await this.auth0Client.loginWithPopup(options, config);
                } catch (e) {
                    // eslint-disable-next-line
                    console.error(e);
                } finally {
                    this.popupOpen = false;
                }

                this.user = await this.auth0Client.getUser();
                this.isAuthenticated = true;
            },
            /** Handles the callback when logging in using a redirect */
            async handleRedirectCallback() {
                this.loading = true;
                try {
                    await this.auth0Client.handleRedirectCallback();
                    this.user = await this.auth0Client.getUser();
                    this.isAuthenticated = true;
                } catch (e) {
                    this.error = e;
                } finally {
                    this.loading = false;
                }
            },
            /** Authenticates the user using the redirect method */
            loginWithRedirect(o) {
                return this.auth0Client.loginWithRedirect(o);
            },
            /** Returns all the claims present in the ID token */
            getIdTokenClaims(o) {
                return this.auth0Client.getIdTokenClaims(o);
            },
            /** Returns the access token. If the token is invalid or missing, a new one is retrieved */
            getTokenSilently(o) {
                return this.auth0Client.getTokenSilently(o);
            },
            /** Gets the access token using a popup window */
            getTokenWithPopup(o) {
                return this.auth0Client.getTokenWithPopup(o);
            },
            /** Logs the user out and removes their session on the authorization server */
            logout(o) {
                return this.auth0Client.logout(o);
            },

            async createAdmin(user) {
                try {
                    var response = await this.$axios.post(this.$apiBase + '/v1/admins', {
                        auth_id: user.sub,
                        first_name: user.given_name || user.name,
                        last_name: user.family_name || user.name,
                        email: user.email,
                        contact_number: user.phone_number,
                        picture: user.picture
                    });
                    this.user[this.idKey] = await response.id;
                } catch (e) {
                    this.error = e;
                }
            }
        },
        /** Use this lifecycle method to instantiate the SDK client */
        async created() {
            // Create a new instance of the SDK client using members of the given options object
            this.auth0Client = await createAuth0Client({
                ...options,
                client_id: options.clientId,
                redirect_uri: redirectUri,
                useRefreshTokens: true
            });

            try {
                // If the user is returning to the app after authentication..
                if (
                    window.location.search.includes("code=") &&
                    window.location.search.includes("state=")
                ) {
                    // handle the redirect and retrieve tokens
                    const { appState } = await this.auth0Client.handleRedirectCallback();

                    // Notify subscribers that the redirect callback has happened, passing the appState
                    // (useful for retrieving any pre-authentication state)
                    onRedirectCallback(appState);
                }
            } catch (e) {
                this.error = e;
            } finally {
                // Initialize our internal authentication state
                this.isAuthenticated = await this.auth0Client.isAuthenticated();
                this.user = await this.auth0Client.getUser();
                if (this.user && !this.user[this.idKey]) {
                    await this.createAdmin(this.user);
                }

                if (this.user) {
                    if (location.pathname != '/unauthorized' && !this.user[this.roleKey].includes('Admin')) {
                        location.href = '/unauthorized';
                    }

                    this.userId = this.user[this.idKey];
                    // get access token
                    this.token = await this.auth0Client.getTokenSilently({audience: this.audience});
                }

                this.loading = false;
            }
        }
    });

    return instance;
};

// Create a simple Vue plugin to expose the wrapper object throughout the application
export const Auth0Plugin = {
    install(Vue, options) {
        Vue.prototype.$auth = useAuth0(options);
    }
};