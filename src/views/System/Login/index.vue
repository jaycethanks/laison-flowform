<template>
  <div class="login-page-root">
    <!-- <Logo class="logo" /> -->
    <FlowFormSvgIcon style="height: 48px" />
    <a-form id="components-form-demo-normal-login" :form="form" class="login-form" @submit="handleSubmit">
      <a-form-item>
        <a-input
          v-decorator="['userName', { rules: [{ required: true, message: 'Please input your username!' }] }]"
          placeholder="Username"
        >
          <a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-decorator="['password', { rules: [{ required: true, message: 'Please input your Password!' }] }]"
          type="password"
          placeholder="Password"
        >
          <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)" />
        </a-input>
      </a-form-item>
      <a-form-item>
        <!-- <a-checkbox
          v-decorator="[
            'remember',
            {
              valuePropName: 'checked',
              initialValue: true,
            },
          ]"
        >
          Remember me
        </a-checkbox> -->
        <!-- <a class="login-form-forgot" href=""> Forgot password </a> -->
        <a-button block type="primary" html-type="submit" class="login-form-button"> Log in </a-button>

        <!-- <a href=""> register now! </a> -->
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import FlowFormSvgIcon from '@/assets/svg_logo/FlowFormSvgIcon.vue';
export default {
  components: {
    FlowFormSvgIcon,
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'normal_login' });
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
.login-page-root {
  height: 100vh;
  width: 100vw;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .logo {
    width: 200px;
    fill: #000;
  }
  #components-form-demo-normal-login.login-form {
    max-width: 48rem;
  }
}

/* #components-form-demo-normal-login.login-form-forgot {
  float: right;
}
#components-form-demo-normal-login.login-form-button {
  width: 100%;
} */
</style>
