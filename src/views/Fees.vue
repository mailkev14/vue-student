<template>
	<div id="fees" v-if="student">
		<b-container class="mt-5">
			<b-row>
				<b-col cols="12">
					<h1 class="text-center">Pay fees for {{ `${studentDetails.firstName} ${studentDetails.lastName}` }}</h1>
				</b-col>
			</b-row>

			<b-row class="mt-5">
				<b-col cols="12">
					<b-table responsive :items="student" :fields="fields">
						<template #cell(actions)>
							<b-button
								size="sm"
								variant="outline-primary"
								:disabled="paid"
								@click="payNow">{{ paid ? 'Payment Done' : 'Pay Now' }}</b-button>
						</template>
					</b-table>
					<!-- <b-container fluid>
						<b-row class="mb-3">
							<b-col cols="2" class="h6 pl-0 pr-0">Name</b-col>
							<b-col offset="1" cols="9">{{ `${ student.firstName } ${student.lastName}` }}</b-col>
						</b-row>
						<b-row class="mb-3">
							<b-col cols="2" class="h6 pl-0 pr-0">Phone</b-col>
							<b-col offset="1" cols="9">{{ `${ student.phone }` }}</b-col>
						</b-row>
						<b-row class="mb-3">
							<b-col cols="2" class="h6 pl-0 pr-0">Email</b-col>
							<b-col offset="1" cols="9">{{ `${ student.email }` }}</b-col>
						</b-row>
						<b-row>
							<b-col cols="2" class="h6 pl-0 pr-0">Address</b-col>
							<b-col offset="1" cols="9">{{ `${ student.address }` }}</b-col>
						</b-row>
					</b-container> -->
				</b-col>
			</b-row>
			
			<b-row class="mt-5">
				<b-col>
					<b-button variant="primary" @click="$router.push('students')">Back</b-button>
				</b-col>
			</b-row>
		</b-container>
		
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	name: 'Fees',
	data: () => ({
		fields: [
            {
                key: 'name',
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
		paid: false
	}),
	computed: {
		...mapGetters({studentDetails: 'getStudent'}),
		student() {
			return this.studentDetails ? [
				{
					name: this.studentDetails.firstName + ' ' + this.studentDetails.lastName,
					phone: this.studentDetails.phone,
					email: this.studentDetails.email,
					address: this.studentDetails.address
				}
			]: null;
		}
	},
	methods: {
		payNow() {
			this.$swal({
				title: 'Pay Fees?',
				text: 'Are you sure you want to continue to the payment gateway?',
				buttons: true,
				icon: 'info'
			})
			.then(ok => {
				if (ok) {
					this.paid = true;
					this.$swal({ title: 'Success!', text: 'Thank you for your payment of Rs. XXXXX/-' });
				}
			});
		}
	},
	beforeRouteEnter (to, from, next) {
		next(vm => {
			if ( !vm.studentDetails ) {
				vm.$router.push('/students');
			}
		});
	}
}
</script>