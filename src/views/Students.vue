<template>
    <div id="students">
        <StudentModal
            :open="modalOpened"
            :id="selectedStudentId"
            :data="selectedStudent"
            @closeModal="closeModal()"
            @save="saveDetails($event)"></StudentModal>

        <b-container class="mt-5">
            <b-row>
                <b-col lg="9" cols="7">
                    <h2>Student List</h2>
                </b-col>

                <b-col lg="3" cols="5" class="d-flex justify-content-center align-items-center pl-0 pr-0">
                    <b-button variant="primary" @click="openModal(-1)">Add Student +</b-button>
                </b-col>

            </b-row>

            <b-row>
                <b-col col md="12">
                    <div infinite-wrapper class="infinite-loading-wrapper mt-1">
                        <b-table responsive hover :items="studentTable" :fields="fields">
                            <template #cell(actions)="row">
                                <b-button class="mr-1 mb-1" size="sm" variant="primary" @click="editStudent(row)"><b-icon title="Edit" icon="pencil"></b-icon></b-button>
                                <b-button class="mr-1 mb-1" size="sm" variant="danger" @click="deleteStudent(row)"><b-icon title="Delete" icon="trash"></b-icon></b-button>
                                <b-button class="mb-1" size="sm" @click="payFee(row)">Pay Fee</b-button>
                            </template>
                        </b-table>
                        <infinite-loading force-use-infinite-wrapper @infinite="infiniteHandler"></infinite-loading>
                    </div>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';
import InfiniteLoading from "vue-infinite-loading";
import StudentModal from "../components/StudentModal";

import studentList from "../students";

export default {
    name: "Students",
    components: {
        StudentModal,
        InfiniteLoading
    },
    data() {
        return {
            fields: [
            {
                key: 'no',
                label: 'No.'
            },
            {
                key: 'name',
                tdClass: 'h5'
            },
            {
                key: 'email'
            },
            {
                key: 'phone'
            },
            {
                key: 'actions',
                label: 'Actions'
            }
            ],
            students: [],
            infiniteWrapperHeight: 0,
            page: 1,
            studentLimit: 30,
            modalOpened: false,
            selectedStudent: {},
            selectedStudentId: -1
        };
    },
    computed: {
        studentTable () {
            return this.students.map( (student,i) => ({
                no: i + 1,
                index: i,
                name: student.firstName + ' ' + student.lastName,
                email: student.email,
                phone: student.phone
            }));
        }
    },
    mounted() {
        this.students = studentList.slice(0, this.studentLimit);
        this.infiniteWrapperHeight = (window.innerHeight * .85) + 'px';
    },
    methods: {
        ...mapMutations(['setStudent']),
        saveDetails(data) {
            if ( data.id === -1 ) {
                this.students.unshift(data.data);
            } else if (this.students[data.id]) {
                this.students[data.id] = {...data.data};
            }
        },
        getStudent(id, stringify = true) {
            let student;

            if (this.students[id]) {
                student = this.students[id]
            } else {
                student = {
                    firstName: '',
                    lastName: '',
                    phone: '',
                    email: '',
                    address: ''
                };
            }

            return stringify ? JSON.stringify(student) : student;
        },
        closeModal() {
            this.data = '';
            this.selectedStudent = -1;
            this.modalOpened = false;
        },
        openModal(id) {
            this.modalOpened = true;
            this.selectedStudent = this.getStudent(id);
            this.selectedStudentId = id;
        },
        infiniteHandler($state) {
            if (this.students.length < studentList.length) {
                const start = this.studentLimit * this.page;
                const end = Math.min(start + this.studentLimit, studentList.length);

                const newStudents = studentList.slice(start, end);

                this.students = [...this.students, ...newStudents];
                this.page += 1;
                $state.loaded();
            } else {
                $state.complete();
            }
        },
        editStudent(row) {
            this.openModal(row.item.index)
        },
        deleteStudent(row) {
            this.$swal({
                title: 'Delete',
                text: `Are you sure you want to delete ${row.item.name}?`,
                buttons: {
                    cancel: {
                        text: 'No',
                        visible: true,
                        value: false
                    },
                    confirm: {
                        text: 'Yes',
                        visible: true,
                        value: true
                    }
                },
                icon: 'warning'
            })
            .then(ok => {
                if (ok) {
                    this.students = [...this.students.slice(0, row.item.index), ...this.students.slice(row.item.index + 1)];
                }
            });
        },
        payFee(row) {
            this.$swal({
                title: '',
                text: `Do you want to continue to pay the fee for ${row.item.name}?`,
                buttons: true,
                icon: 'info'
            })
            .then(ok => {
                if (ok) {
                    const student = this.getStudent(row.item.index, false);
                    student.index = row.item.index;

                    this.setStudent( student );
                    this.$router.push('/pay-now');
                }
            });
        }
    }
};
</script>

<style scoped>
.infinite-loading-wrapper {
    overflow: auto;
}
</style>