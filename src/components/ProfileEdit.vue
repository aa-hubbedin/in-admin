<template>
    <v-card>
        <v-card-title>
            Profile
        </v-card-title>

        <v-card-text
            max-height="600"
        >
            <div class="d-flex flex-no-wrap align-content-space-around pa-4">
                <div class="d-flex flex-column align-center" style="width: 230px;">
                    <v-avatar size="125">
                        <v-img :src="edit.picture" alt="Profile Picture" />
                    </v-avatar>
                    <v-file-input
                        class="mt-4"
                        :rules="avatarRules"
                        accept="image/png, image/jpeg, image/bmp"
                        prepend-icon="mdi-camera"
                        label="Profile Picture"
                        hide-details="auto"
                        outlined
                        dense
                    ></v-file-input>
                </div>

                <div
                    v-if="$vuetify.breakpoint.mdAndUp" 
                    class="grow mx-4"
                >
                    <div class="d-flex">
                        <v-text-field
                            v-model="edit.firstName"
                            label="First Name"
                            outlined
                            dense
                            hide-details="auto"
                            @blur="$v.edit.firstName.$touch()"
                            :error-messages="validationErrors($v.edit.firstName, 'First Name')"
                        ></v-text-field>
                        <v-text-field
                            v-model="edit.lastName"
                            class="ml-2"
                            label="Last Name"
                            outlined
                            dense
                            hide-details="auto"
                            @blur="$v.edit.lastName.$touch()"
                            :error-messages="validationErrors($v.edit.lastName, 'Last Name')"
                        ></v-text-field>
                    </div>
                        
                    <div>
                        <v-text-field
                            v-model="edit.email"
                            class="mt-3"
                            label="Email"
                            outlined
                            dense
                            hide-details="auto"
                            @blur="$v.edit.email.$touch()"
                            :error-messages="validationErrors($v.edit.email, 'Email')"
                        ></v-text-field>
                        <v-text-field
                            v-model="edit.contactNumber"
                            class="mt-3"
                            label="Contact Number"
                            outlined
                            dense
                            hide-details="auto"
                            @blur="$v.edit.contactNumber.$touch()"
                            :error-messages="validationErrors($v.edit.contactNumber, 'Contact Number')"
                        ></v-text-field>
                        <v-text-field
                            v-model="edit.candidate.residenceCity"
                            class="mt-3"
                            label="City of Residence"
                            outlined
                            dense
                            hide-details="auto"
                            @blur="$v.edit.candidate.residenceCity.$touch()"
                            :error-messages="validationErrors($v.edit.candidate.residenceCity, 'City')"
                        ></v-text-field>
                    </div>
                </div>

                <div
                    v-if="$vuetify.breakpoint.mdAndUp" 
                    class="d-flex flex-column justify-space-around mr-4"
                >
                    <div
                        class="d-flex align-content-center"
                    >
                        <v-icon class="mr-2">mdi-github</v-icon>
                        <v-text-field
                            v-model="edit.candidate.scmUrl"
                            label="Github URL"
                            outlined
                            dense
                            hide-details="auto"
                            @blur="$v.edit.candidate.scmUrl.$touch()"
                            :error-messages="validationErrors($v.edit.candidate.scmUrl, 'Github URL')"
                        ></v-text-field>
                    </div>
                    <div 
                        class="d-flex align-content-center"
                    >
                        <v-icon class="mr-2">mdi-linkedin</v-icon>
                        <v-text-field
                            v-model="edit.candidate.linkedInUrl"
                            label="LinkedIn URL"
                            outlined
                            dense
                            hide-details="auto"
                            @blur="$v.edit.candidate.linkedInUrl.$touch()"
                            :error-messages="validationErrors($v.edit.candidate.linkedInUrl, 'LinkedIn URL')"
                        ></v-text-field>
                    </div>
                    <div 
                        class="d-flex align-content-center"
                    >
                        <v-icon class="mr-2">mdi-web</v-icon>
                        <v-text-field
                            v-model="edit.candidate.websiteUrl"
                            label="Personal Website"
                            outlined
                            dense
                            hide-details="auto"
                            @blur="$v.edit.candidate.websiteUrl.$touch()"
                            :error-messages="validationErrors($v.edit.candidate.websiteUrl, 'Website URL')"
                        ></v-text-field>
                    </div>
                </div>
            </div>

            <div
                v-if="$vuetify.breakpoint.smAndDown"
            >
                <v-text-field
                    v-model="edit.firstName"
                    label="First Name"
                    outlined
                    dense
                    hide-details="auto"
                    @blur="$v.edit.firstName.$touch()"
                    :error-messages="validationErrors($v.edit.firstName, 'First Name')"
                ></v-text-field>
                <v-text-field
                    v-model="edit.lastName"
                    class="mt-3"
                    label="Last Name"
                    outlined
                    dense
                    hide-details="auto"
                    @blur="$v.edit.lastName.$touch()"
                    :error-messages="validationErrors($v.edit.lastName, 'Last Name')"
                ></v-text-field>
                    
                <v-text-field
                    v-model="edit.email"
                    class="mt-3"
                    label="Email"
                    outlined
                    dense
                    hide-details="auto"
                    @blur="$v.edit.email.$touch()"
                    :error-messages="validationErrors($v.edit.email, 'Email')"
                ></v-text-field>
                <v-text-field
                    v-model="edit.contactNumber"
                    class="mt-3"
                    label="Contact Number"
                    outlined
                    dense
                    hide-details="auto"
                    @blur="$v.edit.contactNumber.$touch()"
                    :error-messages="validationErrors($v.edit.contactNumber, 'Contact Number')"
                ></v-text-field>
                <v-text-field
                    v-model="edit.candidate.residenceCity"
                    class="mt-3"
                    label="City of Residence"
                    outlined
                    dense
                    hide-details="auto"
                    @blur="$v.edit.candidate.residenceCity.$touch()"
                    :error-messages="validationErrors($v.edit.candidate.residenceCity, 'City')"
                ></v-text-field>
            </div>

            <div
                v-if="$vuetify.breakpoint.smAndDown" 
                class="mt-4"
            >
                <div
                    class="d-flex align-content-center"
                >
                    <v-icon class="mr-2">mdi-github</v-icon>
                    <v-text-field
                        v-model="edit.candidate.scmUrl"
                        label="Github URL"
                        outlined
                        dense
                        hide-details="auto"
                        @blur="$v.edit.candidate.scmUrl.$touch()"
                        :error-messages="validationErrors($v.edit.candidate.scmUrl, 'Github URL')"
                    ></v-text-field>
                </div>
                <div 
                    class="d-flex align-content-center mt-3"
                >
                    <v-icon class="mr-2">mdi-linkedin</v-icon>
                    <v-text-field
                        v-model="edit.candidate.linkedInUrl"
                        label="LinkedIn URL"
                        outlined
                        dense
                        hide-details="auto"
                        @blur="$v.edit.candidate.linkedInUrl.$touch()"
                        :error-messages="validationErrors($v.edit.candidate.linkedInUrl, 'LinkedIn URL')"
                    ></v-text-field>
                </div>
                <div 
                    class="d-flex align-content-center mt-3"
                >
                    <v-icon class="mr-2">mdi-web</v-icon>
                    <v-text-field
                        v-model="edit.candidate.websiteUrl"
                        label="Personal Website"
                        outlined
                        dense
                        hide-details="auto"
                        @blur="$v.edit.candidate.websiteUrl.$touch()"
                        :error-messages="validationErrors($v.edit.candidate.websiteUrl, 'Website URL')"
                    ></v-text-field>
                </div>
            </div>
        
            <v-row class="align-center">
                <v-col cols="12">
                    <div>Professional Summary</div>
                    <v-textarea
                        v-model="edit.candidate.summary"
                        class="mt-1"
                        outlined
                        hide-details="auto"
                    ></v-textarea>
                </v-col>

                <v-col cols="6" md="2">
                    <div>Education Level</div>
                </v-col>
                <v-col cols="6" md="4">
                    <v-select
                        v-model="edit.candidate.educationLevel"
                        :items="levels"
                        outlined
                        dense
                        hide-details="auto"
                    ></v-select>
                </v-col>

                <v-col cols="12" md="2" :class="{ 'pb-0': $vuetify.breakpoint.smAndDown }">
                    <div>Expected Salary</div>
                </v-col>
                <v-col cols="6" md="2">
                    <v-text-field
                        v-model="edit.candidate.expectedSalaryCurrency"
                        label="Currency"
                        outlined
                        dense
                        hide-details="auto"
                    ></v-text-field>
                </v-col>
                <v-col cols="6" md="2">
                    <v-text-field
                        v-model="edit.candidate.expectedSalary"
                        label="Amount"
                        outlined
                        dense
                        hide-details="auto"
                    ></v-text-field>
                </v-col>

                <v-col cols="6" md="2">
                    <div>Gender</div>
                </v-col>
                <v-col cols="6" md="4">
                    <v-text-field
                        v-model="edit.gender"
                        outlined
                        dense
                        hide-details="auto"
                    ></v-text-field>
                </v-col>

                <v-col cols="6" md="2">
                    <div>Nationality</div>
                </v-col>
                <v-col cols="6" md="4">
                    <v-text-field
                        v-model="edit.candidate.nationality"
                        outlined
                        dense
                        hide-details="auto"
                    ></v-text-field>
                </v-col>

                <v-col cols="6" md="2">
                    <div>Birthday</div>
                </v-col>
                <v-col cols="6" md="4">
                    <v-menu
                        v-model="birthdayMenu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="birthday"
                                prepend-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                                outlined
                                dense
                                hide-details="auto"
                                clearable
                            ></v-text-field>
                        </template>
                        <v-date-picker
                            ref="picker"
                            v-model="birthday"
                            @input="birthdayMenu = false"
                            :max="new Date().toISOString().substr(0, 10)"
                        ></v-date-picker>
                    </v-menu>
                </v-col>

                <v-col cols="6" md="2">
                    <div>Notice Period (months)</div>
                </v-col>
                <v-col cols="6" md="4">
                    <v-text-field
                        v-model="edit.candidate.noticePeriod"
                        outlined
                        dense
                        hide-details="auto"
                    ></v-text-field>
                </v-col>
            </v-row>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="error"
                @click="$emit('close')"
            >Cancel</v-btn>
            <v-btn
                color="teal"
                dark
                @click="save"
            >Save</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, helpers } from 'vuelidate/lib/validators'
const urlValidator = helpers.regex('url', /^https{0,1}:\/\/.*/i);

export default {
    name: 'ProfileEdit',
    mixins: [validationMixin],
    props: {
        candidate: {
            required: true,
            type: Object
        }
    },
    data() {
        return {
            loading: false,
            error: null,
            edit: {},

            levels: ['Undergraduate', 'Master\'s', 'Doctorate', 'Diploma', 'Others'],

            avatarRules: [
                value => !value || value.size < 1000000 || 'Avatar size should be less than 1 MB!',
            ],

            birthday: null,
            birthdayMenu: false,

            axiosConfig: {
                headers: {
                    Authorization: 'Bearer ' + this.$auth.token
                }
            }
        }
    },
    methods: {
        async updateCandidate() {
            this.loading = true;
            try {
                await this.$axios.put(this.$apiBase + '/v1/users/' + this.edit.id, this.edit, this.axiosConfig);
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
            }
        },
        async save() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                return;
            }
            
            try {
                await this.updateCandidate();
            } catch (e) {
                this.error = e;
            } finally {
                this.$emit('close');
            }
        },
        validationErrors(test, name) {
            const errors = [];
            if (!test.$dirty) return errors;
            test.required === false && errors.push(name + ' is required.');
            test.internationalNumber === false && errors.push(name + ' needs an international calling code, e.g. +65');
            test.urlValidator === false && errors.push(name + ' should start with http://');
            return errors;
        }
    },
    created() {
        this.edit = JSON.parse(JSON.stringify(this.candidate));
    },
    watch: {
        birthdayMenu (val) {
            val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
        },
        birthday (val) {
            if (val) {
                this.edit.birthday = new Date(val);
            } else {
                this.edit.birthday = null;
            }
        }
    },
    validations: {
        edit: {
            firstName: { required },
            lastName: { required },
            email: { required },
            contactNumber: { 
                required,
                internationalNumber(contactNumber) {
                    return /^\+[0-9]*$/.test(contactNumber);
                }
            },
            residenceCity: { required },
            linkedInUrl: { urlValidator },
            scmUrl: { urlValidator },
            websiteUrl: { urlValidator }
        }
    }
}
</script>

<style scoped lang="scss">
</style>