<template>
  <a-layout-content id="nav-add" style="margin: 0 16px">
    <a-form :form="form">
      <!-- 位置id -->
      <a-form-item
        label="位置ID"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-select
          v-decorator="[
            'position_id',
            {
              rules: [
                {
                  required: true,
                  message: '请选择位置ID'
                }
              ]
            }
          ]"
          placeholder="Select a option and change input text above"
        >
          <a-select-option
            v-for="(item, index) in position_obj"
            :value="item.id"
            :key="index"
          >
            {{ item.title }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <!--  标题-->
      <a-form-item
        label="标题"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          placeholder="请输入标题"
          v-decorator="[
            'title',
            {
              rules: [{ required: true, message: '标题不能为空!' }]
            }
          ]"
        />
      </a-form-item>
      <!-- 图片 -->
      <a-form-item
        label="图片"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          placeholder="请输入图片"
          v-decorator="[
            'picture',
            {
              rules: [{ required: true, message: '图片不能为空' }]
            }
          ]"
        />
      </a-form-item>
      <!-- type -->
      <a-form-item
        label="链接类型"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-select
          v-decorator="[
            'link_type',
            {
              rules: [
                {
                  required: true,
                  message: '请选择链接类型'
                }
              ]
            }
          ]"
          placeholder="Select a option and change input text above"
          @change="handleTypeChange"
        >
          <a-select-option
            v-for="(item, index) in type_obj"
            :value="item.id"
            :key="index"
          >
            {{ item.title }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <!-- target -->
      <a-form-item
        label="链接目标"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-select
          v-decorator="[
            'link_target',
            {
              rules: [
                {
                  required: true,
                  message: '请选择链接目标'
                }
              ]
            }
          ]"
          placeholder="Select a option and change input text above"
        >
          <a-select-option
            v-for="(item, index) in target_obj"
            :value="item.id"
            :key="index"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
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
//位置id
const position_obj = [
  {
    id: "1",
    title: "顶部导航"
  },
  {
    id: "2",
    title: "banner"
  },
  {
    id: "3",
    title: "图标"
  },
  {
    id: "4",
    title: "4张大图"
  }
];
//链接类型
const type_obj = [
  {
    id: "1",
    title: "商品分类页面"
  },
  {
    id: "2",
    title: "商品购买页面"
  },
  {
    id: "3",
    title: "商品活动页面"
  },
  {
    id: "4",
    title: "店铺"
  }
];
var config = {
  headers: {
    "Authorization": localStorage.getItem("token")
  }
};
export default {
  data() {
    return {
      loading: false,
      type: "",
      targetList: [],
      data: [],
      type_obj,
      position_obj,
      catelist: [],
      prodlist: [],
      target_obj: [],
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" })
    };
  },
  methods: {
    handleTypeChange(value) {
      console.log(value);
      if (value == 1) {
        this.target_obj = this.catelist;
      } else if (value == 2) {
        this.target_obj = this.prodlist;
      } else if (value == 3) {
        this.target_obj = [{ id: 1, name: "神秘双十一活动" }];
      } else if (value == 4) {
        this.target_obj = [{ id: 1, name: "Vans" }];
      } else {
        this.target_obj = [{ id: 1, name: "暂无" }];
      }
    },
    //添加导航
    handleOk() {
      this.loading = true;
      this.form.validateFields().then(data => {
        console.log(data);
        this.axios
          .post(ip.ip + "/nav/create", stringify(data),config)
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
            this.$router.push({ path: "/admin/nav/index" });
            message.info(msg);
          })
          .catch(error => {
            return error;
          });
      });
    }
  },
  created() {
    //获取分类列表
    this.axios
      .get(ip.ip + "/category",config)
      .then(data => {
        this.catelist = data.data;
        console.log(this.catelist);
      })
      .catch(error => {
        return error;
      });
    //获取商品列表
    this.axios
      .get(ip.ip + "/product",config)
      .then(data => {
        this.prodlist = data.data;
        console.log(this.prodlist);
      })
      .catch(error => {
        return error;
      });
  }
};
</script>
<style lang="sass"></style>
