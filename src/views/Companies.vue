<template>
    <v-container fluid class="companies">
        <template v-if="!loading">
            <template v-if="companies">
                <v-card>
                    <v-card-title>
                        Companies
                    </v-card-title>
                    <v-data-table
                        :headers="headers"
                        :items="filteredCompanies"
                    >
                        <template v-slot:[`item.logo`]="{ item }">
                            <v-img
                                width="125"
                                :src="item.logoUrl"
                            ></v-img>
                        </template>
                        <template v-slot:[`item.industries`]="{ item }">
                            <v-chip
                                class="ma-1 pa-3"
                                color="indigo"
                                dark
                                v-for="(industry, index) in item.industries"
                                :key="index"
                            >
                                {{ industry.name }}
                            </v-chip>
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                            <div class="d-flex">
                                <v-btn
                                    color="teal"
                                    dark
                                    @click="clickEdit(item)"
                                    v-bind="size"
                                >
                                    <v-icon v-bind="size">mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn
                                    class="ml-2"
                                    color="error"
                                    @click="clickDelete(item)"
                                    v-bind="size"
                                >
                                    <v-icon v-bind="size">mdi-delete</v-icon>
                                </v-btn>
                            </div>
                        </template>

                        <template v-slot:[`body.prepend`]>
                            <tr>
                                <td colspan="1"></td>
                                <td><v-text-field v-model="filters.name" dense hide-details></v-text-field></td>
                                <td><v-text-field v-model="filters.size" dense hide-details label=">="></v-text-field></td>
                                <td><v-text-field v-model="filters.industries" dense hide-details label="comma separted"></v-text-field></td>
                            </tr>
                        </template>
                    </v-data-table>
                </v-card>
            </template>

            <v-card v-else>
                <v-card-title>Error</v-card-title>
                <v-card-text>There was an error loading companies. Please refresh the page.</v-card-text>
            </v-card>
        </template>

        <v-dialog
            v-model="editDialog"
            max-width="1000"
        >
            <CompanyEdit
                :company="selectedCompany"
                @close="editDialog = false"
            />
        </v-dialog>

        <v-dialog
            v-model="deleteDialog"
            max-width="400"
        >
            <v-card v-if="deleteDialog">
                <v-card-title>Delete {{ selectedCompany.name }}</v-card-title>
                <v-card-text>Are you sure you want to delete {{ selectedCompany.name }}?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="error"
                        @click="deleteDialog = false"
                    >No</v-btn>
                    <v-btn
                        color="teal"
                        dark
                        @click="deleteCompany"
                    >Yes</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-btn
            fixed
            bottom
            right
            fab
            color="teal"
            dark
            @click="clickAdd(emptyCompany)"
        >
            <v-icon>mdi-plus</v-icon>
        </v-btn>
    </v-container>
</template>

<script>
import CompanyEdit from '@/components/CompanyEdit';

export default {
    name: 'Companies',
    components: {
        CompanyEdit
    },
    data() {
        return {
            loading: false,
            error: null,
            companies: null,
            filteredCompanies: null,

            selectedCompany: null,
            emptyCompany: {},

            editDialog: false,
            deleteDialog: false,

            headers: [
                { text: 'Logo', value: 'logo', width: '150px' },
                { text: 'Name', value: 'name', width: '200px' },
                { text: 'Size', value: 'size', width: '150px' },
                { text: 'Industries', value: 'industries', width: '200px' },
                { text: 'Key Persons', value: 'keypersons', width: '200px' },
                { text: 'Actions', value: 'actions', width: '150px'}
            ],

            filters: {
                name: null,
                size: null,
                industries: null
            },

            axiosConfig: {
                headers: {
                    Authorization: 'Bearer ' + this.$auth.token
                }
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
        async getCompanies() {
            this.loading = true;
            try {
                var response = await this.$axios.get(this.$apiBase + '/v1/jobs/companies', {
                    headers: {
                        Authorization: 'Bearer ' + this.$auth.token
                    }
                });
                this.companies = response.data.companies;
                this.filteredCompanies = this.companies;
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
                this.$emit('cancel-loading');
            }
        },
        async deleteCompany() {
            try {
                await this.$axios.delete(this.$apiBase + '/v1/jobs/companies/' + this.selectedCompany.id, this.axiosConfig);
            } catch (e) {
                this.error = e;
            }
        },
        clickAdd(company) {
            this.selectedCompany = company;
            this.editDialog = true;
        },
        clickEdit(company) {
            this.selectedCompany = company;
            this.editDialog = true;
        },
        clickDelete(company) {
            this.selectedCompany = company;
            this.deleteDialog = true;
        }
    },
    created() {
        this.getCompanies();
    },
    watch: {
        'filters.name': {
            handler(val) {
                this.filteredCompanies = this.companies.filter(company => company.name.toLowerCase().includes(val.toLowerCase()));
            }
        },
        'filters.size': {
            handler(val) {
                this.filteredCompanies = this.companies.filter(company => company.size >= Number(val));
            }
        },
        'filters.industries': {
            handler(val) {
                this.filteredCompanies = this.companies.filter(company => {
                    let industries = val.split(',').map(industry => industry.trim()).filter(industry => industry.length > 0);
                    let companyIndustries = company.industries.map(industry => industry.name);
                    if (industries.every(industry => companyIndustries.includes(industry))) return true;
                    return false;
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