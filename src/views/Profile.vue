<template>
    <v-container fluid class="profile">
        <template v-if="!loading">
            <template v-if="candidate">
                <v-card>
                    <div class="d-flex flex-no-wrap align-content-center pa-4">
                        <v-avatar size="125">
                            <v-img :src="candidate.picture" alt="Profile Picture" />
                        </v-avatar>

                        <div class="grow">
                            <v-card-title
                                class="headline"
                                v-text="name"
                            />
                                
                            <v-card-subtitle>
                                <div>{{ candidate.email}}</div>
                                <div>{{ candidate.contactNumber }}</div>
                                <div>{{ candidate.residenceCity }}</div>
                            </v-card-subtitle>
                        </div>

                        <div 
                            v-if="$vuetify.breakpoint.mdAndUp"
                            class="d-flex flex-column justify-space-around mr-4"
                        >
                            <h3 
                                class="d-flex align-content-center cursor-pointer" 
                                @click="open(candidate.scmUrl)"
                            >
                                <v-icon class="mr-2">mdi-github</v-icon>
                                Github
                            </h3>
                            <h3 
                                class="d-flex align-content-center cursor-pointer"
                                @click="open(candidate.linkedInUrl)"
                            >
                                <v-icon class="mr-2">mdi-linkedin</v-icon>
                                LinkedIn
                            </h3>
                            <h3 
                                class="d-flex align-content-center cursor-pointer"
                                @click="open(candidate.websiteUrl)"
                            >
                                <v-icon class="mr-2">mdi-web</v-icon>
                                Personal Website
                            </h3>
                        </div>

                        <v-btn
                            color="teal"
                            dark
                            outlined
                            v-bind="size"
                            @click.stop="profileDialog = true"
                        >
                            <v-icon v-bind="size">mdi-pencil</v-icon>
                        </v-btn>

                        <v-dialog
                            v-model="profileDialog"
                            scrollable
                            max-width="1000"
                        >
                            <ProfileEdit
                                :candidate="candidate"
                                @close="profileDialog = false; getProfile()"
                            />
                        </v-dialog>
                    </div>

                    <div 
                        v-if="$vuetify.breakpoint.smAndDown"
                        class="d-flex flex-column justify-space-around mx-4"
                    >
                        <h3 
                            class="d-flex align-content-center cursor-pointer" 
                            @click="open(candidate.scmUrl)"
                        >
                            <v-icon class="mr-2">mdi-github</v-icon>
                            Github
                        </h3>
                        <h3 
                            class="d-flex align-content-center cursor-pointer"
                            @click="open(candidate.linkedInUrl)"
                        >
                            <v-icon class="mr-2">mdi-linkedin</v-icon>
                            LinkedIn
                        </h3>
                        <h3 
                            class="d-flex align-content-center cursor-pointer"
                            @click="open(candidate.websiteUrl)"
                        >
                            <v-icon class="mr-2">mdi-web</v-icon>
                            Personal Website
                        </h3>
                    </div>
                    
                    <v-card-text>
                        <v-row>
                            <v-col cols="12" class="pb-0">
                                <h4>Professional Summary</h4>
                            </v-col>
                            <v-col cols="12">
                                <div>{{ candidate.summary }}</div>
                            </v-col>

                            <v-col cols="6" md="3">
                                <div>Education Level</div>
                            </v-col>
                            <v-col cols="6" md="3">
                                <div>{{ candidate.educationLevel }}</div>
                            </v-col>

                            <v-col cols="6" md="3">
                                <div>Expected Salary</div>
                            </v-col>
                            <v-col cols="6" md="3">
                                <div>{{ expSalary }}</div>
                            </v-col>

                            <v-col cols="6" md="3">
                                <div>Gender</div>
                            </v-col>
                            <v-col cols="6" md="3">
                                <div>{{ candidate.gender }}</div>
                            </v-col>

                            <v-col cols="6" md="3">
                                <div>Nationality</div>
                            </v-col>
                            <v-col cols="6" md="3">
                                <div>{{ candidate.nationality }}</div>
                            </v-col>

                            <v-col cols="6" md="3">
                                <div>Birthday</div>
                            </v-col>
                            <v-col cols="6" md="3">
                                <div>{{ birthday }}</div>
                            </v-col>

                            <v-col cols="6" md="3">
                                <div>Notice Period (months)</div>
                            </v-col>
                            <v-col cols="6" md="3">
                                <div>{{ candidate.noticePeriod }}</div>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>

                <v-card class="mt-4">
                    <v-card-title>
                        <div>Skills</div>

                        <v-spacer></v-spacer>

                        <v-btn
                            color="teal"
                            dark
                            outlined
                            v-bind="size"
                            @click="skillDialog = true"
                        >
                            <v-icon v-bind="size">mdi-pencil</v-icon>
                        </v-btn>

                        <v-dialog
                            v-model="skillDialog"
                            max-width="1000"
                        >
                            <SkillEdit
                                :candidate="candidate"
                                @close="skillDialog = false; getProfile()"
                            />
                        </v-dialog>
                    </v-card-title>

                    <v-card-text>
                        <v-chip
                            class="mx-2 my-1 pa-4"
                            color="indigo"
                            dark
                            v-for="(skill, index) in candidate.skills"
                            :key="index"
                        >
                            {{ skill.name }}
                        </v-chip>
                    </v-card-text>
                </v-card>

                <v-card class="mt-4">
                    <v-card-title>
                        <div>Academic History</div>

                        <v-spacer></v-spacer>

                        <v-btn
                            color="teal"
                            dark
                            outlined
                            v-bind="size"
                            @click="academicDialog = true"
                        >
                            <v-icon v-bind="size">mdi-pencil</v-icon>
                        </v-btn>

                        <v-dialog
                            v-model="academicDialog"
                            scrollable
                            max-width="1000"
                        >
                            <AcademicEdit
                                :candidate="candidate"
                                @close="academicDialog = false; getProfile()"
                            />
                        </v-dialog>
                    </v-card-title>

                    <v-card-text>
                        <div
                            v-for="(academic, index) in candidate.academics"
                            :key="index"
                        >
                            <v-divider v-if="index > 0" class="my-4"></v-divider>
                            <div class="d-flex justify-space-between">
                                <h3>{{ academic.institution.name }}, {{ academic.institution.country }}</h3>
                                <h3>{{ academic.yearObtained }}</h3>
                            </div>

                            <div class="d-flex justify-space-between">
                                <h3>{{ formatCourseName(academic.course) }}</h3>
                                <v-spacer></v-spacer>
                                <h3>{{ academic.course.level }}</h3>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>

                <v-card class="mt-4">
                    <v-card-title>
                        <div>Work Experience</div>

                        <v-spacer></v-spacer>

                        <v-btn
                            color="teal"
                            dark
                            outlined
                            v-bind="size"
                            @click="jobDialog = true"
                        >
                            <v-icon v-bind="size">mdi-pencil</v-icon>
                        </v-btn>

                        <v-dialog
                            v-model="jobDialog"
                            scrollable
                            max-width="1000"
                        >
                            <JobEdit
                                :candidate="candidate"
                                @close="jobDialog = false; getProfile()"
                            />
                        </v-dialog>
                    </v-card-title>

                    <v-card-text>
                        <v-row
                            v-for="(job, index) in candidate.jobs"
                            :key="index"
                        >
                            <v-divider v-if="index > 0" class="my-4"></v-divider>
                            <v-col cols="7" class="pb-1">
                                <h3>{{ formatCompanyName(job) }}</h3>
                            </v-col>

                            <v-col cols="5" class="text-end pb-1">
                                <h3>{{ formatJobDate(job.startDate) }} - {{ formatJobDate(job.endDate) }}</h3>
                            </v-col>

                            <v-col cols="12" class="pt-0">
                                <h3>{{ job.title }} - {{ job.department.name }}</h3>
                            </v-col>

                            <v-col cols="12" v-if="job.salary > 0">
                                <h3>{{ job.salaryCurrency }} {{ job.salary }}</h3>
                            </v-col>

                            <v-col cols="12">
                                <div v-html="job.description"></div>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </template>

            <v-card v-else>
                <v-card-title>Error</v-card-title>
                <v-card-text>There was an error loading your profile. Please refresh the page.</v-card-text>
            </v-card>
        </template>
    </v-container>
</template>

<script>
import ProfileEdit from '@/components/ProfileEdit';
import SkillEdit from '@/components/SkillEdit';
import AcademicEdit from '@/components/AcademicEdit';
import JobEdit from '@/components/JobEdit';
import moment from 'moment';

export default {
    name: 'Profile',
    components: {
        ProfileEdit,
        SkillEdit,
        AcademicEdit,
        JobEdit
    },
    data() {
        return {
            loading: false,
            error: null,
            candidate: null,

            profileDialog: false,
            skillDialog: false,
            academicDialog: false,
            jobDialog: false,
        }
    },
    computed: {
        name() {
            return this.candidate.firstName + " " + this.candidate.lastName;
        },
        birthday() {
            if (this.candidate.birthday) {
                return moment(this.candidate.birthday).format('DD MMM YYYY');
            }
            return null;
        },
        expSalary() {
            return this.candidate.expectedSalaryCurrency + " " + Number(this.candidate.expectedSalary).toLocaleString();
        },
        size () {
            const size = {xs:'x-small',sm:'small'}[this.$vuetify.breakpoint.name];
            return size ? { [size]: true } : {}
        }
    },
    methods: {
        async getProfile() {
            if (!this.$auth.userId) {
                location.reload();
                return;
            }

            this.loading = true;
            try {
                var response = await this.$axios.get(this.$apiBase + '/v1/candidates/' + this.$auth.userId, {
                    headers: {
                        Authorization: 'Bearer ' + this.$auth.token
                    }
                });
                this.candidate = response.data;
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
                this.$emit('cancel-loading');
            }
        },
        open(url) {
            window.open(url, "_blank");
        },

        formatCourseName(course) {
            var val = course.name;
            if (course.grade) {
                val += ", " + course.grade;
            }
            return val;
        },
        formatCompanyName(job) {
            var val = job.company.name;
            if (job.city) {
                val += ", " + job.city;
            }
            if (job.country && job.city != job.country) {
                val += ", " + job.country;
            }
            return val;
        },
        formatJobDate(date) {
            if (date) {
                return moment(date).format('MMM YYYY');
            }
            return 'Current';
        }
    },
    created() {
        this.getProfile();
    },
    watch: {
        '$route': () => {
            if (!this.candidate) {
                this.getProfile();
            }
        }
    }
}
</script>

<style scoped lang="scss">
.cursor-pointer {
    cursor: pointer;
}
</style>