<template>
    <v-container fluid class="assessmentshow">
        <v-card class="px-4 py-2" v-if="assessment">
            <v-row>
                <v-col cols="12" md="3">
                    <v-img
                        contain
                        :src="assessment.imageUrl"
                    ></v-img>
                </v-col>

                <v-col cols="12" md="9">
                    <v-card-title>
                        {{ assessment.name }}
                    </v-card-title>
                    <v-card-text>
                        <div>{{ subtitle }}</div>
                        <div class="font-weight-bold" v-if="assessment.timeAllowed">Allowed Time: {{ secondsToString(assessment.timeAllowed) }}</div>

                        <div>{{ assessment.description }}</div>

                        <div>{{ assessment.notes }}</div>

                        <v-divider class="mt-4"></v-divider>

                        <v-row>
                            <v-col cols="12" md="4">
                                Max Questions: {{ assessment.numQuestions > 0 ? assessment.numQuestions : 'N/A' }}
                            </v-col>

                            <v-col cols="12" md="4">
                                Randomise: {{ assessment.randomise ? 'True' : 'False' }}
                            </v-col>
                            
                            <v-col cols="12" md="4">
                                Can Go Back: {{ assessment.canGoBack ? 'True' : 'False' }}
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-col>
            </v-row>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    class="px-4"
                    color="teal"
                    dark
                    @click="importDialog = true;"
                >Import Questions</v-btn>
                <v-spacer v-if="$vuetify.breakpoint.smAndDown"></v-spacer>
            </v-card-actions>
        </v-card>

        <v-card class="mt-4">
            <v-card-title>
                Questions
            </v-card-title>

            <v-card-text>
                <v-data-table
                    :headers="headers"
                    :items="assessment.questions"
                ></v-data-table>
            </v-card-text>
        </v-card>

        <v-dialog
            v-model="importDialog"
            max-width="500"
        >
            <QuestionImport
                @close="importDialog = false"
            ></QuestionImport>
        </v-dialog>
    </v-container>
</template>

<script>
import QuestionImport from '@/components/QuestionImport';

export default {
    name: 'AssessmentShow',
    components: {
        QuestionImport
    },
    props: {
        id: {
            required: true,
            type: String
        }
    },
    data() {
        return {
            loading: false,
            error: null,
            assessment: null,

            importDialog: false,

            headers: [
                { text: 'Type', value: 'type', width: '150px' },
                { text: 'Text', value: 'text', width: '200px' },
                { text: 'Media URL', value: 'mediaUrl', width: '150px' },
                { text: 'Code', value: 'code', width: '200px' },
                { text: 'Options', value: 'options', width: '200px' },
                { text: 'Answer', value: 'answer', width: '80px' }
            ],

            axiosConfig: {
                headers: {
                    Authorization: 'Bearer ' + this.$auth.token
                }
            }
        }
    },
    computed: {
        subtitle() {
            var val = '';
            if (this.assessment.difficulty) {
                val = this.assessment.difficulty;
            }
            if (this.assessment.type) {
                if (val != '') {
                    val += ' | '
                }
                val += this.assessment.type;
            }
            return val;
        },
        questions() {
            var val = this.assessment.questions;
            if (this.assessment.randomise && val.length > 0) {
                this.shuffleArray(val);
            }
            if (this.assessment.numQuestions > 0) {
                let limit = Math.min(this.assessment.numQuestions, val.length);
                val = val.slice(0, limit);
            }
            return val;
        },
    },
    methods: {
        async getAssessment() {
            this.loading = true;
            try {
                var response = await this.$axios.get(this.$apiBase + '/v1/assessments/' + this.id, this.axiosConfig);
                this.assessment = response.data;
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
                this.$emit('cancel-loading');
            }
        },
        secondsToString(sec) {
            var days = Math.floor((sec % 31536000) / 86400); 
            var hours = Math.floor(((sec % 31536000) % 86400) / 3600);
            var minutes = Math.floor((((sec % 31536000) % 86400) % 3600) / 60);
            var seconds = (((sec % 31536000) % 86400) % 3600) % 60;

            var val = '';
            if (days) {
                val += days;
                if (days > 1) {
                    val += ' days ';
                } else {
                    val += ' day ';
                }
            }
            if (hours) {
                val += hours;
                if (hours > 1) {
                    val += ' hours ';
                } else {
                    val += ' hour ';
                }
            }
            if (minutes) {
                val += minutes;
                if (minutes > 1) {
                    val += ' minutes ';
                } else {
                    val += ' minute ';
                }
            }
            if (seconds) {
                val += seconds;
                if (seconds > 1) {
                    val += ' seconds';
                } else {
                    val += ' second';
                }
            }
            return val.trim();
        },
        shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }
    },
    created() {
        this.getAssessment();
    },
    watch: {
        '$route': 'getAssessment'
    }
}
</script>

<style scoped lang="scss">
</style>