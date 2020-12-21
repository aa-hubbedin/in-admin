<template>
    <v-container fluid class="projects">
        <v-card>
            <v-card-title>
                Projects
                <v-spacer></v-spacer>
                <v-btn
                    color="teal"
                    dark
                    fab
                    v-bind="size"
                    @click="projectDialog = true"
                >
                    <v-icon v-bind="size">mdi-plus</v-icon>
                </v-btn>

                <v-dialog
                    v-model="projectDialog"
                    scrollable
                    max-width="1000"
                >
                    <ProjectEdit
                        @close="projectDialog = false; getProjects()"
                        @scan-project="project=>scanProject(project)"
                    />
                </v-dialog>
            </v-card-title>

            <v-card-subtitle>
                Select your best projects from your list of public repositories
            </v-card-subtitle>
        </v-card>

        <template v-if="projects.length > 0">
            <v-row>
                <v-col cols="12" md="6"
                    v-for="(project, index) in projects"
                    :key="index"
                >
                    <v-card>
                        <v-card-title class="align-top">
                            {{ project.name }}
                            <v-spacer></v-spacer>
                            <div class="d-flex flex-column align-end">
                                <div>
                                    <v-btn
                                        color="indigo"
                                        :dark="!disableScan"
                                        v-bind="size"
                                        @click="scanProject(project)"
                                        :disabled="disableScan"
                                    >
                                        Scan
                                    </v-btn>
                                </div>
                                <div class="lastscan"
                                    v-if="project.ratings.length > 0 && project.ratings[0].createdAt"
                                >
                                    Last Scan: {{ formatDate(project.ratings[0].createdAt) }}
                                </div>
                            </div>
                        </v-card-title>

                        <v-card-text
                            v-if="project.ratings.length > 0"
                        >
                            <div class="d-flex justify-space-between">
                                <h4>Reliability (Bugs)</h4>
                                <v-rating
                                    :value="getRating(project.ratings[0].reliabilityRating)"
                                    color="orange"
                                    background-color="orange lighten-3"
                                ></v-rating>
                            </div>
                            <div class="d-flex justify-space-between">
                                <h4>Maintainability (Code Smells)</h4>
                                <v-rating
                                    :value="getRating(project.ratings[0].maintainabilityRating)"
                                    color="orange"
                                    background-color="orange lighten-3"
                                ></v-rating>
                            </div>
                            <div class="d-flex justify-space-between">
                                <h4>Security (Vulnerabilities)</h4>
                                <v-rating
                                    :value="getRating(project.ratings[0].securityRating)"
                                    color="orange"
                                    background-color="orange lighten-3"
                                ></v-rating>
                            </div>
                            <div class="d-flex justify-space-between">
                                <h4>Security Review (Hotspots)</h4>
                                <v-rating
                                    :value="getRating(project.ratings[0].securityReviewRating)"
                                    color="orange"
                                    background-color="orange lighten-3"
                                ></v-rating>
                            </div>
                            <div class="d-flex justify-space-between mt-1">
                                <h4>Coverage</h4>
                                <h4>{{ project.ratings[0].coverage }}%</h4>
                            </div>
                            <div class="d-flex justify-space-between mt-3">
                                <h4>Duplications</h4>
                                <h4>{{ project.ratings[0].duplications }}%</h4>
                            </div>
                            <div class="d-flex justify-space-between mt-3">
                                <h4>Lines</h4>
                                <h4>{{ project.ratings[0].lines }}</h4>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </template>

        <v-dialog
            v-model="scanDialog"
            scrollable
            max-width="500"
        >
            <v-card>
                <v-card-title>Scanning</v-card-title>
                <v-card-text>
                    Please allow some time for the scan to complete. 
                    You should be able to see your results here when you refresh after 5 minutes.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="error"
                        @click="scanDialog = false"
                    >Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import ProjectEdit from '@/components/ProjectEdit';
import moment from 'moment';

export default {
    name: 'Projects',
    components: {
        ProjectEdit
    },
    data() {
        return {
            loading: false,
            error: null,
            projects: [],

            projectDialog: false,
            scanDialog : false,

            disableScan: false,

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
        async getProjects() {
            this.loading = true;
            try {
                var response = await this.$axios.get(this.$apiBase + '/v1/projects?candidate_id=' + this.$auth.userId, this.axiosConfig);
                this.projects = response.data.projects;
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
                this.$emit('cancel-loading');
            }
        },
        async scanProject(project) {
            this.loading = true;
            this.disableScan = true;
            this.scanDialog = true;
            try {
                await this.$axios.post(this.$apiBase + '/v1/projects/' + project.id + '/scan', null, this.axiosConfig);
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
            }
        },
        formatDate(date) {
            return moment(date).format("DD MMM YYYY")
        },
        getRating(rating) {
            if (rating) {
                return 6 - rating;
            }
            return 0;
        }
    },
    created() {
        this.getProjects();
    },
    watch: {
        '$route': () => {
            if (this.projects.length == 0) {
                this.getProjects();
            }
        }
    }
}
</script>

<style scoped lang="scss">
.lastscan {
    font-size: 0.7rem !important;
    font-weight: 400 !important;
}

.align-top {
    align-items: start !important;
}
</style>