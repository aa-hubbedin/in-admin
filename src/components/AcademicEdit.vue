<template>
    <v-card>
        <v-card-title>
            Academic History
            <v-spacer></v-spacer>
            <v-btn
                color="teal"
                dark
                fab
                v-bind="size"
                @click="addAcademic"
            >
                <v-icon v-bind="size">mdi-plus</v-icon>
            </v-btn>
        </v-card-title>

        <v-card-text
            max-height="600"
        >
            <template v-for="(academic, index) in edit.academics">
                <v-divider :key="'div-' + index" v-if="index > 0" class="my-4"></v-divider>
                <v-row
                    :key="index"
                >
                    <v-col cols="9" v-if="$vuetify.breakpoint.mdAndUp">
                        <v-row no-gutters>
                            <v-col cols="9">
                                <v-combobox
                                    v-model="academic.institution"
                                    :items="institutions"
                                    item-text="name"
                                    label="Institution"
                                    outlined
                                    dense
                                    hide-details="auto"
                                    @blur="handleInstitution(academic); $v.edit.academics.$each[index].institution.name.$touch()"
                                    :error-messages="validationErrors($v.edit.academics.$each[index].institution.name, 'Institution')"
                                ></v-combobox>
                            </v-col>

                            <v-col cols="3" class="pl-2">
                                <v-text-field
                                    v-model="academic.institution.country"
                                    label="Country"
                                    outlined
                                    dense
                                    hide-details="auto"
                                    @blur="$v.edit.academics.$each[index].institution.country.$touch()"
                                    :error-messages="validationErrors($v.edit.academics.$each[index].institution.country, 'Country')"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-col>

                    <template v-else>
                        <v-col cols="12">
                            <div class="d-flex">
                                <v-combobox
                                    v-model="academic.institution"
                                    :items="institutions"
                                    item-text="name"
                                    label="Institution"
                                    outlined
                                    dense
                                    hide-details="auto"
                                    @blur="handleInstitution(academic); $v.edit.academics.$each[index].institution.name.$touch()"
                                    :error-messages="validationErrors($v.edit.academics.$each[index].institution.name, 'Institution')"
                                ></v-combobox>

                                <template v-if="$vuetify.breakpoint.smAndDown">
                                    <v-btn
                                        class="ml-1"
                                        color="error"
                                        icon
                                        @click="removeAcademic(index)"
                                    ><v-icon>mdi-delete</v-icon></v-btn>
                                </template>
                            </div>
                        </v-col>

                        <v-col cols="12">
                            <v-text-field
                                v-model="academic.institution.country"
                                label="Country"
                                outlined
                                dense
                                hide-details="auto"
                                @blur="$v.edit.academics.$each[index].institution.country.$touch()"
                                :error-messages="validationErrors($v.edit.academics.$each[index].institution.country, 'Country')"
                            ></v-text-field>
                        </v-col>
                    </template>

                    <v-col cols="12" md="3">
                        <div class="d-flex">
                            <v-text-field
                                class="right-input"
                                v-model="academic.yearObtained"
                                label="Year Obtained"
                                outlined
                                dense
                                hide-details="auto"
                                @blur="$v.edit.academics.$each[index].yearObtained.$touch()"
                                :error-messages="validationErrors($v.edit.academics.$each[index].yearObtained, 'Year Obtained')"
                            ></v-text-field>
                            
                            <template v-if="$vuetify.breakpoint.mdAndUp">
                                <v-btn
                                    class="ml-2"
                                    color="error"
                                    icon
                                    @click="removeAcademic(index)"
                                ><v-icon>mdi-delete</v-icon></v-btn>
                            </template>
                        </div>
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-combobox
                            v-model="academic.course"
                            :items="courses"
                            item-text="name"
                            label="Course"
                            outlined
                            dense
                            hide-details="auto"
                            @blur="handleCourse(academic); $v.edit.academics.$each[index].course.name.$touch()"
                            :error-messages="validationErrors($v.edit.academics.$each[index].course.name, 'Course')"
                        ></v-combobox>
                    </v-col>

                    <v-col cols="12" md="3">
                        <v-text-field
                            v-model="academic.grade"
                            label="Grade"
                            outlined
                            dense
                            hide-details="auto"
                        ></v-text-field>
                    </v-col>

                    <v-col cols="12" md="3">
                        <v-select
                            v-model="academic.course.level"
                            label="Level"
                            :items="levels"
                            outlined
                            dense
                            hide-details="auto"
                            @blur="$v.edit.academics.$each[index].course.level.$touch()"
                            :error-messages="validationErrors($v.edit.academics.$each[index].course.level, 'Level')"
                        ></v-select>
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
    name: 'AcademicEdit',
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
            institutions: [],
            courses: [],

            levels: ['Undergraduate', 'Master\'s', 'Doctorate', 'Diploma', 'Others'],

            axiosConfig: {
                headers: {
                    Authorization: 'Bearer ' + this.$auth.token
                }
            }
        }
    },
    methods: {
        getData() {
            this.getInstitutions();
            this.getCourses();
        },
        async getInstitutions() {
            this.loading = true;
            try {
                var response = await this.$axios.get(this.$apiBase + '/v1/institutions', this.axiosConfig);
                this.institutions = response.data.institutions;
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
            }
        },
        async getCourses() {
            this.loading = true;
            try {
                var response = await this.$axios.get(this.$apiBase + '/v1/courses', this.axiosConfig);
                this.courses = response.data.courses;
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
            }
        },
        async createInstitution(institution) {
            return this.$axios.post(this.$apiBase + '/v1/institutions', {
                    name: institution.name,
                    country: institution.country
            }, this.axiosConfig);
        },
        async createCourse(course) {
            return this.$axios.post(this.$apiBase + '/v1/courses', {
                level: course.level,
                name: course.name
            }, this.axiosConfig);
        },
        async updateAcademics() {
            var existingInstitutions = this.institutions.map(institution => institution.name + ", " + institution.country);
            var existingCourses = this.courses.map(course => course.name + ", " + course.level);

            for (var academic of this.edit.academics) {
                var institution = academic.institution;
                // if institution does not exist, create it
                if (!existingInstitutions.includes(institution.name + ", " + institution.country)) {
                    var inResponse = await this.createInstitution(institution);
                    academic.institution = inResponse.data;
                }

                var course = academic.course;
                // if course does not exist, create it
                if (!existingCourses.includes(course.name + ", " + course.level)) {
                    var crResponse = await this.createCourse(course);
                    academic.course = crResponse.data;
                }

                // create academic history if not in current history
                if (!academic.id) {
                    await this.createAcademic(academic);
                } else {
                    await this.updateAcademic(academic);
                }
            }

            // delete all academic histories that have been removed
            var updatedAcademics = this.edit.academics.map(academic => academic.id);
            for (const academic of this.candidate.academics) {
                if (!updatedAcademics.includes(academic.id)) {
                    await this.deleteAcademic(academic);
                }
            }
        },
        async createAcademic(academic) {
            return this.$axios.post(this.$apiBase + '/v1/academichistories', {
                candidateId: this.candidate.id,
                institutionId: academic.institution.id,
                courseId: academic.course.id,
                yearObtained: academic.yearObtained,
                grade: academic.grade
            }, this.axiosConfig);
        },
        async updateAcademic(academic) {
            return this.$axios.put(this.$apiBase + '/v1/academichistories/' + academic.id, {
                id: academic.id,
                candidateId: this.candidate.id,
                institutionId: academic.institution.id,
                courseId: academic.course.id,
                yearObtained: academic.yearObtained,
                grade: academic.grade
            }, this.axiosConfig);
        },
        async deleteAcademic(academic) {
            let config = this.axiosConfig;
            config['data'] = {
                candidateId: this.edit.id
            }
            return this.$axios.delete(this.$apiBase + '/v1/academichistories/' + academic.id, config);
        },
        async save() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                return;
            }
            
            try {
                await this.updateAcademics();
            } catch (e) {
                this.error = e;
            } finally {
                this.$emit('close');
            }
        },
        addAcademic() {
            this.edit.academics = this.edit.academics || [];
            this.edit.academics.push({
                candidateId: this.candidate.id,
                institution: {
                    id: null,
                    name: null,
                    country: null
                },
                course: {
                    id: null,
                    name: null,
                    level: null
                },
                yearObtained: null
            });
        },
        removeAcademic(index) {
            this.edit.academics.splice(index, 1);
        },
        handleInstitution(academic) {
            if (!academic.institution) {
                return
            }
            if (!academic.institution.name) {
                academic.institution = {
                    name: academic.institution.trim()
                }
            }
        },
        handleCourse(academic) {
            if (!academic.course) {
                return
            }
            if (!academic.course.name) {
                academic.course = {
                    name: academic.course.trim()
                }
            }
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
        if (this.edit.academics.length == 0) {
            this.addAcademic();
        }
    },
    validations: {
        edit: {
            academics: {
                $each: {
                    institution: {
                        name: { required },
                        country: { required }
                    },
                    course: {
                        name: { required },
                        level: { required }
                    },
                    yearObtained: { required }
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