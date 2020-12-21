<template>
    <v-card>
        <v-card-title>
            {{ title }}
        </v-card-title>

        <v-card-text>
            <v-row>
                <v-col cols="12" md="6">
                    <v-text-field
                        v-model="edit.name"
                        label="Name"
                        outlined
                        dense
                        hide-details="auto"
                        @blur="$v.edit.name.$touch()"
                        :error-messages="validationErrors($v.edit.name, 'Name')"
                    ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field
                        v-model="edit.imageUrl"
                        label="Image URL"
                        outlined
                        dense
                        hide-details="auto"
                    ></v-text-field>
                </v-col>

                <v-col cols="12">
                    <v-textarea
                        v-model="edit.description"
                        label="Description"
                        outlined
                        dense
                        hide-details="auto"
                        rows="2"
                        auto-grow
                    ></v-textarea>
                </v-col>

                <v-col cols="12">
                    <v-textarea
                        v-model="edit.notes"
                        label="Notes"
                        outlined
                        dense
                        hide-details="auto"
                        rows="2"
                        auto-grow
                    ></v-textarea>
                </v-col>

                <v-col cols="12" md="6">
                    <v-select
                        v-model="edit.difficulty"
                        :items="difficultyLevels"
                        label="Difficulty"
                        outlined
                        dense
                        hide-details="auto"
                    ></v-select>
                </v-col>

                <v-col cols="12" md="6">
                    <v-select
                        v-model="edit.type"
                        :items="types"
                        label="Type"
                        outlined
                        dense
                        hide-details="auto"
                    ></v-select>
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field
                        v-model="edit.timeAllowed"
                        label="Time Allowed (Seconds)"
                        outlined
                        dense
                        hide-details="auto"
                    ></v-text-field>
                </v-col>
                
                <v-col cols="12" md="6">
                    <v-text-field
                        v-model="edit.numQuestions"
                        type="number"
                        label="Number of Questions"
                        outlined
                        dense
                        hide-details="auto"
                    ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <v-checkbox
                        class="mt-0"
                        v-model="edit.randomise"
                        label="Randomise?"
                        color="indigo"
                        hide-details
                    ></v-checkbox>
                </v-col>

                <v-col cols="12" md="6">
                    <v-checkbox
                        class="mt-0"
                        v-model="edit.canGoBack"
                        label="Can Go Back?"
                        color="indigo"
                        hide-details
                    ></v-checkbox>
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
import { required } from 'vuelidate/lib/validators'

export default {
    name: 'AssessmentFilter',
    mixins: [ validationMixin ],
    props: {
        assessment: {
            required: true,
            type: Object
        },
        method: {
            required: true,
            type: String
        }
    },
    data() {
        return {
            loading: false,
            error: null,
            edit: {},

            difficultyLevels: ['Junior', 'Senior', 'Expert'],
            types: ['Multiple Choice', 'Coding', 'Open', 'Mixed'],

            axiosConfig: {
                headers: {
                    Authorization: 'Bearer ' + this.$auth.token
                }
            }
        }
    },
    computed: {
        title() {
            if (this.method.toLowerCase() === 'put') {
                return 'Edit Assessment';
            } else if (this.method.toLowerCase() === 'post') {
                return 'Create Assessment';
            }
            return null;
        }
    },
    methods: {
        async createAssessment(assessment) {
            return this.$axios.post(this.$apiBase + '/v1/assessments', assessment, this.axiosConfig);
        },
        async updateAssessment(assessment) {
            return this.$axios.put(this.$apiBase + '/v1/assessments/' + assessment.id, assessment, this.axiosConfig);
        },
        async save() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                return;
            }
            
            try {
                if (this.method.toLowerCase() === 'put') {
                    await this.updateAssessment(this.edit)
                } else if (this.method.toLowerCase() === 'post') {
                    await this.createAssessment(this.edit)
                }
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
            return errors;
        }
    },
    created() {
        this.edit = JSON.parse(JSON.stringify(this.assessment));
    },
    watch: {
        assessment(val) {
            this.edit = JSON.parse(JSON.stringify(val));
        }
    },
    validations: {
        edit: {
            name: { required }
        }
    }
}
</script>

<style scoped lang="scss">
</style>