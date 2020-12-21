<template>
    <v-card>
        <v-card-title>
            Project
        </v-card-title>

        <v-card-text>
            <v-row>
                <v-col cols="12">
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
                <v-col cols="12">
                    <v-text-field
                        v-model="edit.repoUrl"
                        label="Public Repository URL (e.g. Github)"
                        outlined
                        dense
                        hide-details="auto"
                        @blur="$v.edit.repoUrl.$touch()"
                        :error-messages="validationErrors($v.edit.repoUrl, 'Repository URL')"
                    ></v-text-field>
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
    name: 'ProjectEdit',
    mixins: [validationMixin],
    props: {
        project: {
            type: Object
        }
    },
    data() {
        return {
            loading: false,
            error: null,
            edit: {},
            method: 'post',

            axiosConfig: {
                headers: {
                    Authorization: 'Bearer ' + this.$auth.token
                }
            }
        }
    },
    methods: {
        async createOrUpdateProject() {
            this.loading = true;
            try {
                var response;
                if (this.method === 'post') {
                    response = await this.$axios.post(this.$apiBase + '/v1/projects', {
                        project: this.edit,
                        candidateId: this.$auth.userId
                    }, this.axiosConfig);
                } else {
                    response = await this.$axios.put(this.$apiBase + '/v1/projects/' + this.edit.id, this.edit);
                }
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
            }
            return response;
        },
        async save() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                return;
            }
            
            try {
                var response = await this.createOrUpdateProject();
            } catch (e) {
                this.error = e;
            } finally {
                this.$emit('close');
                this.$emit('scan-project', response.data)
            }
        },
        validationErrors(test, name) {
            const errors = [];
            if (!test.$dirty) return errors;
            test.required === false && errors.push(name + ' is required.');
            test.isGit === false && errors.push(name + ' should end with .git')
            return errors;
        }
    },
    created() {
        if (this.project) {
            this.edit = JSON.parse(JSON.stringify(this.project));
            this.method = 'put';
        }
    },
    validations: {
        edit: {
            name: { required },
            repoUrl: { 
                required,
                isGit(repoUrl) {
                    return /\.git$/.test(repoUrl);
                }
            }
        }
    }
}
</script>

<style scoped lang="scss">
</style>