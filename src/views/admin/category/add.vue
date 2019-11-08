<template>
  <a-layout-content style="margin: 0 16px">
    <a-form :form="form">
      <!--  标题-->
      <a-form-item
        label="分类名"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          placeholder="请输入分类名"
          v-decorator="[
            'name',
            {
              rules: [
                {
                  required: true,
                  message: '分类名不能为空!'
                }
              ]
            }
          ]"
        />
      </a-form-item>
      <!-- 属性1 -->
      <a-form-item
        label="商品的属性1"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input placeholder="请输入属性1" />
      </a-form-item>
      <!-- 属性2 -->
      <a-form-item
        label="商品的属性2"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input placeholder="请输入属性2" v-decorator="['attr2']" />
      </a-form-item>
      <!-- 属性3 -->
      <a-form-item
        label="商品的属性3"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input placeholder="请输入属性3" v-decorator="['attr3']" />
      </a-form-item>
      <!-- 排序-->
      <a-form-item
        label="排序"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          placeholder="请输入排序"
          v-decorator="[
            'sort',
            {
              rules: [
                {
                  pattern: new RegExp(/^[0-9]*$/),
                  message: '只能输入数字!'
                }
              ]
            }
          ]"
        />
      </a-form-item>
    </a-form>
    <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
      添加
    </a-button>
  </a-layout-content>
</template>
<script>
import { message } from "ant-design-vue";
import { stringify } from "querystring";
import ip from "../../../api.js";
export default {
  data() {
    return {
      loading: false,
      type: "",
      targetList: [],
      data: [],
      catelist: [],
      prodlist: [],
      target_obj: [],
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" })
    };
  },
  methods: {
    //添加分类
    handleOk() {
      let config = {
        headers: {
          "Authorization": localStorage.getItem("token")
        }
      };
      this.loading = true;
      this.form.validateFields().then(data => {
        console.log(data);
        data.property = JSON.stringify({
          attr1: data.attr1,
          attr2: data.attr2,
          attr3: data.attr3
        });
        delete data.attr1;
        delete data.attr2;
        delete data.attr3;
        console.log(data);
        this.axios
          .post(ip.ip + "/category/create", stringify(data),config)
          .then(info => {
            console.log(info);
            let msg = "";
            if (info.status) {
              msg = "添加成功！！！";
            } else {
              msg = "添加失败！！！";
            }
            this.visible = false;
            this.loading = false;
            this.$router.push({ path: "/admin/category/index" });
            message.info(msg);
          })
          .catch(error => {
            return error;
          });
      });
    }
  }
};
</script>
<style lang="sass"></style>
