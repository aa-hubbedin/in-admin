<template>
    <v-card>
        <v-card-title>
            Work Experience
            <v-spacer></v-spacer>
            <v-btn
                color="teal"
                dark
                fab
                v-bind="size"
                @click="addJob"
            >
                <v-icon v-bind="size">mdi-plus</v-icon>
            </v-btn>
        </v-card-title>

        <v-card-text
            max-height="600"
        >
            <template v-for="(job, index) in edit.jobs">
                <v-divider :key="'div-' + index" v-if="index > 0" class="my-4"></v-divider>
                <v-row
                    :key="index"
                >
                    <v-col cols="7" v-if="$vuetify.breakpoint.mdAndUp">
                        <v-row no-gutters>
                            <v-col cols="6">
                                <v-combobox
                                    v-model="job.company"
                                    :items="companies"
                                    item-text="name"
                                    label="Company"
                                    outlined
                                    dense
                                    hide-details="auto"
                                    @blur="$v.edit.jobs.$each[index].company.name.$touch()"
                                    :error-messages="validationErrors($v.edit.jobs.$each[index].company.name, 'Company')"
                                ></v-combobox>
                            </v-col>

                            <v-col cols="3" class="pl-2">
                                <v-text-field
                                    v-model="job.city"
                                    label="City"
                                    outlined
                                    dense
                                    hide-details="auto"
                                    @blur="$v.edit.jobs.$each[index].city.$touch()"
                                    :error-messages="validationErrors($v.edit.jobs.$each[index].city, 'City')"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="3" class="pl-2">
                                <v-text-field
                                    v-model="job.country"
                                    label="Country"
                                    outlined
                                    dense
                                    hide-details="auto"
                                    @blur="$v.edit.jobs.$each[index].country.$touch()"
                                    :error-messages="validationErrors($v.edit.jobs.$each[index].country, 'Country')"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-col>

                    <template v-else>
                        <v-col cols="12">
                            <div class="d-flex">
                                <v-combobox
                                    v-model="job.company"
                                    :items="companies"
                                    item-text="name"
                                    label="Company"
                                    outlined
                                    dense
                                    hide-details="auto"
                                    @blur="$v.edit.jobs.$each[index].company.name.$touch()"
                                    :error-messages="validationErrors($v.edit.jobs.$each[index].company.name, 'Company')"
                                ></v-combobox>
                                
                                <v-btn
                                    class="ml-1"
                                    color="error"
                                    icon
                                    @click="removeJob(index)"
                                ><v-icon>mdi-delete</v-icon></v-btn>
                            </div>
                        </v-col>

                        <v-col cols="12">
                            <v-text-field
                                v-model="job.city"
                                label="City"
                                outlined
                                dense
                                hide-details="auto"
                                @blur="$v.edit.jobs.$each[index].city.$touch()"
                                :error-messages="validationErrors($v.edit.jobs.$each[index].city, 'City')"
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-text-field
                                v-model="job.country"
                                label="Country"
                                outlined
                                dense
                                hide-details="auto"
                                @blur="$v.edit.jobs.$each[index].country.$touch()"
                                :error-messages="validationErrors($v.edit.jobs.$each[index].country, 'Country')"
                            ></v-text-field>
                        </v-col>
                    </template>

                    <v-col cols="12" md="5">
                        <div class="d-flex">
                            <v-menu
                                v-model="startDateMenu[index]"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        label="Start Date"
                                        v-model="startDate[index]"
                                        :prepend-icon="$vuetify.breakpoint.mdAndUp ? mdi-calendar : ''"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                        outlined
                                        dense
                                        hide-details="auto"
                                        clearable
                                        @blur="$v.edit.jobs.$each[index].startDate.$touch()"
                                        :error-messages="validationErrors($v.edit.jobs.$each[index].startDate, 'Start Date')"
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    :ref="'startpicker'+index"
                                    v-model="startDate[index]"
                                    @input="startDateMenu[index] = false"
                                    :max="new Date().toISOString().substr(0, 10)"
                                    type="month"
                                ></v-date-picker>
                            </v-menu>

                            <v-menu
                                v-model="endDateMenu[index]"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        class="ml-2"
                                        label="End Date"
                                        v-model="endDate[index]"
                                        :prepend-icon="$vuetify.breakpoint.mdAndUp ? mdi-calendar : ''"
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
                                    :ref="'endpicker'+index"
                                    v-model="endDate[index]"
                                    @input="endDateMenu[index] = false"
                                    :max="new Date().toISOString().substr(0, 10)"
                                    type="month"
                                ></v-date-picker>
                            </v-menu>
                            
                            <template v-if="$vuetify.breakpoint.mdAndUp">
                                <v-btn
                                    class="ml-2"
                                    color="error"
                                    icon
                                    @click="removeJob(index)"
                                ><v-icon>mdi-delete</v-icon></v-btn>
                            </template>
                        </div>
                    </v-col>

                    <v-col cols="12" md="8">
                        <v-text-field
                            v-model="job.title"
                            label="Title"
                            outlined
                            dense
                            hide-details="auto"
                            @blur="$v.edit.jobs.$each[index].title.$touch()"
                            :error-messages="validationErrors($v.edit.jobs.$each[index].title, 'Title')"
                        ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4">
                        <v-combobox
                            v-model="job.department"
                            :items="departments"
                            item-text="name"
                            label="Department"
                            outlined
                            dense
                            hide-details="auto"
                            @blur="$v.edit.jobs.$each[index].department.name.$touch()"
                            :error-messages="validationErrors($v.edit.jobs.$each[index].department, 'Department')"
                        ></v-combobox>
                    </v-col>

                    <v-col cols="12" md="6">
                        <div class="d-flex">
                            <v-text-field
                                v-model="job.salaryCurrency"
                                label="Currency"
                                outlined
                                dense
                                hide-details="auto"
                            ></v-text-field>

                            <v-text-field
                                class="ml-2"
                                v-model="job.salary"
                                label="Salary"
                                outlined
                                dense
                                hide-details="auto"
                            ></v-text-field>
                        </div>
                    </v-col>

                    <v-col cols="12">
                        <div>Description</div>
                        <v-textarea
                            v-model="job.description"
                            class="mt-1"
                            outlined
                            hide-details="auto"
                        ></v-textarea>
                    </v-col>
                </v-row>
            </template>
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
import { required } from 'vuelidate/lib/validators'

export default {
    name: 'jobEdit',
    mixins: [validationMixin],
    props: {
        candidate: {
            required: true,
            type: Object
        }
    },
    computed: {
        size () {
            const size = {xs:'x-small',sm:'small'}[this.$vuetify.breakpoint.name];
            return size ? { [size]: true } : {}
        }
    },
    data() {
        return {
            loading: false,
            error: null,
            edit: {},
            companies: [],
            departments: [],

            levels: ['Undergraduate', 'Master\'s', 'Doctorate', 'Diploma', 'Others'],

            startDate: {},
            endDate: {},
            startDateMenu: {},
            endDateMenu: {},

            axiosConfig: {
                headers: {
                    Authorization: 'Bearer ' + this.$auth.token
                }
            }
        }
    },
    methods: {
        getData() {
            this.getCompanies();
            this.getDepartments();
        },
        async getCompanies() {
            this.loading = true;
            try {
                var response = await this.$axios.get(this.$apiBase + '/v1/companies', this.axiosConfig);
                this.companies = response.data.companies;
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
            }
        },
        async getDepartments() {
            this.loading = true;
            try {
                var response = await this.$axios.get(this.$apiBase + '/v1/departments', this.axiosConfig);
                this.departments = response.data.departments;
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
            }
        },
        async createCompany(company) {
            return await this.$axios.post(this.$apiBase + '/v1/companies', {
                name: company 
            }, this.axiosConfig);
        },
        async createDepartment(department) {
            return await this.$axios.post(this.$apiBase + '/v1/departments', {
                name: department
            }, this.axiosConfig);
        },
        async updateJobs() {
            var existingCompanies = this.companies.map(company => company.name);
            var existingDepartments = this.departments.map(department => department.name);

            for (var job of this.edit.jobs) {
                var company = job.company;
                // if company does not exist, create it
                if (!company.id && !existingCompanies.includes(company.name)) {
                    var coResponse = await this.createCompany(company);
                    job.company = coResponse.data;
                }

                var department = job.department;
                // if department does not exist, create it
                if (!department.id && !existingDepartments.includes(department.name)) {
                    var dpResponse = await this.createDepartment(department);
                    job.department = dpResponse.data;
                }

                // create job history if not in current history
                if (!job.id) {
                    await this.createJob(job);
                } else {
                    await this.updateJob(job);
                }
            }

            // delete all job histories that have been removed
            var updatedJobs = this.edit.jobs.map(job => job.id);
            for (const job of this.candidate.jobs) {
                if (!updatedJobs.includes(job.id)) {
                    await this.deleteJob(job);
                }
            }
        },
        async createJob(job) {
            if (job.description) {
                job.description = job.description.replace(/\n\r?/g, '<br />\n');
            }

            return this.$axios.post(this.$apiBase + '/v1/jobhistories', {
                candidateId: this.candidate.id,
                companyId: job.company.id,
                departmentId: job.department.id,
                country: job.country,
                city: job.city,
                title: job.title,
                startDate: job.startDate,
                endDate: job.endDate,
                salaryCurrency: job.salaryCurrency,
                salary: job.salary,
                description: job.description
            }, this.axiosConfig);
        },
        async updateJob(job) {
            if (job.description) {
                job.description = job.description.replace(/\n\r?/g, '<br />\n');
            }

            return this.$axios.put(this.$apiBase + '/v1/jobhistories/' + job.id, {
                id: job.id,
                candidateId: this.candidate.id,
                companyId: job.company.id,
                departmentId: job.department.id,
                country: job.country,
                city: job.city,
                title: job.title,
                startDate: job.startDate,
                endDate: job.endDate,
                salaryCurrency: job.salaryCurrency,
                salary: job.salary,
                description: job.description
            }, this.axiosConfig);
        },
        async deleteJob(job) {
            let config = this.axiosConfig;
            config['data'] = {
                candidateId: this.edit.id
            }
            return this.$axios.delete(this.$apiBase + '/v1/jobhistories/' + job.id, config);
        },
        async save() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                return;
            }

            try {
                await this.updateJobs();
            } catch (e) {
                this.error = e;
            } finally {
                this.$emit('close');
            }
        },
        addJob() {
            this.edit.jobs = this.edit.jobs || [];
            this.edit.jobs.push({
                candidateId: this.candidate.id
            });
        },
        removeJob(index) {
            this.edit.jobs.splice(index, 1);
        },
        validationErrors(test, name) {
            const errors = [];
            if (!test.$dirty) return errors;
            test.required === false && errors.push(name + ' is required.');
            return errors;
        }
    },
    created() {
        this.getData();
        // create deep copy of candidate
        this.edit = JSON.parse(JSON.stringify(this.candidate));
        // parse job dates
        for (let i = 0; i < this.edit.jobs.length; i++) {
            let job = this.edit.jobs[i];
            if (job.startDate) {
                this.startDate[i] = new Date(job.startDate).toISOString().substr(0, 10);
            }
            if (job.endDate) {
                this.endDate[i] = new Date(job.endDate).toISOString().substr(0, 10);
            }
        }
        if (this.edit.jobs.length == 0) {
            this.addAcademic();
        }
    },
    watch: {
        // startDateMenu: {
        //     handler (val) {
        //         for (let i of Object.keys(val)) {
        //             val[i] && setTimeout(() => (this.$refs['startpicker'+i].activePicker = 'YEAR'));
        //         }
        //     },
        //     deep: true
        // },
        // endDateMenu: {
        //     handler (val) {
        //         for (let i of Object.keys(val)) {
        //             val[i] && setTimeout(() => (this.$refs['endpicker'+i].activePicker = 'YEAR'));
        //         }
        //     },
        //     deep: true
        // },
        startDate: {
            handler (val) {
                for (let i of Object.keys(val)) {
                    let date = val[i];
                    if (date) {
                        this.edit.jobs[i].startDate = new Date(date);
                    } else {
                        this.edit.jobs[i].startDate = null;
                    }
                }
            },
            deep: true
        },
        endDate: {
            handler (val) {
                for (let i of Object.keys(val)) {
                    let date = val[i];
                    if (date) {
                        this.edit.jobs[i].endDate = new Date(date);
                    } else {
                        this.edit.jobs[i].endDate = null;
                    }
                }
            },
            deep: true
        }
    },
    validations: {
        edit: {
            jobs: {
                $each: {
                    company: {
                        name: { required }
                    },
                    department: {
                        name: { required }
                    },
                    city: { required },
                    country: { required },
                    title: { required },
                    startDate: { required }
                }
            }
        }
    }
}
</script>

<style scoped lang="scss">
.right-input >>> input {
    text-align: right !important;
}
</style>