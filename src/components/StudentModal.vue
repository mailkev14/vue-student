<template>
    <div id="studentModal">
        <b-modal
            no-close-on-esc
            no-close-on-backdrop
            hide-header-close
            id="student-modal"
            :title="op + ' Student'"
            ok-title="Save"
            @cancel="onCancel"
            @ok="onOK">

            <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
                <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
                    <ValidationProvider 
                    name="First Name"
                    :rules="{ required: true, min: 2, max: 100 }"
                    v-slot="validationContext">
                        <b-form-group
                            id="firstNameGroup"
                            label="First Name:"
                            label-for="firstName"
                        >
                            <b-form-input
                            id="firstName"
                            v-model="firstName"
                            :state="getValidationState(validationContext)"
                            placeholder="Enter first name"
                            required
                            ></b-form-input>

                            <b-form-invalid-feedback id="firstName-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                        </b-form-group>
                    </ValidationProvider>

                    <ValidationProvider 
                    name="Last Name"
                    :rules="{ required: true, min: 2, max: 100 }"
                    v-slot="validationContext">
                        <b-form-group
                            id="lastNameGroup"
                            label="Last Name:"
                            label-for="lastName"
                        >
                            <b-form-input
                            id="lastName"
                            v-model="lastName"
                            :state="getValidationState(validationContext)"
                            type="text"
                            placeholder="Enter last name"
                            ></b-form-input>

                            <b-form-invalid-feedback id="lastName-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                        </b-form-group>
                    </ValidationProvider>

                    <ValidationProvider 
                    name="Phone"
                    :rules="{ numeric: true, required: true, min: 8, max: 15 }"
                    v-slot="validationContext">
                        <b-form-group
                            id="phoneGroup"
                            label="Phone:"
                            label-for="phone"
                        >
                            <b-form-input
                            id="phone"
                            type="text"
                            v-model="phone"
                            :state="getValidationState(validationContext)"
                            placeholder="Enter phone"
                            ></b-form-input>

                            <b-form-invalid-feedback id="phone-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                        </b-form-group>
                    </ValidationProvider>
                    
                    <ValidationProvider
                    name="Email"
                    :rules="{ email: true, required: true }"
                    v-slot="validationContext">
                        <b-form-group
                            id="emailGroup"
                            label="Email:"
                            label-for="email"
                        >
                            <b-form-input
                            id="email"
                            v-model="email"
                            :state="getValidationState(validationContext)"
                            type="email"
                            placeholder="Enter email"
                            required
                            ></b-form-input>

                            <b-form-invalid-feedback id="email-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                        </b-form-group>
                    </ValidationProvider>
                    
                    <ValidationProvider
                    ref="AddressRef"
                    name="Address"
                    :rules="{required: true, min: 5}"
                    v-slot="validationContext"
                    >
                        <b-form-group
                            id="addressGroup"
                            label="Address:"
                            label-for="address"
                        >
                            <vue-google-autocomplete
                            id="addressAutocomplete"
                            classname="form-control"
                            v-model="address"
                            placeholder="Enter address"
                            @placechanged="getFormattedAddress"
                            @inputChange="setAddress"
                            >
                            </vue-google-autocomplete>

                            <!-- used hidden field to detect validation -->
                            <b-form-input
                            required
                            id="address"
                            v-model="address"
                            :state="getValidationState(validationContext)"
                            
                            v-show="false"></b-form-input>

                            <b-form-invalid-feedback id="address-feedback">{{ validationContext.errors[0] }}</b-form-invalid-feedback>
                        </b-form-group>
                    </ValidationProvider>
                </b-form>
            </ValidationObserver>
        </b-modal>
    </div>
</template>

<script>
import VueGoogleAutocomplete from 'vue-google-autocomplete';

export default {
    name: 'StudentModal',
    props: ['open', 'data', 'id'],
    components: {
        VueGoogleAutocomplete
    },
    data: () => ({
        op: '',
        title: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        address: ''
    }),

    methods: {
        onOK(e) {
            e.preventDefault();

            this.$refs.observer.validate()
                .then( isValid => {
                    if ( isValid ) {
                        this.$swal({
                            title: 'Continue?',
                            text: `Are you sure you want to ${this.op.toLowerCase()} this student information?`,
                            buttons: true,
                            icon: 'info'
                        })
                        .then( ok => {
                            if (ok) {
                                this.$emit('save', {
                                    id: this.id,
                                    data: {
                                        firstName: this.firstName,
                                        lastName: this.lastName,
                                        email: this.email,
                                        address: this.address,
                                        phone: this.phone
                                    }
                                });

                                this.closeModal();
                            }
                        });
                    }
                });
        },
        onCancel(e) {
            e.preventDefault();

            this.$swal({
                title: 'Abort and close?',
                text: 'Are you sure you want to abort this operation and close this window?',
                icon: 'warning',
                buttons: true
            })
            .then( close => {
                if (close) {
                    this.closeModal();
                }
            });
        },
        getFormattedAddress(addressData, placeResultData) {
            this.address = placeResultData.formatted_address;
        },
        closeModal() {
            this.$emit('closeModal');
        },
        handleSubmit () {
            console.log('Form submitted');
        },
        getValidationState({ dirty, validated, valid = null }) {
            return dirty || validated ? valid : null;
        },
        noAddress () {
            this.address = '';
        },
        setAddress (e) {
            this.address = e.newVal;
        },
        resetForm() {
            this.firstName = '';
            this.lastName = '';
            this.phone = '';
            this.email = '';
            this.address = '';

            this.$nextTick(() => {
                this.$refs.observer.reset();
            });
        }
    },
    watch: {
        open (status) {
            if (status) {
                this.op = this.id === -1 ? 'Add' : 'Edit';

                if ( this.id === -1 ) {
                    this.title = this.op + ' Student';
                } else {
                    this.title = this.op + ' Student ' + (this.id + 1);
                }

                let student;

                try {
                    student = JSON.parse(this.data);
                } catch (e) {
                    student = {
                    firstName: '',
                    lastName: '',
                    phone: '',
                    email: '',
                    address: ''
                    }
                }

                this.firstName = student.firstName;
                this.lastName = student.lastName;
                this.phone = student.phone;
                this.email = student.email;
                this.address = student.address;

                // open modal
                this.$bvModal.show('student-modal');
            } else {
                this.$bvModal.hide('student-modal');

                this.resetForm();
            }
        }
    }
};
</script>

<style>
.pac-container.pac-logo {
  z-index: 1100;
}
</style>