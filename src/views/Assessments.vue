<template>
    <v-container fluid class="assessments">
        <v-card>
            <v-card-title>
                Assessments
                <v-spacer></v-spacer>
                <v-speed-dial
                    v-model="menu"
                    direction="left"
                    transition="slide-x-reverse-transition"
                    style="z-index: 2;"
                >
                    <template v-slot:activator>
                        <v-btn
                            v-model="menu"
                            color="indigo"
                            dark
                            fab
                            v-bind="size"
                        >
                            <v-icon v-if="menu">
                                mdi-close
                            </v-icon>
                            <v-icon v-else>
                                mdi-dots-horizontal
                            </v-icon>
                        </v-btn>
                    </template>
                    <v-btn
                        fab
                        dark
                        small
                        color="teal"
                        @click="selected = emptyAssessment; createDialog = true"
                    >
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                    <v-btn
                        fab
                        dark
                        small
                        color="orange"
                        @click="filterDialog = true"
                    >
                        <v-icon>mdi-filter</v-icon>
                    </v-btn>
                    <v-btn
                        fab
                        dark
                        small
                        color="deep-purple"
                        @click="importDialog = true"
                    >
                        <v-icon>mdi-import</v-icon>
                    </v-btn>
                </v-speed-dial>

                <v-dialog
                    v-model="createDialog"
                    scrollable
                    max-width="600"
                >
                    <AssessmentEdit
                        :assessment="selected"
                        method="post"
                        @close="createDialog = false"
                    />
                </v-dialog>
                <v-dialog
                    v-model="filterDialog"
                    scrollable
                    max-width="500"
                >
                    <AssessmentFilter
                        @close="filterDialog = false"
                        @filter="filters=>getAssessments(filters)"
                    />
                </v-dialog>
                
                <v-dialog
                    v-model="importDialog"
                    max-width="500"
                    persistent
                >
                    <QuestionImport
                        @close="importDialog = false"
                    ></QuestionImport>
                </v-dialog>
            </v-card-title>
        </v-card>

        <template v-if="assessments.length > 0">
            <v-row>
                <v-col cols="6" md="3"
                    v-for="(assessment, index) in assessments"
                    :key="index"
                >
                    <v-card>
                        <div class="top-left font-weight-bold">{{ assessment.id }}</div>
                        <div class="top-right d-flex">
                            <v-btn
                                class="mr-2"
                                color="indigo"
                                dark
                                fab
                                x-small
                                @click="selected = assessment; editDialog = true;"
                            >
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>

                            <v-btn
                                color="error"
                                fab
                                x-small
                                @click="selected = assessment; deleteDialog = true;"
                            >
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </div>
                        <v-img
                            :height="$vuetify.breakpoint.mdAndUp ? 200 : 150"
                            contain
                            :src="assessment.imageUrl"
                        ></v-img>

                        <v-card-title align="center">
                            <div class="title">{{ assessment.name }}</div>
                        </v-card-title>

                        <v-card-subtitle>
                            <div v-if="assessment.difficulty">{{ assessment.difficulty }}</div>
                            <div v-if="assessment.type">{{ assessment.type }}</div>
                        </v-card-subtitle>

                        <v-card-text>
                            <div class="description">{{ assessment.description }}</div>
                            <div class="mt-2 font-weight-bold">{{ assessment.questions ? assessment.questions.length : 0 }} Questions</div>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                class="px-4"
                                color="blue"
                                dark
                                :to="'/assessments/' + assessment.id"
                            >
                                Show More
                            </v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </template>

        <v-dialog
            v-model="editDialog"
            scrollable
            max-width="500"
        >
            <AssessmentEdit
                :assessment="selected"
                method="put"
                @close="editDialog = false"
            />
        </v-dialog>
        <v-dialog
            v-model="deleteDialog"
            scrollable
            max-width="500"
        >
            <v-card>
                <v-card-title>
                    Delete Assessment?
                </v-card-title>
                <v-card-text>
                    Are you sure you want to delete <strong>{{ selected.name }}</strong>?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="error"
                        @click="deleteDialog = false"
                    >No</v-btn>
                    <v-btn
                        color="teal"
                        dark
                        @click="deleteAssessment"
                    >Yes</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import AssessmentEdit from '@/components/AssessmentEdit';
import AssessmentFilter from '@/components/AssessmentFilter';
import QuestionImport from '@/components/QuestionImport';

export default {
    name: 'Assessments',
    components: {
        AssessmentEdit,
        AssessmentFilter,
        QuestionImport
    },
    data() {
        return {
            loading: false,
            error: null,
            assessments: [],
            selected: {},
            emptyAssessment: {
                id: null,
                name: null,
                description: null,
                notes: null,
                imageUrl: null,
                difficulty: null,
                timeAllowed: null,
                type: null,
                randomise: null,
                numQuestions: null,
                canGoBack: null
            },

            filterDialog: false,
            createDialog: false,
            editDialog: false,
            deleteDialog: false,
            importDialog: false,

            menu: false,
            
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
        async getAssessments(filters = null) {
            this.loading = true;
            
            var endpoint = this.$apiBase + '/v1/assessments';
            endpoint += this.getParams(filters);
            
            try {
                var response = await this.$axios.get(endpoint, this.axiosConfig);
                this.assessments = response.data.assessments;
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
                this.$emit('cancel-loading');
            }
        },
        async deleteAssessment() {
            this.loading = true;
            try {
                await this.$axios.delete(this.$apiBase + '/v1/assessments/' + this.selected.id, this.axiosConfig);
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
            }
        },
        getParams(filters) {
            var params = '';
            if (filters) {
                params = '?';
                for (const key in filters) {
                    if (!Array.isArray(filters[key])) {
                        if (filters[key]) {
                            if (params != '?') {
                                params += '&';
                            }
                            params += key + "=" + encodeURIComponent(filters[key]);
                        }
                    } else {
                        for (const val of filters[key]) {
                            if (val) {
                                if (params != '?') {
                                    params += '&';
                                }
                                params += key + "=" + encodeURIComponent(val);
                            }
                        }
                    }
                }
            }
            return params;
        }
    },
    created() {
        this.selected = JSON.parse(JSON.stringify(this.emptyAssessment));
        this.getAssessments();
    },
    watch: {
        '$route': () => {
            if (this.assessments.length == 0) {
                this.getAssessments();
            }
        }
    }
}
</script>

<style scoped lang="scss">
.title {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1; /* number of lines to show */
    -webkit-box-orient: vertical;
    line-height: 2rem;
    height: 2rem;
}

.description {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* number of lines to show */
    -webkit-box-orient: vertical;
    line-height: 1rem;
    height: 3rem;
}

.top-right {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 1;
}

.top-left {
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 1;
}
</style>