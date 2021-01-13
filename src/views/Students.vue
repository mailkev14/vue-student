<template>
  <div id="students">
    <StudentModal :open="modalOpened" :student="selectedStudent" />

    <b-container>
      <b-row>
        <b-col col md="12" class="text-center p-3">
          <b-button :click="openModal(-1)" variant="primary"
            >Add Student +</b-button
          >
        </b-col>
      </b-row>
    </b-container>

    <!-- <b-container>
      <b-row v-for="(student, index) in students" :key="student.id">
        <b-col>{{ index + 1 }}</b-col>
      </b-row>
    </b-container>
    <infinite-loading @infinite="infiniteHandler"></infinite-loading> -->
  </div>
</template>

<script>
import Console from "Console";
import students from "../students";

import StudentModal from "../components/StudentModal";
import InfiniteLoading from "vue-infinite-loading";

function getStudent(id, students) {
  if (id === -1) {
    return {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
    };
  } else {
    return students.find((s) => s.id === id);
  }
}

export default {
  name: "Students",
  components: {
    StudentModal,
    InfiniteLoading,
  },
  data() {
    return {
      students: students,
      modalOpened: false,
      selectedStudent: {},
    };
  },
  methods: {
    mounted() {
      Console.log(students);
    },
    openModal(id) {
      this.modalOpened = true;

      this.selectedStudent = getStudent(id, this.students);
    },
    infiniteHandler($state) {},
  },
};
</script>