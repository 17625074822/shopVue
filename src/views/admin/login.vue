<template>
    <div>
        <a-row>
            <a-col :span="8"></a-col>
            <a-col :span="8">
                <a-form
                        id="components-form-demo-normal-login"
                        :form="form"
                        class="login-form"
                        @submit="handleSubmit"
                >
                    <a-form-item>
                        <a-input
                                v-decorator="[
                'email',
                {
                  rules: [
                    { required: true, message: 'Please input your email!' }
                  ]
                }
              ]"
                                placeholder="Email"
                        >
                            <a-icon
                                    slot="prefix"
                                    type="user"
                                    style="color: rgba(0,0,0,.25)"
                            />
                        </a-input>
                    </a-form-item>
                    <a-form-item>
                        <a-input
                                v-decorator="[
                'password',
                {
                  rules: [
                    { required: true, message: 'Please input your Password!' }
                  ]
                }
              ]"
                                type="password"
                                placeholder="Password"
                        >
                            <a-icon
                                    slot="prefix"
                                    type="lock"
                                    style="color: rgba(0,0,0,.25)"
                            />
                        </a-input>
                    </a-form-item>
                    <a-form-item>
                        <a-checkbox
                                v-decorator="[
                'remember',
                {
                  valuePropName: 'checked',
                  initialValue: true
                }
              ]"
                        >
                            Remember me
                        </a-checkbox>
                        <a class="login-form-forgot" href="">
                            Forgot password
                        </a>
                        <a-button
                                type="primary"
                                html-type="submit"
                                class="login-form-button"
                        >
                            Log in
                        </a-button>
                        Or
                        <router-link to="/register">
                            register now!
                        </router-link>
                    </a-form-item>
                </a-form>
            </a-col>
            <a-col :span="8"></a-col>
        </a-row>
    </div>
</template>

<script>
    import ip from "../../api.js";

    export default {
        beforeCreate() {
            this.form = this.$form.createForm(this, {name: "normal_login"});
        },
        methods: {
            handleSubmit(e) {
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if (!err) {
                        console.log("Received values of form: ", values);
                        this.axios
                            .post(ip.ip + "/login", {
                                email: values.email,
                                password: values.password
                            })
                            .then(data => {
                                console.log(data.data.token.access_token);
                                localStorage.setItem("token", 'Bearer ' + data.data.token.access_token);
                                this.$router.push({path: "/admin/index"});
                            })
                            .catch(error => {
                                return error;
                            });
                    }
                });
            }
        }
    };
</script>
<style>
    #components-form-demo-normal-login .login-form {
        max-width: 300px;
    }

    #components-form-demo-normal-login .login-form-forgot {
        float: right;
    }

    #components-form-demo-normal-login .login-form-button {
        width: 100%;
    }
</style>
