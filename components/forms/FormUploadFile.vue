<script setup lang="ts">
import { ref, reactive } from 'vue';
// icons
import { LockIcon, UserIcon, MailIcon, EyeIcon, EyeOffIcon, SquareAsteriskIcon, CurrencyDollarIcon, HandMoveIcon, MovieOffIcon, ListIcon, TimelineIcon } from 'vue-tabler-icons';
import axios from 'axios';
const ax = axios.create();
const picFile = shallowRef();
const emit = defineEmits(['close', 'upload']);
const props = defineProps(['projectId']);
const showPass = ref(false);
const placeHolder = ref('File Name');
const uploadData = reactive({
    name: '',
    due: '',
    file: <any>[]
});
const onPicChange = (event: any) => {
    uploadData.file = event.target.files[0];
    uploadData.name = event.target.files[0].name;
    placeHolder.value = event.target.files[0].name;
    // console.log('FILE: ', event.target.files[0].name);
}

const strapiUrl = useStrapiUrl();

const loading = ref(false);

const onSubmit = async () => {
    loading.value = true;
    const token = useStrapiToken();
    const formData = new FormData();
    formData.append('files', uploadData.file, uploadData.name);
    formData.append('ref', 'api::project.project');
    formData.append('refId', props.projectId);
    formData.append('field', 'file');
    ax.post(`${strapiUrl}/upload`, formData, {
        headers: {
            'Authorization': `Bearer ${token.value}`,
            'Content-Type': 'multipart/form-data'
        }
    }).then((res) => {
        // console.log(res.data);
        emit('upload');
        emit('close');
        loading.value = false;
    }).catch(err => {
        // console.log(err);
        loading.value = false;
    });

}
</script>

<template>
    <v-row>
        <v-col cols="12">
            <v-text-field variant="outlined" type="text" label="Name" :placeholder="placeHolder" color="primary"
                v-model="uploadData.name">
                <template v-slot:prepend-inner>
                    <ListIcon stroke-width="1.5" size="22" class="text-medium-emphasis" />
                </template>
            </v-text-field>
        </v-col>
        <v-col cols="12">
            <v-file-input  @change="onPicChange" label="File input"></v-file-input>
        </v-col>
    </v-row>
    <v-row>
        <v-col col="12" class="d-flex justify-end align-center">
            <v-btn color="error" class="mr-3" flat @click="emit('close')" :loading="loading">Cancel</v-btn>
            <v-btn color="primary" class="mr-3" flat @click="onSubmit" :loading="loading">Submit</v-btn>
        </v-col>
    </v-row>
</template>
