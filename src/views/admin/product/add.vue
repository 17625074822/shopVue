<template>
  <a-layout-content id="nav-add" style="margin: 0 16px">
    <a-form :form="form">
      <!-- 分类id -->
      <a-form-item
        label="分类id"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-select
          v-decorator="[
            'category_id',
            {
              rules: [
                {
                  required: true,
                  message: '请选择分类id'
                }
              ]
            }
          ]"
          placeholder="请选择商品分类"
          @change="handleCateChange"
        >
          <a-select-option
            v-for="(item, index) in catelist"
            :value="item.id"
            :key="index"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <!-- 商品名 -->
      <a-form-item
        label="商品名"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          v-decorator="[
            'name',
            {
              rules: [{ required: true, message: '商品名不能为空！' }]
            }
          ]"
        >
        </a-input>
      </a-form-item>
      <!--  商品的描述-->
      <a-form-item
        label="商品描述"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-textarea
          placeholder="Basic usage"
          :rows="10"
          v-decorator="[
            'content',
            {
              rules: [{ required: true, message: '商品名不能为空！' }]
            }
          ]"
        />
      </a-form-item>
      <!-- 生产日期 -->
      <a-form-item
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
        label="生产日期"
        has-feedback
        validate-status="warning"
      >
        <a-date-picker
          @change="onChange"
          validate-status="success"
          showToday
          style="width: 100%"
          v-decorator="[
            'type1',
            {
              rules: [{ required: true, message: '生产日期不能为空！' }]
            }
          ]"
        />
      </a-form-item>
      <!-- 宣传语 -->
      <a-form-item
        label="宣传语"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          v-decorator="[
            'type2',
            {
              rules: [{ required: true, message: '宣传语不能为空！' }]
            }
          ]"
        ></a-input>
      </a-form-item>
      <!-- 图片 -->
      <a-form-item
        label="图片"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-upload
          name="file"
          :customRequest="submit"
          :multiple="true"
          :headers="headers"
          @change="handleChange"
        >
          <a-button> <a-icon type="upload" /> Click to Upload </a-button>
        </a-upload>
      </a-form-item>
      <!-- 排序 -->
      <a-form-item
        label="排序"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
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
        ></a-input>
      </a-form-item>
    </a-form>
    <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
      添加
    </a-button>
    <!-- 第二个表单 -->
    <a-form :form="form1">
      <!-- 原价 -->
      <a-form-item
        label="原价"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          placeholder="请输入原价"
          v-decorator="[
            'original_price',
            {
              rules: [
                {
                  required: true,
                  message: '原价不能为空！'
                },
                {
                  pattern: new RegExp(
                    /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
                  ),
                  message: '请输入正确的金额!'
                }
              ]
            }
          ]"
        />
      </a-form-item>
      <!-- 售价 -->
      <a-form-item
        label="售价"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          placeholder="请输入售价"
          v-decorator="[
            'price',
            {
              rules: [
                {
                  required: true,
                  message: '原价不能为空！'
                },
                {
                  pattern: new RegExp(
                    /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
                  ),
                  message: '请输入正确的金额!'
                }
              ]
            }
          ]"
        />
      </a-form-item>
      <!-- 属性-->
      <a-form-item
        v-for="(item, index) in attrList"
        :key="index"
        :label="item"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          :placeholder="`请输入${item}`"
          v-decorator="[
            `attr${index + 1}`,
            {
              rules: [{ required: true, message: '属性不能为空！' }]
            }
          ]"
        />
      </a-form-item>
      <!-- 库存 -->
      <a-form-item
        label="库存"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          placeholder="请输入库存"
          v-decorator="[
            'quantity',
            {
              rules: [
                { required: true, message: '库存不能为空！' },
                {
                  pattern: new RegExp(/^[0-9]*$/),
                  message: '只能输入数字!'
                }
              ]
            }
          ]"
        />
      </a-form-item>
      <!-- 排序 -->
      <a-form-item
        label="排序"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          v-decorator="[
            'skusort',
            {
              rules: [
                {
                  pattern: new RegExp(/^[0-9]*$/),
                  message: '只能输入数字!'
                }
              ]
            }
          ]"
        ></a-input>
      </a-form-item>
      <a-button key="submit" type="primary" :loading="loading1" @click="save">
        保存再记
      </a-button>
    </a-form>
  </a-layout-content>
</template>
<script>
import ip from "../../../api.js";
export default {
  data() {
    return {
      loading: false,
      loading1: false,
      tagImage: "",
      type: "",
      targetList: [],
      attrList: [],
      createTime: "",
      sku: [],
      data: [],
      catelist: [],
      prodlist: [],
      target_obj: [],
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" }),
      form1: this.$form.createForm(this, { name: "coordinated" }),
      headers: {
        authorization: "authorization-text"
      }
    };
  },
  methods: {
    //处理商品分类改变对应属性的变化
    handleCateChange(key) {
      console.log(key);
      for (let i in this.catelist) {
        if (this.catelist[i].id == key) {
          this.attrList = Object.values(JSON.parse(this.catelist[i].property));
          console.log(this.attrList);
        }
      }
    },
    //获取商品时间
    onChange(date, dateString) {
      console.log(date, dateString);
      this.createTime = dateString;
    },

    //保存再记
    save() {
      this.form1.validateFields().then(data => {
        data.sort = data.skusort;
        delete data.skusort;
        this.sku.push(data);
        this.form1.resetFields();
        delete this.sku.skusort;
        console.log(this.sku);
      });
    },
    //添加商品
    handleOk() {
      // this.loading = true;
      let config = {
        headers: {
          "Authorization": localStorage.getItem("token")
        }
      };
      this.form.validateFields().then(data => {
        console.log(data);
        this.tag = [
          { type: 1, value: this.createTime },
          { type: 2, value: data.type2 },
          { type: 3, value: this.tagImage }
        ];
        data.sku = this.sku;
        data.tag = this.tag;
        delete data.type1;
        delete data.type2;
        delete data.type3;
        console.log(this.tag);
        console.log(JSON.stringify(data));
        this.axios
          .post(ip.ip + "/product/create", JSON.stringify(data),config)
          .then(data => {
            console.log(data);
            this.$router.push("/admin/product/index");
          })
          .catch(error => {
            console.log(error);
          });
      });
    },

    submit(info) {
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      };

      let form = new FormData();
      form.append("name", info.file);
      this.axios
        .post(ip.ip + "/upload", form, config)
        .then(data => {
          console.log(data.data.fileName);
          this.tagImage = this.ip.ip + data.data.fileName;
        })
        .catch(error => {
          return error;
        });
    },
    //上传图片
    handleChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        this.$message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} file upload failed.`);
      }
    }
  },
  created() {
    let config = {
      headers: {
        "Authorization": localStorage.getItem("token")
      }
    };
    //获取分类列表
    this.axios
      .get(ip.ip + "/category",config)
      .then(data => {
        for (let i in data.data) {
          this.catelist.push(data.data[i]);
        }
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
