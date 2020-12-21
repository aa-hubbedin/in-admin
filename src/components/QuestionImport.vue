<template>
    <v-card>
        <v-card-title>
            Import Questions
        </v-card-title>
        <v-card-text>
            <a :href="template" download>Download XLSX Template</a>

            <v-file-input
                class="mt-4"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                prepend-icon="mdi-paperclip"
                label="Select File (.xlsx, .csv)"
                hide-details="auto"
                outlined
                dense
                @change="parseFile"
            ></v-file-input>

            <div class="d-flex justify-end" v-if="data">
                <strong class="mr-1">{{ data.length }}</strong> lines loaded
            </div>

            <div class="errors mt-4" v-if="parseErrors.length > 0">
                Errors:
                <div v-for="(error, index) in parseErrors.slice(0, 5)" :key="index">
                    {{ error }}
                </div>
            </div>
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
                @click="importQuestions"
            >Import</v-btn>
        </v-card-actions>

        <v-overlay :value="loading">
            <v-progress-circular
                indeterminate
                size="32"
                color="indigo lighten-2"
            ></v-progress-circular>
        </v-overlay>
    </v-card>
</template>

<script>
import Papa from 'papaparse';
import readXlsxFile from 'read-excel-file';
import { URL } from 'read-excel-file';
import template from '@/assets/question-import-template.xlsx';

const schema = {
    'assessmentId': {
        prop: 'assessmentId',
        type: Number
    },
    'type': {
        prop: 'type',
        type: String,
        oneOf: [
            'Multiple Choice',
            'Coding',
            'Open'
        ],
        required: true
    },
    'text': {
        prop: 'text',
        type: String
    },
    'mediaUrl': {
        prop: 'mediaUrl',
        type: URL
    },
    'code': {
        prop: 'code',
        type: String
    },
    'options': {
        prop: 'options',
        type: val => {
            return val.split(',').map(option => option.trim());
        }
    },
    'answer': {
        prop: 'answer',
        type: Number
    },
    'tags': {
        prop: 'tags',
        type: val => {
            return val.split(',').map(tag => tag.trim());
        }
    }
}

export default {
    name: 'QuestionImport',
    data() {
        return {
            loading: false,
            error: null,
            parseErrors: [],
            data: [],

            template: template,

            axiosConfig: {
                headers: {
                    Authorization: 'Bearer ' + this.$auth.token
                }
            }
        }
    },
    methods: {
        async importQuestions() {
            this.loading = true;
            try {
                await this.$axios.post(this.$apiBase + '/v1/bulk/questions', { questions: this.data }, this.axiosConfig);
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
                this.$emit('close');
            }
        },
        parseFile(file) {
            this.data = [];
            this.parseErrors = [];
            if (!file) {
                return;
            }

            this.loading = true;
            if (this.getFileExtension(file.name) === 'csv') {
                Papa.parse(file, {
                    header: true,
                    complete: results => {
                        this.data = results.data.map(row => {
                            return {
                                assessments: [{ 
                                    id: row.assessmentId
                                }],
                                type: row.type,
                                text: row.text,
                                mediaUrl: row.mediaUrl,
                                code: row.code,
                                options: row.options ? row.options.split(',').map(option => option.trim()) : null,
                                answer: row.answer,
                                tags: row.tags ? row.tags.split(',').map(tag => {
                                    return {
                                        name: tag.trim()
                                    }
                                }) : null
                            }
                        });
                        this.parseErrors = results.errors
                        this.loading = false;
                    }
                });
            } else if (this.getFileExtension(file.name) === 'xlsx') {
                readXlsxFile(file, { schema }).then(({rows, errors}) => {
                    this.data = rows.map(row => {
                        return {
                            assessments: [{ 
                                id: row.assessmentId
                            }],
                            type: row.type,
                            text: row.text,
                            mediaUrl: row.mediaUrl,
                            code: row.code,
                            options: row.options,
                            answer: row.answer,
                            tags: row.tags ? row.tags.map(tag => {
                                return {
                                    name: tag.trim()
                                }
                            }) : null
                        }
                    });
                    this.parseErrors = errors;
                    this.loading = false;
                });
            }
        },
        getFileExtension(filename) {
            return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
        }
    }
}
</script>

<style scoped lang="scss">
.errors {
    color: red;
}
</style>