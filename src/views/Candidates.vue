<template>
    <v-container fluid class="candidates">
        <template v-if="!loading">
            <template v-if="candidates">
                <v-card>
                    <v-card-title>
                        Candidates
                    </v-card-title>
                    <v-data-table
                        :headers="headers"
                        :items="filteredCandidates"
                    >
                        <template v-slot:[`item.name`]="{ item }">{{ item.firstName }} {{ item.lastName }}</template>
                        <template v-slot:[`item.createdAt`]="{ item }">{{ formatDate(item.createdAt) }}</template>
                        <template v-slot:[`item.linkedInUrl`]="{ item }"><a v-if="item.linkedInUrl" :href="item.linkedInUrl" target="_blank">Link</a></template>
                        <template v-slot:[`item.expectedSalary`]="{ item }">{{ item.expectedSalaryCurrency }} {{ Number(item.expectedSalary).toLocaleString() }}</template>
                        <template v-slot:[`item.skills`]="{ item }">
                            <v-chip
                                class="ma-1 pa-3"
                                color="indigo"
                                dark
                                v-for="(skill, index) in item.skills"
                                :key="index"
                            >
                                {{ skill.name }}
                            </v-chip>
                        </template>

                        <template v-slot:[`body.prepend`]>
                            <tr>
                                <td><v-text-field v-model="filters.name" dense hide-details></v-text-field></td>
                                <td><v-text-field v-model="filters.email" dense hide-details></v-text-field></td>
                                <td><v-text-field v-model="filters.contactNumber" dense hide-details></v-text-field></td>
                                <td><v-text-field v-model="filters.location" dense hide-details></v-text-field></td>
                                <td><v-text-field v-model="filters.nationality" dense hide-details></v-text-field></td>
                                <td><v-text-field v-model="filters.skills" dense hide-details label="comma separated"></v-text-field></td>
                                <td colspan="1"></td>
                                <td><v-text-field v-model="filters.expectedSalary" dense hide-details label="<="></v-text-field></td>
                                <td><v-text-field v-model="filters.createdAt" dense hide-details label="DD/MM/YYYY"></v-text-field></td>
                            </tr>
                        </template>
                    </v-data-table>
                </v-card>
            </template>

            <v-card v-else>
                <v-card-title>Error</v-card-title>
                <v-card-text>There was an error loading candidates. Please refresh the page.</v-card-text>
            </v-card>
        </template>
    </v-container>
</template>

<script>
import moment from 'moment';

export default {
    name: 'Candidates',
    data() {
        return {
            loading: false,
            error: null,
            candidates: null,
            filteredCandidates: null,

            headers: [
                { text: 'Name', value: 'name', width: '150px', fixed: true },
                { text: 'Email', value: 'email', width: '200px' },
                { text: 'Contact Number', value: 'contactNumber', width: '150px' },
                { text: 'Location', value: 'residenceCity', width: '110px' },
                { text: 'Nationality', value: 'nationality', width: '110px' },
                { text: 'Skills', value: 'skills', width: '250px' },
                { text: 'LinkedIn', value: 'linkedInUrl', width: '100px' },
                { text: 'Expected Salary', value: 'expectedSalary', width: '140px' },
                { text: 'Created', value: 'createdAt', width: '150px' }
            ],

            filters: {
                name: null,
                email: null,
                contactNumber: null,
                location: null,
                nationality: null,
                skills: null,
                expectedSalary: null,
                createdAt: null
            }
        }
    },
    computed: {
        size () {
            const size = {xs:'x-small',sm:'small'}[this.$vuetify.breakpoint.name];
            return size ? { [size]: true } : {}
        }
    },
    methods: {
        async getCandidates() {
            this.loading = true;
            try {
                var response = await this.$axios.get(this.$apiBase + '/v1/candidates', {
                    headers: {
                        Authorization: 'Bearer ' + this.$auth.token
                    }
                });
                this.candidates = response.data.candidates;
                this.filteredCandidates = this.candidates;
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
                this.$emit('cancel-loading');
            }
        },
        formatDate(date) {
            return moment(date).format('D MMM YYYY');
        },
        open(url) {
            window.open(url, "_blank");
        },
    },
    created() {
        this.getCandidates();
    },
    watch: {
        'filters.name': {
            handler(val) {
                this.filteredCandidates = this.candidates.filter(candidate => {
                    let name = candidate.firstName + ' ' + candidate.lastName;
                    if (name.includes(val)) return true;
                    return false;
                });
            }
        },
        'filters.email': {
            handler(val) {
                this.filteredCandidates = this.candidates.filter(candidate => candidate.email.includes(val));
            }
        },
        'filters.contactNumber': {
            handler(val) {
                this.filteredCandidates = this.candidates.filter(candidate => candidate.contactNumber.includes(val));
            }
        },
        'filters.location': {
            handler(val) {
                this.filteredCandidates = this.candidates.filter(candidate => candidate.residenceCity.includes(val));
            }
        },
        'filters.nationality': {
            handler(val) {
                this.filteredCandidates = this.candidates.filter(candidate => candidate.nationality.includes(val));
            }
        },
        'filters.skills': {
            handler(val) {
                this.filteredCandidates = this.candidates.filter(candidate => {
                    let skills = val.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
                    let candidateSkills = candidate.skills.map(skill => skill.name);
                    if (skills.every(skill => candidateSkills.includes(skill))) return true;
                    return false;
                });
            }
        },
        'filters.expectedSalary': {
            handler(val) {
                this.filteredCandidates = this.candidates.filter(candidate => candidate.expectedSalary <= val);
            }
        },
        'filters.createdAt': {
            handler(val) {
                this.filteredCandidates = this.candidates.filter(candidate => {
                    if (val.length == 0) return true;
                    return this.formatDate(candidate.createdAt) == moment(val, 'DD/MM/YYYY').format('D MMM YYYY');
                });
            }
        }
    }
}
</script>

<style>
table > tbody > tr > td:nth-child(1), 
table > thead > tr > th:nth-child(1) {
    position: sticky !important; 
    position: -webkit-sticky !important; 
    left: 0; 
    z-index: 9998;
    background: white;
}
table > thead > tr > th:nth-child(1) {
    z-index: 9999;
}
</style>